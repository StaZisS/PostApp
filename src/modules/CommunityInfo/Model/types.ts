export interface CommunityInfoState {
    community: ICommunityFull | null;
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: string | null;
}

export interface ICommunityFull {
    id: string;
    createdTime: string;
    name: string;
    description: string;
    isClosed: boolean;
    subscribersCount: number;
    administrators: IUser[];
}

export interface IUser {
    id: string;
    createdTime: string;
    fullName: string;
    birthDate: string;
    gender: string;
    email: string;
    phoneNumber: string;
}

export interface CommunityParams {
    id?: string;
}