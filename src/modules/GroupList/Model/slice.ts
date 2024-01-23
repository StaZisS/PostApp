import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosInstance} from "@/app/interceptor.tsx";
import {ICommunity} from "@/modules/GroupList/Model/types.ts";
import {RootState} from "@/store/store.tsx";
import {initialState} from "@/modules/GroupList/Model/state.ts";

export const fetchCommunityList = createAsyncThunk<ICommunity[], void>(
    "communityList",
    async () => {
        const response = await axiosInstance.get(
            `community`
        );
        return response.data;
    }
);

const communityListSlice = createSlice({
    name: "communityList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommunityList.pending, (state) => {
                state.loading = "pending";
            })
            .addCase(fetchCommunityList.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.communities = action.payload;
            })
            .addCase(fetchCommunityList.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.error.message || null;
            });
    },
});

export const selectCommunityList = (state: RootState): ICommunity[] | null =>
    state.communityList.communities;

export const selectCommunityListLoading = (state: RootState): boolean =>
    state.postInfo.loading === "pending";

export const selectCommunityListError = (state: RootState): string | null =>
    state.postInfo.error;

export default communityListSlice.reducer;