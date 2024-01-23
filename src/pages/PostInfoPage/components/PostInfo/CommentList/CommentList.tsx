import CommentItem, {ICommentItemProps} from "@/shared/components/CommentItem/CommentItem.tsx";
import s from "./CommentList.module.scss";
import {getRandomColor} from "@/shared/helpers/getRandomColor.ts";
import {CSSProperties} from "react";


export interface CommentListProps {
    comments: ICommentItemProps[];
    parentCommentId: string | null;
    postId: string;
}

const CommentList = ({comments, parentCommentId, postId}: CommentListProps) => {
    const conditionalStyle: CSSProperties | undefined = parentCommentId ? {borderLeft: `2px solid ${getRandomColor()}`} : undefined;

    return (
        <div className={parentCommentId == null ? s.CommentListRoot : s.CommentList} style={conditionalStyle}>
            {comments.map((c) => (
                <CommentItem
                    comment={c.comment} parentCommentId={parentCommentId} subComments={comments} postId={postId}
                />
            ))}
        </div>
    )
}

export default CommentList;