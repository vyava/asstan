import { useState } from "react";
import Link from "next/link";
import cls from "classnames";
import styles from "./dropdown.module.scss";
import { logoutFetcher } from "src/fetchers/auth";

import Icon from "src/utils/icon";
import router from "next/router";

const Dropdown = () => {
    let [isOpen, setOpen] = useState(false);
    let logout = async () => {
        await logoutFetcher();
        localStorage.removeItem("user");
        router.push('/');
    }

    return (
        <div className={styles.root}>
            <a className={styles.user_pic} onClick={() => setOpen(!isOpen)} >
                <button className={styles.profile_button}>
                    <img className={styles.profile_image} src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80" alt="Your avatar" />
                </button>
                <Icon name="arrow-down" size="lg" width="5" />
            </a>
            {isOpen && <button onClick={() => setOpen(!isOpen)} tabIndex={-1} className={styles.overlay}></button>}
            {
                isOpen && <div className={styles.menu}>
                    <span className={styles.user_name}>{"KULLANICI ADI" || "Kullanıcı"}</span>
                    <Link href="/account">
                        <a className={cls(styles.menu_item)}>Hesap Ayarları</a>
                    </Link>
                    {/* <a href="#" className={cls(styles.menu_item)}>Support</a> */}
                    <a href="#" className={cls(styles.menu_item)} onClick={() => logout()}>Çıkış</a>
                </div>
            }
        </div>
    )
};

export default Dropdown;