import style from "./login.layout.module.scss";
import Head from "next/head";
import { ReactNode } from "react";
import cls from "classnames";

export const LoginLayout = ({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) => {
    return (
        <section className={cls(style.root)}>
            <Head>
                <title>{title}</title>
            </Head>
            {children}
        </section>
    );
};

export default LoginLayout;
