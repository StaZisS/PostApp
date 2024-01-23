import {Link} from "react-router-dom";
import s from "./PostItemCard.module.scss";
import unpressedLike from "@/assets/img/like.svg";
import pressedLike from "@/assets/img/fill_like.svg";
import comment from "@/assets/img/comment.svg";
import {useState} from "react";
import {MAX_LENGTH} from "@/shared/constants/page.ts";
import {axiosInstance} from "@/app/interceptor.tsx";

interface Tag {
    id: string;
    createTime: string;
    name: string;
}

interface IPostItemCardProps {
    id: string;
    title: string;
    tags: Tag[];
    addressId: string;
    author: string | null;
    authorId: string;
    commentsCount: number;
    communityId: string;
    communityName: string;
    createTime: string;
    description: string;
    hasLike: boolean;
    image: string;
    likes: number;
    readingTime: number;
}

const PostItemCard = ({
                          id,
                          title,
                          addressId,
                          tags,
                          author,
                          authorId,
                          commentsCount,
                          communityId,
                          communityName,
                          createTime,
                          description,
                          hasLike,
                          image,
                          likes,
                          readingTime,
                      }: IPostItemCardProps) => {
    const [like, setLike] = useState(hasLike);
    const [likeCount, setLikeCount] = useState(likes);
    const [isShort, setIsShort] = useState(description.length > MAX_LENGTH);

    const handleLike = async () => {
        try {
            const response = !like ?
                await axiosInstance.post(
                    `post/${id}/like`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                ) :
                await axiosInstance.delete(
                    `post/${id}/like`,
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

    const getTimeString = (time: string) => {
        const date = new Date(time);
        return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    };

    return (
        <div className={s.PostItemCard}>
            <div className={s.postHeader}>

                <div className={s.postHeaderInfo}>
          <span>
            {author} - {getTimeString(createTime)} {communityName && (
              <span>в сообществе {communityName}</span>
          )}
          </span>
                </div>

                <div className={s.postHeaderTitle}>
                    <Link to={`/item/${id}`} state={{scrollState: false}} className={s.btn}>
                        <h2>{title}</h2>
                    </Link>
                </div>

                <hr/>
            </div>

            {image && (
                <div className={s.postImage}>
                    <img src={image} alt={title}/>
                </div>
            )}

            <div className={s.postBody}>
                <span>{isShort ? description.slice(0, MAX_LENGTH) : description}</span>
                {description.length > MAX_LENGTH &&
                    <button onClick={() => setIsShort(!isShort)}>{isShort ? "Читать далее" : "Свернуть"}</button>}
            </div>

            <div className={s.postTags}>
                {tags.map((tag) => (
                    <span key={tag.id}>#{tag.name} </span>
                ))}
            </div>

            <div className={s.postTimeRead}>
                <span>Время чтения: {readingTime} минут</span>
            </div>

            <div className={s.postFooter}>

                <div className={s.postComments}>
                    <Link to={`/item/${id}`} state={{scrollState: true}} className={s.btn}>
                        <img src={comment}/>
                        <span>{commentsCount}</span>
                    </Link>
                </div>

                <div className={s.postLikes}>
                    <img src={(hasLike ? true : like) ? pressedLike : unpressedLike} onClick={handleLike}/>
                    <span>{likeCount}</span>
                </div>

            </div>
        </div>
    );
};

export default PostItemCard;
