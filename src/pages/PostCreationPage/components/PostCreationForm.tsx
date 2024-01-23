import AddressForm from "@/shared/components/AddressForm/AddressForm.tsx";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {toast, ToastContainer} from "react-toastify";
import {axiosInstance} from "@/app/interceptor.tsx";
import {Tag} from "@/modules/MenuList/Model/types.ts";
import {useLocation, useNavigate} from "react-router-dom";
import s from "./PostCreationForm.module.scss";
import Select from "react-select";

interface CreatePostData {
    title: string;
    description: string;
    readingTime: number;
    image: string;
    addressId: string;
    tags: string[];
}

interface IUserRoleInCommunity {
    communityId: string;
    communityName: string;
    role: string;
}

const PostCreationForm = () => {
    const [GUID, setGUID] = useState("");
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [userAdminCommunities, setUserAdminCommunities] = useState<IUserRoleInCommunity[]>([]);
    const location = useLocation();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            readingTime: 0,
            image: "",
            tags: [],
            communityId: "",
        },
        validationSchema: Yup.object({
            //TODO: add validation
            /*            title: Yup.string()
                            .min(1, "Минимум 1 символ")
                            .max(60, "Максимум 60 символов")
                            .required("Обязательное поле"),
                        description: Yup.string()
                            .min(10, "Минимум 10 символов")
                            .required("Обязательное поле"),
                        readingTime: Yup.number()
                            .min(1, "Минимум 1 минута")
                            .max(120, "Максимум 2 часа")
                            .required("Обязательное поле"),*/
        }),
        onSubmit: async (values) => {
            const createDto: CreatePostData = {
                title: values.title,
                description: values.description,
                readingTime: values.readingTime,
                image: values.image,
                addressId: GUID,
                tags: values.tags,
            };
            try {
                if (values.communityId) {
                    await createCommunityPost(createDto, values.communityId);
                } else {
                    await createPost(createDto);
                }
                toast.success("Пост успешно создан");
                navigate("/");
            } catch (error) {
                toast.error("Ошибка при создании поста");
            }
        },
    });

    const createPost = async (createDto: CreatePostData): Promise<string> => {
        const response = await axiosInstance.post(
            `post`,
            {
                ...createDto,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data;
    };

    const createCommunityPost = async (createDto: CreatePostData, communityId: string): Promise<string> => {
        const response = await axiosInstance.post(
            `community/${communityId}/post`,
            {
                ...createDto,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data;
    };

    const handleGUIDChange = (guid: string) => {
        setGUID(guid);
    };

    const fetchTags = async () => {
        try {
            const response = await axiosInstance.get<Tag[]>(`tag`, {});
            const tags = response.data;
            setAvailableTags(tags);
        } catch (error) {
            console.error("Ошибка при получении тегов:", error);
        }
    };

    const fetchCommunityWhereUserIsAdmin = async () => {
        try {
            const response = await axiosInstance.get<IUserRoleInCommunity[]>(`community/my`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const communities: IUserRoleInCommunity[] = await Promise.all(
                response.data
                    .filter((community) => community.role === "Administrator")
                    .map(async (community) => {
                        const communityInfo = await axiosInstance.get(`community/${community.communityId}`, {});
                        return {
                            communityId: community.communityId,
                            communityName: communityInfo.data.name,
                            role: community.role,
                        };
                    })
            );
            setUserAdminCommunities(communities);
        } catch (error) {
            console.error("Ошибка при получении тегов:", error);
        }
    };

    useEffect(() => {
        fetchTags();
        fetchCommunityWhereUserIsAdmin();
    }, [location]);

    return (
        <form onSubmit={formik.handleSubmit} className={s.form}>
            <h2>Создание поста</h2>
            <div className={s.formWrapper}>
                <div className={s.formItem}>
                    <div className={s.SelectBlock}>
                        <label htmlFor="title">Название</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.title}
                        />
                        {formik.touched.title && formik.errors.title ? (
                            <div>{formik.errors.title}</div>
                        ) : null}
                    </div>
                    <div className={s.SelectBlock}>
                        <label htmlFor="readingTime">Время чтения</label>
                        <input
                            id="readingTime"
                            name="readingTime"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.readingTime}
                        />
                        {formik.touched.readingTime && formik.errors.readingTime ? (
                            <div>{formik.errors.readingTime}</div>
                        ) : null}
                    </div>
                </div>

                <div className={s.formItem}>
                    <div className={s.SelectBlock}>
                        <label htmlFor="communityId">Группа</label>
                        <Select
                            value={formik.values.communityId ?
                                {
                                    value: formik.values.communityId,
                                    label: userAdminCommunities.find((c) => c.communityId === formik.values.communityId)?.communityName
                                } :
                                null
                            }
                            onChange={(selectedOption) => formik.setFieldValue("communityId", selectedOption?.value)}
                            options={[
                                {value: "", label: "---"},
                                ...userAdminCommunities.map((community) => ({
                                    value: community.communityId,
                                    label: community.communityName,
                                })),
                            ]}
                        />
                    </div>

                    <div className={s.SelectBlock}>
                        <label htmlFor="tags">Тэги</label>
                        <Select
                            isMulti={true}
                            value={availableTags.filter((tag) => formik.values.tags.includes(tag.id)).map((tag) => ({
                                value: tag.id,
                                label: tag.name,
                            }))}
                            onChange={(selectedOptions) => {
                                const selectedTags = selectedOptions.map((option) => option.value);
                                formik.setFieldValue("tags", selectedTags);
                            }}
                            options={availableTags.map((tag) => ({
                                value: tag.id,
                                label: tag.name,
                            }))}
                        />
                    </div>
                </div>

                <div className={s.formItem}>
                    <label htmlFor="image">Ссылка на картинку</label>
                    <input
                        id="image"
                        name="image"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.image}
                    />
                    {formik.touched.image && formik.errors.image ? (
                        <div>{formik.errors.image}</div>
                    ) : null}
                </div>

                <div className={`${s.formItem} ${s.field}`}>
                    <label htmlFor="description">Текст</label>
                    <textarea
                        id="description"
                        name="description"
                        // type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                    />
                    {formik.touched.description && formik.errors.description ? (
                        <div>{formik.errors.description}</div>
                    ) : null}
                </div>

                <AddressForm
                    onGUIDChange={handleGUIDChange}
                />
                <ToastContainer/>
                <button type="submit">Создать</button>
            </div>
        </form>
    )
}

export default PostCreationForm;