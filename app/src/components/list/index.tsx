import styles from "./list.module.scss";
import { ReactNode, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { listContext, ListContextProvider, ListContextType } from "./context";
import Link from "next/link";
import { bayiFetcher } from "src/fetchers/bayiler";
import { IBayi } from "@shared/interfaces";
import Icon from "src/utils/icon";

import cls from "classnames";

export interface IHeaders {
  [key: string]: string;
}

interface IListHeadProps {
  headers: IHeaders
}

const Header = ({ headers }: IListHeadProps) => {
  const { saveHeaders } = useContext(listContext) as ListContextType;

  const router = useRouter();

  // @ts-ignore
  const page: number = parseInt(router.query.page) || 1;

  let headerNames = Object.keys(headers).map(key => headers[key]);

  const { refetch : downloadCurrentPage } = useQuery(["bayilerExcel", {page, limit:20, type: 'xls' }], bayiFetcher, {
    initialData: null,
    refetchOnWindowFocus: false,
    enabled: false, // turned off by default, manual refetch is needed,
  });

  const { refetch : downloadAllPage } = useQuery(["bayilerExcel", { type: 'xls' }], bayiFetcher, {
    initialData: null,
    refetchOnWindowFocus: false,
    enabled: false, // turned off by default, manual refetch is needed
  });

  useEffect(() => {
    saveHeaders(headerNames);
  }, [headers]);

  return (
    <div className={styles.head_container}>
      <div className={styles.file_buttons}>
        {/* <div className={styles.buttons_container} onClick={() => downloadBayiler()}> */}

        <div className={cls(styles.group, styles.dropdown)}>
          <button
            className="outline-none focus:outline-none border px-3 py-1 bg-white rounded-sm flex items-center min-w-32"
          >
            <span className={cls(styles.save_file, "pr-1 font-semibold flex-1")}>
              <Icon name="file-excel" />
              Kaydet
            </span>
          </button>
          <ul className={styles.group_hover_scale_100}>
            <li className="rounded-sm px-3 py-1 hover:bg-gray-100">
              <span onClick={() => downloadCurrentPage()}>Bu Sayfa</span>
            </li>
            <li className="rounded-sm px-3 py-1 hover:bg-gray-100">
              <span onClick={() => downloadAllPage()}>Tüm Sayfa</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.head}>
        {headers &&
          headerNames.map((header, i: number) => (
            <div key={i}>
              {header}
            </div>
          ))}
      </div>
    </div>
  );
};

const Body = ({ rows }: { rows: IBayi[] }) => {
  const { headers, setPagination } = useContext(listContext) as ListContextType;

  useEffect(() => {
    rows?.length > 10 ? setPagination(true) : setPagination(false);
  }, [rows]);

  return (
    <>
      <ul className={styles.body}>
        {rows &&
          rows.map((row, i: number) => (
            <li className={styles.body_row} key={i}>
              {headers &&
                <>
                  <div>{row.unvan}</div>
                  <div>{row.adiSoyadi}</div>
                  <div>{row.ruhsatNo}</div>
                  <div className={cls(styles.body_row_item_adres)}>
                    <span>{row.adres}</span>
                    <b>{`${row.il} - ${row.ilce}`}</b>
                  </div>
                  <div>{row.vergiNo}</div>
                </>
              }
            </li>
          ))}

          {rows?.length == 0 && <p>Bayi bulunamadı</p>}
      </ul>
    </>
  );
};

interface ListProps {
  children: ReactNode[] | ReactNode;
  _pathname : string;
}

const List = ({ children, _pathname }: ListProps) => {
  return (
    <ListContextProvider>
      <div className={styles.root}>
        <div className={cls(styles.container)}>
          <section className={styles.list}>{children}</section>
        </div>
      </div>
    </ListContextProvider>
  );
};

List.Header = Header;
List.Body = Body;

export default List;
