import { SelectBox } from "../selectbox";
import styles from "./map_filter.module.scss";

export const MapFilter = () => {

    return (
        <div className={styles.root}>
            <ul className={styles.filter_items}>
                <li className={styles.filter_item}>
                    <SelectBox />
                </li>
                <li className={styles.filter_item}>1</li>
                <li className={styles.filter_item}>1</li>
                <li className={styles.filter_item}>1</li>
            </ul>
        </div>
    )
};