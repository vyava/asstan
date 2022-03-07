import { useRouter } from "next/router";
import { useQuery } from "react-query";
import List from "src/components/list";
import { MapFilter } from "src/components/mapFilter";
import { bayiFetcher, useBayiler } from "src/fetchers/bayiler";
import styles from "./sidebar.module.scss";
import { SidebarProps } from "src/components/component_interfaces";
import { IBayiPoint, ITownLine } from "src/types/map";
import { IBayi } from "src/interfaces/bayi.interface";
import { IDistrictUser } from "src/interfaces/district.interface";
import { useDistricts } from "src/fetchers/districts";

const MapSidebar = ({ bayilerData }: SidebarProps<IBayi[], IDistrictUser[]>) => {

    return (
        <div className={styles.root}>
            <MapFilter />
            {/* <div className={styles.heading}>
                <h2>Arama Sonuçları :</h2>
                <b>30 Bayi</b>
            </div> */}
            <List pagination={false} _pathname="/map">
                <List.Body rows={bayilerData} />
            </List>
        </div>
    )
};

export default MapSidebar;