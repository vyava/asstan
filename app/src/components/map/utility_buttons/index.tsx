import styles from "./utility_buttons.module.scss";
import Icon from "src/utils/icon";

const UtilityButtons = () => {
    return (
        <div className={styles.root}>
            <button className={styles.map_button}>
                <Icon theme="light" name="map" width="20" className={styles.map_icon}/>
            </button>
        </div>
    )
};

export default UtilityButtons;