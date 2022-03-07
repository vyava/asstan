import styles from "./pagination.module.scss";
import cls from "classnames";
import Icon from "src/utils/icon";
import CustomLink from "src/components/Link";
import { PaginationContextProvider, paginationContext } from "./context";
import React, { useContext, useEffect } from "react";

interface PaginationProps {
    config : {
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
    count : number;
    lmt : number;
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

const Items = ({count, lmt} : ItemsProps) => {
    let { counter, setCounter, limit, setLimit, pathname } = useContext(paginationContext);

    useEffect(() => {
        setCounter(count);
        setLimit(lmt)
    }, [])

    let pages = [];
    if(counter <= Math.ceil(limit)/2){
        pages = Array(limit).fill(0).map((_, i) => 1+i);
    }else{
        pages = Array(limit).fill(0).map((_, i) => Math.ceil(counter/2)+1+i);
    }

    return (
        <>
            {
                pages.map((item, i) => {
                    return (
                        <CustomLink key={i} to={
                            {
                                pathname: pathname,
                                query: {
                                    page: item
                                }
                            }
                        }> {item} </CustomLink>
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

Pagination.First = ({ number }: ItemProps) => {
    let { pathname } = useContext(paginationContext);

    return (
        <Item number={number} pathname={pathname} classname="back">
            <Icon name="long-arrow-alt-left" />
        </Item>
    );
};

Pagination.Prev = ({ number }: ItemProps) => {
    let { pathname } = useContext(paginationContext);
    return (
        <Item number={number} pathname={pathname} classname="back">
            <Icon name="long-arrow-alt-left" />
        </Item>
    );
};

Pagination.Item = Item;
Pagination.Items = Items;

Pagination.Last = ({ number, pathname }: ItemProps) => {
    return (
        <Item number={number} pathname={pathname} classname="forward">
            <Icon name="long-arrow-alt-right" />
        </Item>
    );
};

Pagination.Next = ({ number, pathname }: ItemProps) => {
    return (
        <Item number={number} pathname={pathname} classname="forward">
            <Icon name="long-arrow-alt-right" />
        </Item>
    );
};