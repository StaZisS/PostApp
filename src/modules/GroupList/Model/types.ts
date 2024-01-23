export interface CommunityListInfoState {
    communities: ICommunity[];
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: string | null;
}

export interface ICommunity {
    id: string;
    createdTime: string;
    name: string;
    description: string;
    isClosed: boolean;
    subscribersCount: number;
}
