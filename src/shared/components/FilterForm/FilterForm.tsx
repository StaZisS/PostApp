import React, {useEffect, useState} from "react";
import s from "./FilterForm.module.scss";
import {BASE_URL} from "@/shared/constants/url";
import axios from "axios";
import {Tag} from "@/modules/MenuList/Model/types.ts";
import Select from "react-select";

interface IFilterFormProps {
    tags: string[];
    author: string | null;
    sorting: string | undefined;
    min: number | null;
    max: number | null;
    onlyMyCommunities: boolean | undefined;
    onApplyFilters: (paramMap: Map<string, string>) => void;

    tagsVisible: boolean;
    authorVisible: boolean;
    sortingVisible: boolean;
    minVisible: boolean;
    maxVisible: boolean;
    onlyMyCommunitiesVisible: boolean;
}

const FilterForm = ({
                        tags,
                        author,
                        sorting,
                        min,
                        max,
                        onlyMyCommunities,
                        onApplyFilters,
                        tagsVisible,
                        authorVisible,
                        sortingVisible,
                        minVisible,
                        maxVisible,
                        onlyMyCommunitiesVisible
                    }: IFilterFormProps) => {
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [params, setParams] = useState<Map<string, string>>(new Map<string, string>());

    const options = [
        {value: 'CreateDesc', label: 'Сначала новые'},
        {value: 'CreateAsc', label: 'Сначала старые'},
        {value: 'LikeAsc', label: 'Сначала популярные'},
        {value: 'LikeDesc', label: 'Сначала непопулярные'}
    ];

    useEffect(() => {

    }, [params]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get<Tag[]>(`${BASE_URL}tag`, {});
                const tags = response.data;
                setAvailableTags(tags);
            } catch (error) {
                console.error("Ошибка при получении тегов:", error);
            }
        };
        params.clear();
        params.set("tags", tags.join(","));
        params.set("author", author || "");
        params.set("sorting", sorting || "");
        params.set("min", min?.toString() || "");
        params.set("max", max?.toString() || "");
        params.set("onlyMyCommunities", onlyMyCommunities?.toString() || "");
        setParams(params);
        fetchTags();
    }, []);

    const handleParamsChange = (key: string, value: string) => {
        params.set(key, value);
        setParams(new Map<string, string>(params));
    };

    return (
        <div className={s.FilterBlock}>
            <div className={s.Label}>
                <label>Фильтры:</label>
            </div>

            <div className={s.InfoFilterBlocks}>
                <div className={s.InfoBlock}>
                    {authorVisible && (
                        <div>
                            <div className={s.Selector}>
                                <label>Поиск по имени автора</label>
                                <input
                                    type="text"
                                    value={params.get("author")}
                                    onChange={(e) => handleParamsChange("author", e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className={s.Info}>
                        {sortingVisible && (
                            <div className={s.Selector}>
                                <label>Сортировать</label>
                                <Select className={s.SortSelector}
                                        value={options.find(option => option.value === params.get("sorting"))}
                                        onChange={(e) => handleParamsChange("sorting", e === null ? "" : e.value)}
                                        options={options}
                                />
                            </div>
                        )}

                        {minVisible && (
                            <div className={s.Selector}>
                                <label>Время чтения от</label>
                                <input
                                    type="number"
                                    value={params.get("min")}
                                    onChange={(e) => handleParamsChange("min", e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                </div>

                <div className={s.InfoBlock}>

                    {tagsVisible && (
                        <div>
                            <label>Поиск по тэгам:</label>
                            <div className={s.tagList}>
                                <Select
                                    value={availableTags.filter((tag) => params.get("tags").split(",").includes(tag.id)).map((tag) => ({
                                        value: tag.id,
                                        label: tag.name,
                                    }))}
                                    onChange={(selectedOptions) => {
                                        const selectedTags = selectedOptions.map((option) => option.value);
                                        handleParamsChange("tags", selectedTags.join(","));
                                    }}
                                    options={availableTags.map((tag) => ({
                                        value: tag.id,
                                        label: tag.name,
                                    }))}
                                    isMulti={true}
                                    className={s.tagSelector}
                                />
                            </div>
                        </div>
                    )}

                    {(onlyMyCommunitiesVisible || maxVisible) && (
                        <div className={s.Info}>
                            <div className={s.Info}>
                                {maxVisible && (
                                    <div className={s.Selector}>
                                        <label>Время чтения до:</label>
                                        <input
                                            type="number"
                                            value={params.get("max")}
                                            onChange={(e) => handleParamsChange("max", e.target.value)}
                                        />
                                    </div>
                                )}

                                {onlyMyCommunitiesVisible && (
                                    <div className={s.Selector}>
                                        <label className={s.onlyMyLabel}>Только мои группы</label>
                                        <input
                                            type="checkbox"
                                            checked={params.get("onlyMyCommunities") === "true"}
                                            onChange={(e) => handleParamsChange("onlyMyCommunities", e.target.checked.toString())}
                                        />
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                    <div className={s.ButtonBlock}>
                        <button onClick={() => onApplyFilters(params)}>Применить фильтры</button>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default FilterForm;