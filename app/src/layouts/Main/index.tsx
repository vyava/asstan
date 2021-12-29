import style from "./main.layout.module.scss";
import Head from "next/head";
import { ReactNode } from "react";
import NavBar from "src/components/navbar";
import Header from "src/components/header";
import Breadcrumb from "src/components/breadcrumb";
import cls from "classnames";

export const MainLayout = ({
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

      <div className={style.left}>
        <NavBar />
      </div>
      <div className={style.right}>
        <Header></Header>
        <div className={style.content}>
          {/* <Breadcrumb /> */}
          {children}
        </div>
      </div>
    </section>
  );
};

export default MainLayout;
