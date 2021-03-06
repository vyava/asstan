import { useContext } from "react";
import { SelectBox } from "../selectbox";
import styles from "./map_filter.module.scss";
import { mapContext } from "src/contexts/map.context";

export const MapFilter = () => {

    let { setFilters, groupedDistricts, defaultOptions } = useContext(mapContext);

    return (
        <div className={styles.root}>
            <ul className={styles.filter_items}>
                <li>
                    <SelectBox options={groupedDistricts} defaultOptions={defaultOptions} onChange={setFilters} />
                </li>
            </ul>
        </div>
    )
};

