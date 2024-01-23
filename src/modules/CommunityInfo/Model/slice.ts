import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosInstance} from "@/app/interceptor.tsx";
import {CommunityParams, ICommunityFull} from "@/modules/CommunityInfo/Model/types.ts";
import {initialState} from "@/modules/CommunityInfo/Model/state.ts";
import {RootState} from "@/store/store.tsx";

export const fetchCommunity = createAsyncThunk<ICommunityFull, CommunityParams>(
    "communityInfo/fetchCommunity",
    async (params, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get(
                `community/${params.id}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const communityInfoSlice = createSlice({
    name: "communityInfo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommunity.pending, (state) => {
                state.loading = "pending";
            })
            .addCase(fetchCommunity.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.community = action.payload;
            })
            .addCase(fetchCommunity.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.error.message || null;
            });
    },
});

export const selectCommunity = (state: RootState): ICommunityFull | null =>
    state.communityInfo.community;

export const selectCommunityLoading = (state: RootState): boolean =>
    state.communityInfo.loading === "pending";

export const selectCommunityError = (state: RootState): string | null =>
    state.communityInfo.error;

export default communityInfoSlice.reducer;