import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {AuthData} from "./types";
import {clearToken, setToken} from "./slice";
import {BASE_URL} from "@/shared/constants/url.ts";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (data: AuthData, {dispatch}) => {
        try {
            const response = await axios.post(
                `${BASE_URL}account/login`,
                data
            );
            const token = response.data.token;
            localStorage.setItem("token", token);
            localStorage.setItem("email", data.email);
            console.log("token", response.data);

            dispatch(setToken(token));
        } catch (error) {
            console.error("Login failed:", error);
            throw new Error("Login failed");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, {dispatch}) => {
        try {
            const response = await axios.post(
                `${BASE_URL}account/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            localStorage.getItem("token");
            console.log(response.data, "logout");

            dispatch(clearToken());
            localStorage.clear();
        } catch (error) {
            console.error("Logout failed:", error);
            if (
                (error.response && error.response.status === 403) ||
                (error.response && error.response.status === 401)
            ) {
                dispatch(clearToken());
            }
        }
    }
);
