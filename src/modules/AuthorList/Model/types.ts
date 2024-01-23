export interface AuthorListInfoState {
    authors: IAuthor[];
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: string | null;
}

export interface IAuthor {
    fullName: string;
    birthDate: string;
    gender: string;
    posts: number;
    likes: number;
    created: string;
}