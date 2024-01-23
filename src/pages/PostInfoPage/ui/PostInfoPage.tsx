import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchPost, selectPost, selectPostError, selectPostLoading,} from "@/modules/PostInfo/Model/slice";
import {useParams} from "react-router-dom";
import {AppDispatch} from "@/store/store";
import PostInfo from "../components/PostInfo/PostInfo.tsx";
import {IPost} from "@/modules/PostInfo/Model/types.ts";

const PostInfoPage = () => {
    const {postId} = useParams<{ postId: string }>();
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPost({postId}));
    }, [dispatch, postId]);

    const post: IPost | null = useSelector(selectPost);
    const isLoading: boolean = useSelector(selectPostLoading);
    const error: string | null = useSelector(selectPostError);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <>
            <PostInfo post={post}/>
        </>
    );
};

export default PostInfoPage;
