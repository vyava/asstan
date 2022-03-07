import { useRouter } from "next/router";
import { useQuery } from "react-query";
import List from "src/components/list";
import { MapFilter } from "src/components/mapFilter";
import styles from "./sidebar.module.scss";
import { SidebarProps } from "src/components/component_interfaces";
import { IBayiPoint, ITownLine } from "src/types/map";
import { IBayi } from "src/interfaces/bayi.interface";
import { IDistrictUser } from "src/interfaces/district.interface";
import { useDistricts } from "src/fetchers/districts";
import { useContext, useEffect } from "react";
import { mapContext } from "src/contexts/map.context";
import { Pagination } from "src/components/pagination";

const MapSidebar = ({ bayilerData }: SidebarProps<IBayi[], IDistrictUser[]>) => {
    const { usePagination } = useContext(mapContext);

    const {data : paginator} = usePagination();

    return (
        <div className={styles.root}>
            <MapFilter />
            <div className={styles.heading}>
                <h2>Arama Sonuçları :</h2>
                <b>{paginator?.totalItems} Bayi</b>
            </div>
            <List _pathname="/map">
                <List.Body rows={bayilerData} />
            </List>
            <Pagination config={{_pathname : "/map"}}>
                <Pagination.First number={1} />
                <Pagination.Prev number={paginator?.prev} />

                <Pagination.Items totalPage={paginator?.totalPages} />

                <Pagination.Next number={paginator?.next} />
                <Pagination.Last number={paginator?.pageSize} />
            </Pagination>
        </div>
    )
};

export default MapSidebar;