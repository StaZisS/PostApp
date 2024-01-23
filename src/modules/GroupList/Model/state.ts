import {CommunityListInfoState} from "@/modules/GroupList/Model/types.ts";

export const initialState: CommunityListInfoState = {
    communities: [],
    loading: "idle",
    error: null,
}