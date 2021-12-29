import {createContext, useState} from "react";

const defaultHeadersState : string[] = [];
const defaultHasPagination = false;

export type ListContextType = {
    headers : string[];
    saveHeaders : (value : string[]) => void;

    hasPagination : boolean;
    setPagination : (value : boolean) => void;
}

const listContext = createContext({});

const ListContextProvider = ({children} : any) => {

    const [headers, setHeaders] = useState<string[]>(defaultHeadersState)
    const [hasPagination, setHasPagination] = useState(defaultHasPagination)

    const saveHeaders = (values : string[]) => {
        setHeaders(values)
    };

    const setPagination = (value : boolean) => {
        setHasPagination(value)
    }

    return (
        <listContext.Provider value={{headers, saveHeaders, hasPagination, setPagination}}>
            {children}
        </listContext.Provider>
    )
};

export { listContext, ListContextProvider };
