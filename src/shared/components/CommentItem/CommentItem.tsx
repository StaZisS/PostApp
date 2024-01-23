import s from "./CommentItem.module.scss";
import {IComment} from "@/modules/PostInfo/Model/types.ts";
import {useState} from "react";
import CommentList from "@/pages/PostInfoPage/components/PostInfo/CommentList/CommentList.tsx";
import {BASE_URL} from "@/shared/constants/url.ts";
import {selectIsAuthenticated} from "@/modules/Auth/Model/slice.ts";
import {useSelector} from "react-redux";
import editIcon from "@/assets/img/edit_icon.svg";
import trashIcon from "@/assets/img/trash_icon.svg";
import {axiosInstance} from "@/app/interceptor.tsx";

export interface ICommentItemProps {
    comment: IComment;
    parentCommentId: string | null;
    subComments: ICommentItemProps[];
    postId: string;
}

const CommentItem = ({
                         comment, parentCommentId, subComments, postId
                     }: ICommentItemProps) => {
    const [showSubComments, setShowSubComments] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [subCommentsList, setSubCommentsList] = useState<ICommentItemProps[]>([]);
    const [editContent, setEditContent] = useState<string>(comment.content);
    const [commentContent, setCommentContent] = useState<string>("");
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userId = localStorage.getItem("userId");

    const fetchSubComments = async (rootId: string) => {
        try {
            const response = await axiosInstance.get<IComment[]>(`comment/${comment.id}/tree`, {});
            const comments = response.data;
            const tree = getTree(comments, rootId);
            setSubCommentsList(tree);
        } catch (error) {
            console.error("Ошибка при получении комментариев:", error);
        }
    }

    const sendComment = async () => {
        try {
            const response =
                await axiosInstance.post(
                    `${BASE_URL}post/${postId}/comment`,
                    {
                        content: commentContent,
                        parentId: comment.id
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
            if (response.status === 200) {
                window.location.reload();
                setCommentContent("");
            }
        } catch (error) {
            console.error("Ошибка при отправке комментария:", error);
        }
    }

    const editComment = async () => {
        try {
            const response =
                await axiosInstance.put(
                    `${BASE_URL}comment/${comment.id}`,
                    {
                        content: editContent,
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
            console.error("Ошибка при изменении комментария:", error);
        }
    }

    const deleteComment = async () => {
        try {
            const response =
                await axiosInstance.delete(
                    `comment/${comment.id}`,
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
            console.error("Ошибка при удалении комментария:", error);
        }
    }

    const getTree = (comments: IComment[], rootId: string): ICommentItemProps[] => {
        const tree: ICommentItemProps[] = [];
        let currentIndex = 0;

        const buildNode = (root: string): ICommentItemProps => {
            const node = {
                comment: comments[currentIndex],
                parentCommentId: root,
                subComments: []
            };

            currentIndex++;

            for (let i = 0; i < node.comment.subComments; i++) {
                node.subComments.push(buildNode(node.comment.id));
            }

            return node;
        };

        while (currentIndex < comments.length) {
            tree.push(buildNode(rootId));
        }

        return tree;
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => setter(event.target.value);


    return (
        <div className={s.CommentItem}>
            {comment.deleteDate === null ? (
                <div className={s.author}>
                    <span>{comment.author}</span>
                    {comment.authorId === userId && (
                        <div>
                            <img src={editIcon} onClick={() => setShowEditForm(!showEditForm)}/>
                            <img src={trashIcon} onClick={deleteComment}/>
                        </div>
                    )}
                </div>
            ) : (
                <div className={s.author}>
                    <span>[Комментарий удален]</span>
                </div>
            )}

            {comment.deleteDate === null ? (
                <div className={s.content}>
                    <span>{comment.content}</span>
                    {comment.modifiedDate !== null && (
                        <div className={s.modifiedBlock}>
                            <span className={s.modified}>(изменен)</span>
                            <span
                                className={s.modifiedInfo}>{new Date(comment.modifiedDate).toLocaleString("ru-RU")}</span>
                        </div>
                    )}
                </div>
            ) : (
                <span>[Комментарий удален]</span>
            )}

            <div className={s.commentFooter}>
                <div>
                    <span>{new Date(comment.createTime).toLocaleString("ru-RU")}</span>
                </div>

                {comment.deleteDate === null && (
                    <div>
                        {isAuthenticated && (
                            <div>
                                <span
                                    onClick={() => setShowReplyForm(!showReplyForm)}>{!showReplyForm ? "Ответить" : "Отменить"}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showEditForm && (
                <div className={s.inputField}>
                    <input
                        type="text"
                        value={editContent}
                        onChange={(event) => handleInputChange(event, setEditContent)}
                        placeholder={"Измените комментарий..."}
                    />
                    <button onClick={() => editComment()}>Редактировать</button>
                </div>
            )}

            {showReplyForm && (
                <div className={s.inputField}>
                    <input
                        type="text"
                        value={commentContent}
                        onChange={(event) => handleInputChange(event, setCommentContent)}
                        placeholder={"Оставьте комментарий..."}
                    />
                    <button onClick={() => sendComment()}>Отправить</button>
                </div>
            )}

            {comment.subComments > 0 && (<div className={s.openSubComments}>
                {showSubComments &&
                    (<CommentList
                        comments={
                            parentCommentId == null ?
                                subCommentsList :
                                subComments.find(c => c.comment.id === comment.id)?.subComments || []
                        }
                        parentCommentId={comment.id}
                        postId={postId}
                    />)
                }
                <span onClick={() => {
                    if (parentCommentId == null) fetchSubComments(comment.id);
                    setShowSubComments(!showSubComments);
                }}>{showSubComments ? "Скрыть ответы" : "Показать ответы"}
                </span>
            </div>)}
        </div>
    )
}

export default CommentItem;