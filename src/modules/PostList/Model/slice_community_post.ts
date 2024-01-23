import {createSlice} from "@reduxjs/toolkit";
import {initialState} from "@/modules/PostList/Model/state.ts";
import {fetchCommunityPosts} from "@/modules/PostList/Model/thunk.ts";

const communityPostListSlice = createSlice({
    name: "communityPostList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommunityPosts.pending, (state) => {
                state.loading = "pending";
            })
            .addCase(fetchCommunityPosts.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.posts = action.payload.posts;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchCommunityPosts.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.error.message;
            });
    },
});

export default communityPostListSlice.reducer;