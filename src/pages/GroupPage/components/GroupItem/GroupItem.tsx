import {axiosInstance} from "@/app/interceptor.tsx";
import React, {useEffect, useState} from "react";
import s from './GroupItem.module.scss';
import {useSelector} from "react-redux";
import {selectIsAuthenticated} from "@/modules/Auth/Model/slice.ts";
import {Link} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";

export interface ICommunityProps {
    id: string;
    createdTime: string;
    name: string;
    description: string;
    isClosed: boolean;
    subscribersCount: number;
}

const GroupItem = ({
                       id,
                       createdTime,
                       name,
                       description,
                       isClosed,
                       subscribersCount
                   }: ICommunityProps) => {
    const [userRoleInCommunity, setUserRoleInCommunity] = useState<string | null>("");
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const fetchUserRoleInCommunity = async () => {
        try {
            const response = await axiosInstance.get<string>(`community/${id}/role`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setUserRoleInCommunity(response.data);
        } catch (error) {
            console.error("Ошибка при получении роли пользователя в сообществе:", error);
        }
    }

    const handleSubscribe = async () => {
        const response = await axiosInstance.post(
            `community/${id}/subscribe`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        if (response.status === 200) {
            toast.success(`Вы подписались на сообщество ${name}`);
            setUserRoleInCommunity("Subscriber")
        } else {
            toast.error(`Ошибка при подписке на сообщество ${name}`);
        }
    };

    const handleUnsubscribe = async () => {
        const response = await axiosInstance.delete(
            `community/${id}/unsubscribe`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        if (response.status === 200) {
            toast.success(`Вы отписались от сообщества ${name}`);
            setUserRoleInCommunity(null);
        } else {
            toast.error(`Ошибка при отписке от сообщества ${name}`);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserRoleInCommunity();
        }
    }, []);

    return (
        <div>
            <ToastContainer/>
            <div className={s.communityItem}>

                <div className={s.nameCommunity}>
                    <Link to={`/communities/${id}/post`}>
                        <span>{name}</span>
                    </Link>
                </div>

                <div>
                    {!isAuthenticated && (
                        <div>
                            <span>Авторизуйтесь чтобы подписаться на сообщество</span>
                        </div>
                    )}
                    {isAuthenticated && userRoleInCommunity === null && (
                        <div>
                            <button className={s.subscribeButton} onClick={() => handleSubscribe()}>Подписаться</button>
                        </div>
                    )}
                    {isAuthenticated && userRoleInCommunity === "Subscriber" && (
                        <div>
                            <button className={s.unsubscribeButton} onClick={() => handleUnsubscribe()}>Отписаться
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GroupItem;