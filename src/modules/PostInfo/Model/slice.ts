import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {IPost, PostInfoParams} from "./types";
import {initialState} from "./state";
import {RootState} from "@/store/store";
import {axiosInstance} from "@/app/interceptor.tsx";

export const fetchPost = createAsyncThunk<IPost, PostInfoParams>(
    "postInfo/fetchPost",
    async (params, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get(
                `post/${params.postId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching post:", error);
            return rejectWithValue(error.message);
        }
    }
);

const postInfoSlice = createSlice({
    name: "postInfo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPost.pending, (state) => {
                state.loading = "pending";
            })
            .addCase(fetchPost.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.post = action.payload;
            })
            .addCase(fetchPost.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.error.message || null;
            });
    },
});

export const selectPost = (state: RootState): IPost | null =>
    state.postInfo.post;

export const selectPostLoading = (state: RootState): boolean =>
    state.postInfo.loading === "pending";

export const selectPostError = (state: RootState): string | null =>
    state.postInfo.error;

export default postInfoSlice.reducer;
