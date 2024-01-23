import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/store";
import PostItemCard from "../PostItemCard/PostItemCard";
import s from "./PostList.module.scss";
import {Link, useLocation, useSearchParams} from "react-router-dom";
import {fetchPost} from "@/modules/PostList/Model/thunk";
import Pagination from "@/shared/components/Pagination/Pagination";
import FilterForm from "@/shared/components/FilterForm/FilterForm";
import {selectIsAuthenticated} from "@/modules/Auth/Model/slice.ts";

const PostList = () => {
    const dispatch: AppDispatch = useDispatch();
    const post = useSelector((state: RootState) => state.post);
    const location = useLocation();
    const [tags, setTags] = useState<string[]>([]);
    const [author, setAuthor] = useState<string | null>(null);
    const [min, setMin] = useState<number | null>(null);
    const [max, setMax] = useState<number | null>(null);
    const [sorting, setSorting] = useState<string | undefined>(undefined);
    const [onlyMyCommunities, setOnlyMyCommunities] = useState<boolean | undefined>(false);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(5);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [params, setParams] = useSearchParams();

    const getQueryParams = () => {
        const searchParams = new URLSearchParams(location.search);
        const tags = searchParams.getAll("tags");
        const author = searchParams.get("author");
        const min = searchParams.get("min");
        const max = searchParams.get("max");
        const sorting = searchParams.get("sorting");
        const onlyMyCommunities = searchParams.get("onlyMyCommunities");
        const page = searchParams.get("page");
        const size = searchParams.get("size");
        return {tags, author, min, max, sorting, onlyMyCommunities, page, size};
    };

    const handleApplyFilters = (paramMap: Map<string, string>) => {
        paramMap.forEach((value, key) => {
            handleChange(key, value)
        });
    }

    const createFiltersParam = (): any => {
        const {tags, author, min, max, sorting, onlyMyCommunities, page, size} = getQueryParams();
        setTags(tags !== null ? tags : []);
        setAuthor(author !== null ? author : null);
        setMin(min !== null ? parseInt(min) : null);
        setMax(max !== null ? parseInt(max) : null);
        setSorting(sorting !== null ? sorting : undefined);
        setOnlyMyCommunities(onlyMyCommunities !== null ? onlyMyCommunities === "true" : undefined);
        setPage(page !== null ? parseInt(page) : 1);
        setSize(size !== null ? parseInt(size) : 4);

        const paramsToRequest: any = {};

        if (tags.length > 0) {
            paramsToRequest.tags = tags;
        }
        if (author !== '' && author !== null) {
            paramsToRequest.author = author;
        }
        if (min !== null) {
            paramsToRequest.min = min;
        }
        if (max !== null) {
            paramsToRequest.max = max;
        }
        if (sorting) {
            paramsToRequest.sorting = sorting;
        }
        if (onlyMyCommunities) {
            paramsToRequest.onlyMyCommunities = onlyMyCommunities;
        }
        if (page) {
            paramsToRequest.page = page;
        }
        if (size) {
            paramsToRequest.size = size;
        }

        return paramsToRequest;
    };

    const processFilters = () => {
        const params = createFiltersParam();

        console.log("Sending request with parameters:", params);
        dispatch(fetchPost(params));
    }

    useEffect(() => {
        processFilters();
    }, [dispatch, location]);

    const handleChange = (name: string, value: string) => {
        const updatedParams = params;
        if (name === "tags") {
            const tagList = value.split(",");
            updatedParams.delete("tags");
            tagList.forEach((tag) => updatedParams.append("tags", tag));
        }

        if (value === "" || value === null) {
            updatedParams.delete(name);
        }
        if (name === "page" && value !== "") {
            updatedParams.set("page", value.toString());
        }
        if (name === "author" && value !== "") {
            updatedParams.set("author", value.toString());
        }
        if (name === "min" && value !== "") {
            updatedParams.set("min", value.toString());
        }
        if (name === "max" && value !== "") {
            updatedParams.set("max", value.toString());
        }
        if (name === "sorting" && value !== "") {
            updatedParams.set("sorting", value.toString() || "CreateDesc");
        }
        if (name === "onlyMyCommunities" && value !== "") {
            updatedParams.set("onlyMyCommunities", value.toString());
        }
        if (name === "size") {
            updatedParams.set("size", value.toString());
        }

        setParams(updatedParams);
    };

    if (post.loading === "pending") {
        return <div>Loading...</div>;
    }

    if (post.loading === "failed") {
        return <div>Error: {post.error}</div>;
    }

    return (
        <div>

            {isAuthenticated && (
                <div className={s.createPostButton}>
                    <Link to={"/post/create"} className={s.linkToPage}>Создать пост</Link>
                </div>
            )}

            <FilterForm
                tags={tags}
                author={author}
                sorting={sorting}
                min={min}
                max={max}
                onlyMyCommunities={onlyMyCommunities}
                onApplyFilters={handleApplyFilters}
                tagsVisible={true}
                sortingVisible={true}
                minVisible={true}
                maxVisible={true}
                authorVisible={true}
                onlyMyCommunitiesVisible={true}
            />

            <div className={s.PostList}>
                {post.posts.map((p) => (
                    <PostItemCard
                        key={p.id}
                        addressId={p.addressId}
                        author={p.author}
                        authorId={p.authorId}
                        commentsCount={p.commentsCount}
                        communityId={p.communityId}
                        communityName={p.communityName}
                        createTime={p.createTime}
                        description={p.description}
                        hasLike={p.hasLike}
                        id={p.id}
                        image={p.image}
                        likes={p.likes}
                        readingTime={p.readingTime}
                        tags={p.tags}
                        title={p.title}
                    />
                ))}
            </div>

            <Pagination
                page={page}
                pageCount={post.pagination.count}
                size={size}
                onPageChange={handleChange}
            />

        </div>
    );
};

export default PostList;
