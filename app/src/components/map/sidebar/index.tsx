import { useRouter } from "next/router";
import { useQuery } from "react-query";
import List from "src/components/list";
import { MapFilter } from "src/components/mapFilter";
import styles from "./sidebar.module.scss";
import { SidebarProps } from "src/components/component_interfaces";
import { IBayiPoint, ITownLine } from "src/types/map";
import { IBayi } from "@shared/interfaces";
import { IDistrictUser } from "@shared/interfaces";
import { useDistricts } from "src/fetchers/districts";
import { useContext, useEffect } from "react";
import { mapContext } from "src/contexts/map.context";
import { Pagination } from "src/components/pagination";
import Accordion from "src/components/accordion";

const MapSidebar = ({ bayilerData }: SidebarProps<IBayi[], IDistrictUser[]>) => {
    const { usePagination } = useContext(mapContext);

    const {data : paginator} = usePagination();

    return (
        <div className={styles.root}>
            <Accordion>
                <MapFilter />
            </Accordion>
            <div className={styles.heading}>
                <h2>{paginator?.totalItems} sonuç </h2>
            </div>
            <List _pathname="/map">
                <List.Body rows={bayilerData} />
            </List>
            <Pagination config={{_pathname : "/map"}}>
                <Pagination.First number={1} />
                <Pagination.Items totalItems={paginator?.totalItems} currentPage={paginator?.currentPage} pageSize={paginator?.pageSize}/>
                <Pagination.Last number={paginator?.totalPages} />
            </Pagination>
        </div>
    )
};

export default MapSidebar;