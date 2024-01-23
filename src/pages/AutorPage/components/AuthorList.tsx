import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/store.tsx";
import AuthorItem, {IAuthorProps} from "@/pages/AutorPage/components/AuthorItem/AuthorItem.tsx";
import {useEffect} from "react";
import {fetchAuthors} from "@/modules/AuthorList/Model/slice.ts";
import s from "./AuthorList.module.scss";

const AuthorList = () => {
    const authors = useSelector((state: RootState) => state.authorList);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAuthors());
    }, [dispatch]);

    if (authors.loading === "pending") {
        return <div>Loading...</div>;
    }

    if (authors.loading === "failed") {
        return <div>Error: {authors.error}</div>;
    }

    const authorItems: IAuthorProps[] = authors.authors.map((a) => ({
        fullName: a.fullName,
        birthDate: a.birthDate,
        gender: a.gender,
        posts: a.posts,
        likes: a.likes,
        created: a.created,
        position: 0,
    }));

    const sortedAuthorItems = authorItems.sort((a, b) => {
        const popularityComparison = b.posts - a.posts || b.likes - a.likes;
        return popularityComparison;
    });

    const authorItemsWithPosition = sortedAuthorItems.map((a, index) => ({
        ...a,
        position: index + 1,
    }));

    const sortedAuthorItemsByFullName = authorItemsWithPosition.slice().sort((a, b) => a.fullName.localeCompare(b.fullName));

    return (
        <div className={s.authorList}>
            {sortedAuthorItemsByFullName.map((a) => (
                <AuthorItem
                    fullName={a.fullName}
                    birthDate={a.birthDate}
                    gender={a.gender}
                    posts={a.posts}
                    likes={a.likes}
                    created={a.created}
                    position={a.position}
                />
            ))}
        </div>
    )
}

export default AuthorList;