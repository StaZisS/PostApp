import {useLocation, useParams, useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/store.tsx";
import {fetchCommunity} from "@/modules/CommunityInfo/Model/slice.ts";
import {selectIsAuthenticated} from "@/modules/Auth/Model/slice.ts";
import {fetchCommunityPosts} from "@/modules/PostList/Model/thunk";
import Pagination from "@/shared/components/Pagination/Pagination.tsx";
import FilterForm from "@/shared/components/FilterForm/FilterForm.tsx";
import PostItemCard from "@/pages/PostPage/components/PostItemCard/PostItemCard.tsx";
import s from "./CommunitiePage.module.scss";
import {axiosInstance} from "@/app/interceptor.tsx";
import man from "@/assets/img/man_icon.svg";
import woman from "@/assets/img/woman_icon.svg";
import community_icon from "@/assets/img/community_icon.svg";
import {toast, ToastContainer} from "react-toastify";

const CommunitiePage = () => {
    const {id} = useParams<{ id: string }>();
    const community = useSelector((state: RootState) => state.communityInfo);
    const posts = useSelector((state: RootState) => state.communityPost);
    const dispatch: AppDispatch = useDispatch();
    const location = useLocation();
    const [userRoleInCommunity, setUserRoleInCommunity] = useState<string | null>("");
    const [tags, setTags] = useState<string[]>([]);
    const [sorting, setSorting] = useState<string | undefined>(undefined);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(5);
    const [params, setParams] = useSearchParams();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const fetchUserRoleInCommunity = async () => {
        try {

            const response = await axiosInstance.get<string>(`community/${id}/role`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setUserRoleInCommunity(response.data);
        } catch (error) {
            console.error("Ошибка при получении роли пользователя в сообществе:", error);
        }
    }

    const getQueryParams = () => {
        const searchParams = new URLSearchParams(location.search);
        const tags = searchParams.getAll("tags");
        const sorting = searchParams.get("sorting");
        const page = searchParams.get("page");
        const size = searchParams.get("size");
        return {tags, sorting, page, size};
    }

    const createFiltersParam = (): any => {
        const {tags, sorting, page, size} = getQueryParams();
        setTags(tags !== null ? tags : []);
        setSorting(sorting !== null ? sorting : undefined);
        setPage(page !== null ? parseInt(page) : 1);
        setSize(size !== null ? parseInt(size) : 5);

        const paramsToRequest: any = {};

        if (tags.length > 0) {
            paramsToRequest.tags = tags;
        }
        if (sorting) {
            paramsToRequest.sorting = sorting;
        }
        if (page) {
            paramsToRequest.page = page;
        }
        if (size) {
            paramsToRequest.size = size;
        }
        paramsToRequest.idCommunity = id;

        return paramsToRequest;
    };

    const processFilters = () => {
        dispatch(fetchCommunity({id}))
        if (isAuthenticated) {
            fetchUserRoleInCommunity();
        }
    }

    const handleApplyFilters = (paramMap: Map<string, string>) => {
        paramMap.forEach((value, key) => {
            handleChange(key, value)
        });
    }

    const handleSubscribe = async () => {
        const response = await axiosInstance.post(
            `community/${id}/subscribe`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        if (response.status === 200) {
            toast.success(`Вы подписались на сообщество ${community.community?.name}`);
            setUserRoleInCommunity("Subscriber")
        } else {
            toast.error(`Ошибка при подписке на сообщество ${community.community?.name}`);
        }
    };

    const handleUnsubscribe = async () => {
        const response = await axiosInstance.delete(
            `community/${id}/unsubscribe`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        if (response.status === 200) {
            toast.success(`Вы отписались от сообщества ${community.community?.name}`);
            setUserRoleInCommunity(null);
        } else {
            toast.error(`Ошибка при отписке от сообщества ${community.community?.name}`);
        }
    };

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
        if (name === "sorting" && value !== "") {
            updatedParams.set("sorting", value.toString() || "CreateDesc");
        }
        if (name === "size") {
            updatedParams.set("size", value.toString());
        }

        setParams(updatedParams);
    }

    useEffect(() => {
        processFilters()
    }, [dispatch, location]);

    useEffect(() => {
        if (userRoleInCommunity === undefined) return;
        if (userRoleInCommunity !== null || !community.community?.isClosed) {
            const params = createFiltersParam();
            console.log(params);
            console.log(userRoleInCommunity, community.community?.isClosed);
            dispatch(fetchCommunityPosts(params))
        }
    }, [userRoleInCommunity, location]);

    if (community.loading === "pending") {
        return <div>Loading...</div>;
    }

    if (community.loading === "failed") {
        return <div>Error: {community.error}</div>;
    }

    return (
        <div>
            <ToastContainer/>

            <div className={s.CommunityInfo}>
                <div className={s.header}>
                    <div className={s.title}>
                        <span>{community.community?.name}</span>
                    </div>
                    <div className={s.headerButtons}>
                        {!isAuthenticated && (
                            <div>
                                <span>Авторизуйтесь чтобы подписаться на сообщество</span>
                            </div>
                        )}
                        {userRoleInCommunity === "Subscriber" && (
                            <div>
                                <button className={s.unsubscribeButton} onClick={() => handleUnsubscribe()}>Отписаться
                                </button>
                            </div>
                        )}
                        {isAuthenticated && userRoleInCommunity === null && (
                            <div>
                                <button className={s.subscribeButton} onClick={() => handleSubscribe()}>Подписаться
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={s.description}>
                    <div className={s.subscribers}>
                        <img src={community_icon}/>
                        <span>{community.community?.subscribersCount} подписчиков</span>
                    </div>
                    <div className={s.typeCommunity}>
                        <span>Тип сообщества: {community.community?.isClosed ? "закрытое" : "открытое"}</span>
                    </div>
                </div>

                <div className={s.administrators}>
                    {community.community?.administrators.map((a) => (
                        <div className={s.administrator}>
                            <div>
                                <img src={a.gender === "Male" ? man : woman} alt="Аватар автора"/>
                            </div>
                            <div>
                                <span>{a.fullName}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {(userRoleInCommunity !== null || !community.community?.isClosed) && (
                <div>
                    <FilterForm
                        tags={tags}
                        author={null}
                        sorting={sorting}
                        min={null}
                        max={null}
                        onlyMyCommunities={undefined}
                        onApplyFilters={handleApplyFilters}
                        tagsVisible={true}
                        sortingVisible={true}
                        minVisible={false}
                        maxVisible={false}
                        authorVisible={false}
                        onlyMyCommunitiesVisible={false}
                    />

                    <div className={s.PostList}>
                        {posts.posts.map((p) => (
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
                        pageCount={posts.pagination.count}
                        size={size}
                        onPageChange={handleChange}
                    />
                </div>
            )}
        </div>
    )
}

export default CommunitiePage;