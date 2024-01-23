import {AuthorListInfoState} from "@/modules/AuthorList/Model/types.ts";

export const initialState: AuthorListInfoState = {
    authors: [],
    loading: "idle",
    error: null,
};