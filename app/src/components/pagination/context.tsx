import {createContext, useState} from "react";

const defaultLimit = 10;
const defaultItemPerPage = 10;
const defaultCounter = 1;

export type PaginationContextType = {
    limit : number;
    counter : number;
    itemPerPage: number;
    pathname : string;

    setLimit : (value : number) => void;
    setCounter : (counter : number) => void;
    setItemPerPage : (value : number) => void;
    setPathname : (value : string) => void
}

const paginationContext = createContext({} as PaginationContextType);

const PaginationContextProvider = ({children, config} : any) => {
    let { _pathname } = config;
    const [itemPerPage, setItemPerPageState] = useState(defaultItemPerPage);
    const [limit, setLimitState] = useState(defaultLimit);
    const [counter, setCounterState] = useState(defaultCounter);
    const [pathname, setPathNameState] = useState(_pathname);

    const setItemPerPage = (value : number) => {
        setItemPerPageState(value);
    };

    const setLimit = (value : number) => {
        setLimitState(value);
    };

    const setCounter = (counter : number) => {
        setCounterState(counter);
    };

    const setPathname = (value : string) => {
        setPathNameState(value);
    };

    return (
        <paginationContext.Provider value={{ itemPerPage, setItemPerPage, limit, setLimit, counter, setCounter, pathname, setPathname }}>
            {children}
        </paginationContext.Provider>
    )
};

export { paginationContext, PaginationContextProvider };
