export interface Post {
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
}

export interface Tag {
    id: string;
    createTime: string;
    name: string;
}

export interface Pagination {
    size: number;
    count: number;
    current: number;
}

export interface PostState {
    posts: Post[];
    loading: "idle" | "pending" | "succeeded" | "failed";
    error?: string;
    pagination: Pagination;
}
