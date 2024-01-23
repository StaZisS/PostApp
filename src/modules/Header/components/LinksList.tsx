import {Link} from "react-router-dom";
import s from "../ui/Header.module.scss";

export const LinksList = () => {
    return (
        <div className={s.LinksList}>

            <Link to={"/"} className={s.item}>
                Главная
            </Link>

            <Link to="/authors/" className={s.item}>
                Авторы
            </Link>

            <Link to={"/communities/"} className={`${s.item} ${s.cart}`}>
                Группы
            </Link>

        </div>
    );
};
