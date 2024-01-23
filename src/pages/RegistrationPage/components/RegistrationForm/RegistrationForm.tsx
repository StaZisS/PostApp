import React, {useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import s from "./RegistrationForm.module.scss";
import InputMask from "react-input-mask";
import {useNavigate} from "react-router-dom";
import {BASE_URL} from "@/shared/constants/url.ts";

const RegistrationForm = () => {
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const formik = useFormik({
        initialValues: {
            fullName: "",
            gender: "Male",
            password: "",
            email: "",
            phoneNumber: "",
            dob: null,

        },
        validationSchema: Yup.object({
            phoneNumber: Yup.string()
                .matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, "Invalid phone number")
                .required("Обязательное поле"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Обязательное поле"),
            password: Yup.string()
                .min(6, "Пароль должен содержать не менее 6 символов")
                .required("Обязательное поле"),

            fullName: Yup.string().required("Обязательное поле"),
        }),
        onSubmit: async (values) => {
            try {
                const formattedData = {
                    fullName: values.fullName,
                    password: values.password,
                    email: values.email,
                    createdTime: new Date(Date.now()),
                    birthDate: selectedDate?.toISOString() || null,
                    gender: values.gender,
                    phoneNumber: values.phoneNumber,
                };

                console.log(formattedData);
                localStorage.setItem("email", formattedData.email);
                const response = await axios.post(
                    `${BASE_URL}account/register`,
                    formattedData
                );
                navigate("/profile");
                localStorage.setItem("token", response.data.token);
                console.log("Registration successful. Token:", response.data.token);
            } catch (error) {
                console.error("Registration failed:", error);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className={s.form}>
            <h2>Регистрация нового пользователя</h2>
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
                    <label htmlFor="gender">Пол</label>
                    <select
                        id="gender"
                        name="gender"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.gender}
                    >
                        <option value="Male">Мужчина</option>
                        <option value="Female">Женщина</option>
                    </select>
                    {formik.touched.gender && formik.errors.gender ? (
                        <div>{formik.errors.gender}</div>
                    ) : null}
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
                <div className={s.formItem}>
                    <label htmlFor="dob">Дата рождения:</label>
                    <DatePicker
                        id="dob"
                        name="dob"
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            formik.setFieldValue("dob", date);
                        }}
                        dateFormat="dd/MM/yyyy"
                    />
                </div>

                <div className={s.formItem}>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div>{formik.errors.email}</div>
                    ) : null}
                </div>
                <div className={s.formItem}>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div>{formik.errors.password}</div>
                    ) : null}
                </div>
                <button className={s.registerButton} type="submit">Register</button>
            </div>
        </form>
    );
};

export default RegistrationForm;
