import { SelectBox } from "../selectbox";
import styles from "./map_filter.module.scss";
import { MapFilterProps } from "src/components/component_interfaces";
import { ITownLine } from "src/types/map";

export const MapFilter = ({townsData} : MapFilterProps<ITownLine[]>) => {

    return (
        <div className={styles.root}>
            <ul className={styles.filter_items}>
                <li className={styles.filter_item}>
                    {/* <SelectBox towndsData/> */}
                </li>
                {/* <li className={styles.filter_item}>1</li>
                <li className={styles.filter_item}>1</li>
                <li className={styles.filter_item}>1</li> */}
            </ul>
        </div>
    )
};