import {Link} from "react-router-dom";
import {HeaderLogo} from "../components/HeaderLogo";
import {LinksList} from "../components/LinksList";
import s from "./Header.module.scss";
import {selectIsAuthenticated} from "@/modules/Auth/Model/slice";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "@/modules/Auth/Model/thunk";
import {AppDispatch} from "@/store/store";
import HeaderLinksIcons from "../components/HeaderLinksIcons/HeaderLinksIcons";


export const Header = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch: AppDispatch = useDispatch();


    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <div className={s.header}>
            <HeaderLogo/>
            <LinksList/>
            <HeaderLinksIcons/>
            {!isAuthenticated && (
                <div className={s.authButtons}>
                    <Link to="/registration/" className={s.item}>
                        Зарегистрироваться
                    </Link>
                    <Link to="/login" className={s.item}>
                        Войти
                    </Link>
                </div>
            )}

            {isAuthenticated && (
                <div className={s.userProfile}>
                    <Link to="/profile" className={s.item}>
                        <p className={s.email}>{localStorage.getItem("email")}</p>
                    </Link>
                    <button onClick={handleLogout} className={s.logoutButton}>
                        Выйти
                    </button>
                </div>
            )}
        </div>
    );
};

export default Header;
