import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosInstance} from "@/app/interceptor.tsx";
import {RootState} from "@/store/store.tsx";
import {IAuthor} from "@/modules/AuthorList/Model/types.ts";
import {initialState} from "@/modules/AuthorList/Model/state.ts";

export const fetchAuthors = createAsyncThunk<IAuthor[], void>(
    "authorList",
    async () => {
        const response = await axiosInstance.get(
            `author/list`
        );
        return response.data;
    }
);

const authorListSlice = createSlice({
    name: "authorList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuthors.pending, (state) => {
                state.loading = "pending";
            })
            .addCase(fetchAuthors.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.authors = action.payload;
            })
            .addCase(fetchAuthors.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.error.message || null;
            });
    },
});

export const selectAuthorList = (state: RootState): IAuthor[] | null =>
    state.authorList.authors;

export const selectAuthorListLoading = (state: RootState): boolean =>
    state.postInfo.loading === "pending";

export const selectAuthorListError = (state: RootState): string | null =>
    state.postInfo.error;

export default authorListSlice.reducer;