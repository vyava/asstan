import { useState } from "react";
import cls from "classnames";
import styles from "./accordion.module.scss";

const Accordion = ({children}) => {

    const [visible, setVisibleState] = useState(false as boolean);

    const setVisible = () => {
        setVisibleState(true);
    };

    const setHidden = () => {
        setVisibleState(false);
    };

    return (
        <div className={styles.item} onClick={setVisible}>
            {/* <div className={styles.header}>Accordion Header</div> */}
            <div className={styles.content}>
                {children}
            </div>
            <div className={cls({[styles.overlay_active] : !visible})}></div>
        </div>
    )
};

export default Accordion;