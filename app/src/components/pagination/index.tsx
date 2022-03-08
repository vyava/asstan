import styles from "./pagination.module.scss";
import cls from "classnames";
import Icon from "src/utils/icon";
import CustomLink from "src/components/Link";
import { PaginationContextProvider, paginationContext } from "./context";
import React, { useContext } from "react";
import { PaginatorType } from "src/interfaces/pagination.interface";

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
};

function getPager(totalItems, currentPage, pageSize) {
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 10
    pageSize = pageSize || 10;

    // calculate total pages
    var totalPages = Math.ceil(totalItems / pageSize);

    var startPage, endPage;
    if (totalPages <= 10) {
        // less than 10 total pages so show all
        startPage = 1;
        endPage = totalPages;
    } else {
        // more than 10 total pages so calculate start and end pages
        if (currentPage <= 6) {
            startPage = 1;
            endPage = 10;
        } else if (currentPage + 4 >= totalPages) {
            startPage = totalPages - 9;
            endPage = totalPages;
        } else {
            startPage = currentPage - 5;
            endPage = currentPage + 4;
        }
    }

    // calculate start and end item indexes
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
    };
}

const Items = ({totalItems, currentPage, pageSize} : Partial<PaginatorType>) => {
    let { pathname } = useContext(paginationContext);
    let { pages, ...rest } = getPager(totalItems, currentPage, pageSize);
    return (
        <>
            {
                pages.map((page, i) => {
                    return (
                        <CustomLink key={i} to={
                            {
                                pathname: pathname,
                                query: { page : page }
                            }
                        }> {page} </CustomLink>
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