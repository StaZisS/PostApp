import {CommunityInfoState} from "@/modules/CommunityInfo/Model/types.ts";

export const initialState: CommunityInfoState = {
    community: null,
    loading: "idle",
    error: null,
}