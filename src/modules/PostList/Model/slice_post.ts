import {createSlice} from "@reduxjs/toolkit";
import {initialState} from "./state";
import {fetchPost} from "./thunk";

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPost.pending, (state) => {
                state.loading = "pending";
            })
            .addCase(fetchPost.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.posts = action.payload.posts;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchPost.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.error.message;
            });
    },
});

export default menuSlice.reducer;
