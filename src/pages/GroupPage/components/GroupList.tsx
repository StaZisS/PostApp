import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/store.tsx";
import {useEffect} from "react";
import {fetchCommunityList} from "@/modules/GroupList/Model/slice.ts";
import GroupItem from "@/pages/GroupPage/components/GroupItem/GroupItem.tsx";
import s from "./GroupList.module.scss";

const GroupList = () => {
    const groups = useSelector((state: RootState) => state.communityList);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCommunityList());
    }, [dispatch]);

    if (groups.loading === "pending") {
        return <div>Loading...</div>;
    }

    if (groups.loading === "failed") {
        return <div>Error: {groups.error}</div>;
    }

    return (
        <div className={s.groupList}>
            {groups.communities.map((g) => (
                <GroupItem
                    id={g.id}
                    createdTime={g.createdTime}
                    name={g.name}
                    description={g.description}
                    isClosed={g.isClosed}
                    subscribersCount={g.subscribersCount}
                />
            ))}
        </div>
    )
}

export default GroupList;