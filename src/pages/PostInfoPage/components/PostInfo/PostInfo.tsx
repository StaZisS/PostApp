import {useEffect, useRef, useState} from "react";
import {IPost} from "@/modules/PostInfo/Model/types";
import s from "./PostInfo.module.scss";
import comment from "@/assets/img/comment.svg";
import pressedLike from "@/assets/img/fill_like.svg";
import unpressedLike from "@/assets/img/like.svg";
import addressPoint from "@/assets/img/addressPoint.svg";
import {useFullAddress} from "@/shared/hooks/useFullAddress.ts";
import CommentList from "@/pages/PostInfoPage/components/PostInfo/CommentList/CommentList.tsx";
import {useSelector} from "react-redux";
import {selectIsAuthenticated} from "@/modules/Auth/Model/slice.ts";
import {axiosInstance} from "@/app/interceptor.tsx";
import {useLocation} from "react-router-dom";


interface PostInfoProps {
    post: IPost;
}

const PostInfo = ({post}: PostInfoProps) => {
    const [like, setLike] = useState(post.hasLike);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [commentContent, setCommentContent] = useState<string>("");
    const fullAddress = useFullAddress(post.addressId || null);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const commentRef = useRef<HTMLDivElement | null>(null);
    const scrollState = useLocation().state?.scrollState;

    const scrollToElement = () => {
        commentRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        if (scrollState) {
            scrollToElement();
        }
    }, []);

    const handleLike = async () => {
        try {
            const response = !like ?
                await axiosInstance.post(
                    `post/${post.id}/like`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                ) :
                await axiosInstance.delete(
                    `post/${post.id}/like`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
            if (response.status === 200) {
                setLike(!like)
                setLikeCount(like ? likeCount - 1 : likeCount + 1)
            }
        } catch (error) {
            console.error("Failed to like:", error);
        }
    };

    const handleComment = async () => {
        try {
            const response =
                await axiosInstance.post(
                    `post/${post.id}/comment`,
                    {
                        content: commentContent,
                        parentId: null
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
            if (response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to like:", error);
        }
    }

    const getTimeString = (time: string) => {
        const date = new Date(time);
        return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    };

    return (
        <div className={s.PostInfoWrapper}>
            <div className={s.PostInfo}>

                <div className={s.postHeader}>
                    <div className={s.postHeaderInfo}>
            <span>
                {post.author} - {getTimeString(post.createTime)} {post.communityName && (
                <span>в сообществе {post.communityName}</span>
            )}
            </span>
                    </div>

                    <div className={s.postHeaderTitle}>
                        <h2>{post.title}</h2>
                    </div>

                    <hr/>
                </div>

                {post.image && (
                    <div className={s.postImage}>
                        <img src={post.image} alt={post.title}/>
                    </div>
                )}

                <div className={s.postBody}>
                    <span>{post.description}</span>
                </div>

                <div className={s.postTags}>
                    {post.tags.map((tag) => (
                        <span key={tag.id}>#{tag.name} </span>
                    ))}
                </div>

                <div className={s.postTimeRead}>
                    <span>Время чтения: {post.readingTime} минут</span>
                </div>

                {post.addressId && (
                    <div className={s.addressChain}>
                        <img src={addressPoint}/>
                        <span>{fullAddress}</span>
                    </div>
                )}

                <div className={s.postFooter}>
                    <div className={s.postComments}>
                        <img src={comment}/>
                        <span>{post.commentsCount}</span>
                    </div>
                    <div className={s.postLikes}>
                        <img src={(post.hasLike ? true : like) ? pressedLike : unpressedLike} onClick={handleLike}/>
                        <span>{likeCount}</span>
                    </div>
                </div>
            </div>

            {post.comments.length ? (
                <div ref={commentRef} className={s.comments}>
                    <CommentList
                        comments={post.comments.map((c) => ({
                            comment: c,
                            parentCommentId: null,
                            subComments: [],
                            postId: post.id,
                        }))}
                        parentCommentId={null}
                        postId={post.id}
                    />
                </div>
            ) : (
                <div className={s.comments}>
                    <span>Комментариев пока нет</span>
                </div>
            )}

            {isAuthenticated ? (
                <div className={s.commentField}>
                    <span>Оставите комментарий</span>
                    <input
                        type="text"
                        placeholder={"Оставьте комментарий..."}
                        value={commentContent}
                        onChange={(event) => setCommentContent(event.target.value)}
                    />
                    <button onClick={() => handleComment()}>Отправить</button>
                </div>
            ) : (
                <div className={s.commentField}>
                    <span>Оставьте комментарий</span>
                    <span>Войдите, чтобы оставить комментарий</span>
                </div>
            )}

        </div>
    );
};

export default PostInfo;
