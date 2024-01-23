import {useDispatch, useSelector} from "react-redux";
import {useFormik} from "formik";
import * as Yup from "yup";
import {loginUser} from "@/modules/Auth/Model/thunk";
import {AppDispatch, RootState} from "@/store/store";
import {Link, useNavigate} from "react-router-dom";
import s from "./LoginForm.module.scss";
import {clearToken, selectIsAuthenticated} from "@/modules/Auth/Model/slice";

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) =>
        selectIsAuthenticated(state)
    );

    if (localStorage.getItem("token") === null) {
        dispatch(clearToken());
    }

    if (isAuthenticated) {
        navigate("/profile");
    }
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("Обязательное поле"),
            password: Yup.string().required("Обязательное поле"),
        }),
        onSubmit: async (values) => {
            try {
                await dispatch(loginUser(values));
            } catch (error) {
                console.error("Login failed:", error);
            }
        },
    });

    return (
        <div className={s.formWrapper}>
            <form onSubmit={formik.handleSubmit} className={s.form}>
                <div className={s.headerTitle}>
                    <h2>Авторизация</h2>
                </div>

                <div className={s.inputGroup}>
                    <input
                        className={s.inputGroup__input}
                        type="email"
                        id="email"
                        name="email"
                        placeholder="&nbsp;"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <label className={s.inputGroup__label} htmlFor="username">
                        Email
                    </label>
                </div>
                <div className={s.inputGroup}>
                    <input
                        className={s.inputGroup__input}
                        type="password"
                        id="password"
                        name="password"
                        placeholder="&nbsp;"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <label className={s.inputGroup__label} htmlFor="password">
                        Пароль
                    </label>
                </div>

                <button className={s.loginButton} type="submit">Login</button>
                <span>
          Или{" "}
                    <u>
            <Link className={s.linkToRegister} to={"/registration/"}>зарегестрируйтесь</Link>
          </u>
          , если у вас еще нет аккаунта
        </span>
            </form>
        </div>
    );
};

export default LoginForm;
