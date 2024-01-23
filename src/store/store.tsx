import {configureStore} from "@reduxjs/toolkit";
import postReducer from "@/modules/PostList/Model/slice_post.ts";
import communitiePostReducer from "@/modules/PostList/Model/slice_community_post.ts";
import postInfoReducer from "@/modules/PostInfo/Model/slice";
import authorListReducer from "@/modules/AuthorList/Model/slice";
import communityListReducer from "@/modules/GroupList/Model/slice";
import communityReducer from "@/modules/CommunityInfo/Model/slice";
import authSlice from "@/modules/Auth/Model/slice";

export const store = configureStore({
    reducer: {
        post: postReducer,
        communityPost: communitiePostReducer,
        postInfo: postInfoReducer,
        auth: authSlice,
        authorList: authorListReducer,
        communityList: communityListReducer,
        communityInfo: communityReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
