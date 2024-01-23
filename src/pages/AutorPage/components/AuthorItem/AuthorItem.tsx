import s from './AuthorItem.module.scss';
import man from "@/assets/img/man_icon.svg";
import woman from "@/assets/img/woman_icon.svg";
import firstPosition from "@/assets/img/crown_icon_first.svg";
import secondPosition from "@/assets/img/crown_icon_second.svg";
import thirdPosition from "@/assets/img/crown_icon_third.svg";
import {Link} from "react-router-dom";

export interface IAuthorProps {
    fullName: string;
    birthDate: string;
    gender: string;
    posts: number;
    likes: number;
    created: string;
    position: number;
}

const AuthorItem = ({
                        fullName,
                        birthDate,
                        gender,
                        posts,
                        likes,
                        created,
                        position
                    }: IAuthorProps) => {
    return (
        <div className={s.author}>
            <div className={s.info}>
                <div className={s.photo}>
                    <img src={gender === "Male" ? man : woman} alt="Аватар автора"/>
                    {position === 1 && <img src={firstPosition} alt="Позиция автора" className={s.crownIcon}/>}
                    {position === 2 && <img src={secondPosition} alt="Позиция автора" className={s.crownIcon}/>}
                    {position === 3 && <img src={thirdPosition} alt="Позиция автора" className={s.crownIcon}/>}
                </div>

                <div className={s.aboutAuthor}>
                    <div className={s.AuthorInfo}>
                        <div className={s.authorName}>
                            <Link to={`/?author=${fullName}`}>
                                <span>{fullName}</span>
                            </Link>
                        </div>
                        <div className={s.createdTime}>
                            <span>Создан: {new Date(created).toLocaleDateString("ru-RU")}</span>
                        </div>
                    </div>
                    <div className={s.birthDate}>
                        <span>Дата рождения: {new Date(birthDate).toLocaleDateString("ru-RU")}</span>
                    </div>
                </div>
            </div>

            <div className={s.postsAndLikes}>
                <div>
                    <span>Постов: {posts}</span>
                </div>

                <div>
                    <span>Лайков: {likes}</span>
                </div>
            </div>
        </div>
    )
}

export default AuthorItem;