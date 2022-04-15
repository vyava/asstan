import { createContext, useEffect, useState } from "react";

export type LayoutContextType = {
    isMapLarge : boolean;
    toggleIsMapLarge : () => void;
};

const layoutContext = createContext({} as LayoutContextType);

const LayoutContextProvider = ({ children }: any) => {
    const [isMapLarge, setIsMapLargeState] = useState(false);

    const toggleIsMapLarge = () => {
        setIsMapLargeState(!isMapLarge);
    };

    return (
        <layoutContext.Provider value={{ isMapLarge, toggleIsMapLarge }}>
            {children}
        </layoutContext.Provider>
    )
};

export { layoutContext, LayoutContextProvider }