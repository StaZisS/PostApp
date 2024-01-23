import {PostState} from "./types";

export const initialState: PostState = {
    posts: [],
    pagination: {
        size: 0,
        count: 0,
        current: 0,
    },
    loading: "idle",
    error: undefined,
};
