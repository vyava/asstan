import { useRouter } from "next/router";
import { useQuery } from "react-query";
import List from "src/components/list";
import { MapFilter } from "src/components/mapFilter";
import { bayiFetcher } from "src/fetchers/bayiler";
import styles from "./sidebar.module.scss";
import { SideBarProps } from "src/components/component_interfaces";
import { IBayiPoint, ITownLine } from "src/types/map";

const Sidebar = ({pingsData, townsData} : SideBarProps<IBayiPoint[], ITownLine[]>) => {
    const router = useRouter();

    const { page, limit } = router.query;

    const { isLoading, error, data, isSuccess } = useQuery(["bayilerJson", { page, limit }], bayiFetcher, {
        initialData: [],
        select: res => res
    });

    return (
        <div className={styles.root}>
            {/* <MapFilter /> */}
            <div className={styles.heading}>
                <h2>Arama Sonuçları :</h2>
                <b>30 Bayi</b>
            </div>
            <List pagination={false}>
                <List.Body rows={data} />
            </List>
        </div>
    )
};

export default Sidebar;