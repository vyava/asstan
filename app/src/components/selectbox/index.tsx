import { useState } from "react";
import styles from "./select_box.module.scss";
import cls from "classnames";
import { SelectBoxProps } from "src/components/component_interfaces";

export const SelectBox = ({ isActive = false }: SelectBoxProps) => {
    
    const [isShown, setIsShown] = useState<boolean>(false);

    return (
        <div className={styles.root}>
            <button className={styles.button} type="button" onClick={() => setIsShown(!isShown)}>
                Şehir
            </button>

            <div className={cls(styles.hidden_box, !!isShown ? '' : 'hidden')}>
                {/* <div className="py-3 px-4 text-gray-900 dark:text-white">
                    <span className="block text-sm">Bonnie Green</span>
                    <span className="block text-sm font-medium truncat">name@flowbite.com</span>
                </div> */}
                <ul className={styles.list}>
                    <li>
                        <a href="#" className={styles.list_item}>İstanbul</a>
                    </li>
                </ul>
                {/* <div className="py-1">
                    <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                </div> */}
            </div>
        </div>
    )
};