import {Tag} from "@/modules/MenuList/Model/types.ts";

export interface PostInfoState {
    post: IPost | null;
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: string | null;
}

export interface IPost {
    id: string;
    createTime: string;
    title: string;
    description: string;
    readingTime: number;
    image: string;
    authorId: string;
    author: string;
    communityId: string;
    communityName: string;
    addressId: string;
    likes: number;
    hasLike: boolean;
    commentsCount: number;
    tags: Tag[];
    comments: IComment[];
}

export interface IComment {
    id: string;
    createTime: string;
    content: string;
    modifiedDate: string;
    deleteDate: string;
    authorId: string;
    author: string;
    subComments: number;
}

export interface PostInfoParams {
    postId?: string;
}
