import List from "src/components/list";
import { MapFilter } from "src/components/mapFilter";
import styles from "./sidebar.module.scss";
import { useContext } from "react";
import { mapContext } from "src/contexts/map.context";
import { layoutContext } from "src/contexts/layout.context";
import { Pagination } from "src/components/pagination";
import Accordion from "src/components/accordion";
import cls from "classnames";

const MapSidebar = () => {
    const { usePagination, useBayiler } = useContext(mapContext);
    const { isMapLarge } = useContext(layoutContext);

    const { isFetching: isFetchingBayiler, isError: isErrorBayiler, data: fetchedBayiler } = useBayiler();

    const {data : paginator} = usePagination();

    return (
        <div className={cls({[styles.root] : true, [styles.small] : isMapLarge})}>
            <Accordion>
                <MapFilter />
            </Accordion>
            <div className={styles.heading}>
                <h2>{paginator?.totalItems} sonuç </h2>
            </div>
            <List _pathname="/map">
                <List.Body rows={fetchedBayiler} />
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