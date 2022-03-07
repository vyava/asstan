import styles from "./pagination.module.scss";
import cls from "classnames";
import Icon from "src/utils/icon";
import CustomLink from "src/components/Link";
import { PaginationContextProvider, paginationContext } from "./context";
import React, { useContext } from "react";

interface PaginationProps {
    config? : {
        _pathname : string;
    };
    children: React.ReactNode
};

interface ItemProps {
    number: number;
    pathname: string;
    classname?: string;
    children?: React.ReactNode
};

interface ItemsProps {
    totalPage : number;
};

const Item = ({ number, classname, children }: ItemProps) => {
    let { pathname } = useContext(paginationContext);
    return <CustomLink className={cls(classname)} to={
        {
            pathname: pathname,
            query: {
                page: number
            }
        }
    }> {children} </CustomLink>
}

const Items = ({totalPage} : ItemsProps) => {
    let { pathname } = useContext(paginationContext);

    return (
        <>
            {
                Array.from({length : totalPage}).map((page, i) => {
                    return (
                        <CustomLink key={i} to={
                            {
                                pathname: pathname,
                                query: { page : i+1 }
                            }
                        }> {i+1} </CustomLink>
                    )
                })
            }
        </>
    )
};

export const Pagination = ({ children, config }: PaginationProps) => {
    return (
        <PaginationContextProvider config={config}>
            <div className={cls(styles.pagination, "")}>
                {children}
            </div>
        </PaginationContextProvider>
    )
};

Pagination.First = ({ number }: Partial<ItemProps>) => {
    let { pathname } = useContext(paginationContext);

    return (
        <Item number={number} pathname={pathname} classname="back">
            <Icon name="long-arrow-alt-left" />
        </Item>
    );
};

Pagination.Prev = ({ number }: Partial<ItemProps>) => {
    let { pathname } = useContext(paginationContext);
    return (
        <Item number={number} pathname={pathname} classname="back">
            <Icon name="long-arrow-alt-left" />
        </Item>
    );
};

Pagination.Item = Item;
Pagination.Items = Items;

Pagination.Last = ({ number, pathname }: Partial<ItemProps>) => {
    return (
        <Item number={number} pathname={pathname} classname="forward">
            <Icon name="long-arrow-alt-right" />
        </Item>
    );
};

Pagination.Next = ({ number, pathname }: Partial<ItemProps>) => {
    return (
        <Item number={number} pathname={pathname} classname="forward">
            <Icon name="long-arrow-alt-right" />
        </Item>
    );
};