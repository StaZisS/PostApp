import {createAsyncThunk} from "@reduxjs/toolkit";
import {PostState} from "./types";
import {BASE_URL} from "@/shared/constants/url";
import {axiosInstance} from "@/app/interceptor.tsx";

interface FetchPostParams {
    tags: string[];
    author: string;
    min: string;
    max: string;
    sorting: string;
    onlyMyCommunities: string;
    page: number;
    size: number;
}

interface FetchCommunityPostsParams {
    tags: string[];
    author: string;
    min: string;
    max: string;
    sorting: string;
    onlyMyCommunities: string;
    page: number;
    size: number;
    idCommunity: string;
}

export const fetchPost = createAsyncThunk<PostState, FetchPostParams>(
    "post/fetchPost",
    async (params) => {
        let query = "";
        if (params.tags) {
            params.tags.forEach((item) => {
                query += `tags=${item}&`;
            });
        }

        const response = await axiosInstance.get(
            `${BASE_URL}post?${query}`,
            {
                params: {
                    sorting: params.sorting,
                    author: params.author,
                    min: params.min,
                    max: params.max,
                    onlyMyCommunities: params.onlyMyCommunities,
                    page: params.page,
                    size: params.size,
                },
            }
        );
        return response.data;
    }
);

export const fetchCommunityPosts = createAsyncThunk<PostState, FetchCommunityPostsParams>(
    "post/fetchCommunityPosts",
    async (params) => {
        let query = "";
        if (params.tags) {
            params.tags.forEach((item) => {
                query += `tags=${item}&`;
            });
        }

        const response = await axiosInstance.get(
            `community/${params.idCommunity}/post?${query}`,
            {
                params: {
                    sorting: params.sorting,
                    author: params.author,
                    min: params.min,
                    max: params.max,
                    onlyMyCommunities: params.onlyMyCommunities,
                    page: params.page,
                    size: params.size,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data;
    }
);