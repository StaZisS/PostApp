import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import s from "./ProfileForm.module.scss";
import InputMask from "react-input-mask";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectIsAuthenticated} from "@/modules/Auth/Model/slice";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {BASE_URL} from "@/shared/constants/url.ts";

interface UserData {
    fullName: string;
    birthDate: string;
    gender: string;
    address: string;
    email: string;
    phoneNumber: string;
    id: string;
}

const ProfileForm = () => {
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    const formik = useFormik({
        initialValues: {
            fullName: `${userData?.fullName}`,
            gender: "Male",
            password: "",
            email: "",
            phoneNumber: `${userData?.phoneNumber}`,
            dob: selectedDate
                ? new Date(selectedDate!).toISOString()
                : userData?.birthDate,
        },
        validationSchema: Yup.object({
            phoneNumber: Yup.string()
                .matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, "Invalid phone number")
                .required("Обязательное поле"),
        }),
        onSubmit: async (values) => {
            try {
                const updatedData = {
                    fullName: values.fullName,
                    birthDate: selectedDate
                        ? new Date(selectedDate!).toISOString()
                        : userData?.birthDate,
                    gender: values.gender,
                    phoneNumber: values.phoneNumber,
                    email: values.email,
                };

                console.log("Updated Data:", updatedData);
                await updateProfile(updatedData);
                toast.success("Профиль успешно обновлен!");
            } catch (error) {
                console.error("Failed to update profile:", error);
            }
        },
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}account/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setUserData(response.data);
            localStorage.setItem("userId", response.data.id);
            const formattedDate = response.data.birthDate.split("T")[0];

            formik.setValues({
                fullName: response.data.fullName,
                gender: response.data.gender,
                phoneNumber: response.data.phoneNumber,
                dob: formattedDate,
                email: response.data.email,
                password: "",
            });
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    const updateProfile = async (updatedData) => {
        try {
            await axios.put(
                `${BASE_URL}account/profile`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            console.log("Profile updated successfully:", updatedData);
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    return (
        <form onSubmit={formik.handleSubmit} className={s.form}>
            <h2>Профиль</h2>
            <div className={s.formWrapper}>
                <div className={s.formItem}>
                    <label htmlFor="fullName">Фио</label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.fullName}
                    />
                    {formik.touched.fullName && formik.errors.fullName ? (
                        <div>{formik.errors.fullName}</div>
                    ) : null}
                </div>

                <div className={s.formItem}>
                    <label htmlFor="email">Email:</label>
                    <p>{userData?.email}</p>
                </div>
                <div className={s.formItem}>
                    <label htmlFor="dob">Дата рождения:</label>
                    <input
                        id="dob"
                        name="dob"
                        type="date"
                        value={formik.values.dob}
                        onChange={(event) => {
                            const selectedDate = event.target.value;
                            setSelectedDate(selectedDate);

                            formik.setFieldValue("dob", selectedDate);
                        }}
                    />
                </div>

                <div className={s.formItem}>
                    <label htmlFor="gender">Пол</label>
                    <p>{userData?.gender === "Male" ? "Мужской" : "Женский"}</p>
                </div>
                <div className={s.formItem}>
                    <label htmlFor="phoneNumber">Телефон</label>
                    <InputMask
                        mask="+7 (999) 999-99-99"
                        maskChar=" "
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        placeholder="+7 (___) ___-__-__"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phoneNumber}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                        <div>{formik.errors.phoneNumber}</div>
                    ) : null}
                </div>
                <ToastContainer/>
                <button className={s.editButton} type="submit">Обновить</button>
            </div>
        </form>
    );
};

export default ProfileForm;
