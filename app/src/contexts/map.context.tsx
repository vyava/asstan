import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDistricts } from "src/fetchers/districts";
import { bayiFetcher } from "src/fetchers/bayiler";
import { useQuery, UseQueryResult } from "react-query";
import { IBayi } from "src/interfaces/bayi.interface";
import { AxiosError } from "axios";
import { PaginatorType } from "src/interfaces/pagination.interface";

const defaultIsStale = false;
// User Districts
const defaultDistricts = useDistricts();

export type MapContextType = {
    isStale : boolean;

    filters : FiltersType;
    groupedDistricts : any;
    defaultOptions? : any[];

    setIsStale : (value : boolean) => void;
    setFilters : (value : any[]) => void;

    useBayiler : () => UseQueryResult<IBayi[], AxiosError>;
    usePagination : () => UseQueryResult<PaginatorType>;
};

type FiltersType = {
    limit: number;
    page: number;
    cities: string[];
    towns: string[];
};

const mapContext = createContext({} as MapContextType);

const MapContextProvider = ({ children }: any) => {

    const setupDistricts = (districts) => {
        return districts?.reduce((result, current, i, array) => {
            result["cities"].push(current.city);
            result["towns"] = result["towns"].concat(current.districts.map(d => d.name));
            return result;
        }, { cities : [], towns : []});
    };

    const groupDistricts = (districts) => {
        return districts?.map((district, i) => ({
            id: i,
            label: district.city,
            value : district.city,
            options: district.districts.map((d, j) => ({
                city: district.city,
                label: d.name,
                value: d.code
            }))
        }));
    };
    
    const router = useRouter();
    const { page = "1", limit = 40 } : any = router.query;

    const groupedDistricts = groupDistricts(defaultDistricts);
    const defaultOptions = [].concat.apply([], groupedDistricts?.map(v => v.options));

    const [isStale, setIsStaleState] = useState(defaultIsStale);
    
    let {cities, towns } = setupDistricts(defaultDistricts) || {cities : [], towns : []};

    const [filters, setFiltersState] = useState({page, limit, cities, towns} as FiltersType);
    
    

    const setPagination = (pag) => {
        setPaginatorState(pag);
    }

    useEffect(() => {
        setFiltersState({...filters, page, limit});
        setIsStale(false);
    }, [page, limit]);

    const setFilters = (values : any[]) => {
        let {cities, towns } = values.reduce((result, value) => {
            result["cities"].add(value.city)
            result["towns"].add(value.label)
            return result;
        }, {cities : new Set(), towns : new Set()});

        setFiltersState({...filters, cities : Array.from(cities), towns : Array.from(towns)});
        setIsStale(false);
    };

    const setIsStale = (value : boolean) => {
        setIsStaleState(value);
    };

    const useBayiler = () : UseQueryResult<IBayi[], AxiosError> => {

        return useQuery(["bayiler", filters], bayiFetcher, {
            initialData: null,
            refetchOnWindowFocus: false,
            select: res => {
                setPagination(res.paginator);
                return res?.data
            },
            enabled : !isStale,
            onSuccess : (values) => {
                setIsStale(true);
            },

        });
    };

    // Pagination
    const [paginator, setPaginatorState] = useState(null as PaginatorType);

    const getPagination = () => {
        return paginator;
    }

    const usePagination = () => {
        return useQuery(["pagination"], getPagination, {
            enabled : !!isStale
        });
    }

    return (
        <mapContext.Provider value={{ isStale, setIsStale, filters, setFilters, defaultOptions, groupedDistricts, useBayiler, usePagination }}>
            {children}
        </mapContext.Provider>
    )
}

export { mapContext, MapContextProvider };
