import {Link} from "react-router-dom";
import tink from "@/assets/img/logo_tink.svg";
import s from "../ui/Header.module.scss";

export const HeaderLogo = () => (
    <Link to={"/"}>
        <div className={s.logo}>
            <img src={tink} alt="logo"/>
        </div>
    </Link>
);
