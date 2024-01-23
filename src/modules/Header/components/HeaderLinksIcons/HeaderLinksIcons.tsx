import {Link} from "react-router-dom";
import profileLink from "@/assets/img/profileLink.svg";
import authorLink from "@/assets/img/writing_icon.svg";
import groupLink from "@/assets/img/group_icon.svg";
import s from "./HeaderLinksIcons.module.scss";

const HeaderLinksIcons = () => {
    return (
        <div className={s.HeaderLinksIcons}>
            <Link to="/profile">
                <img className={s.icon} src={profileLink} alt="profile"/>
            </Link>
            <Link to="/authors">
                <img className={s.icon} src={authorLink} alt="author"/>
            </Link>
            <Link to="/communities">
                <img className={s.icon} src={groupLink} alt="group"/>
            </Link>
        </div>
    );
};

export default HeaderLinksIcons;
