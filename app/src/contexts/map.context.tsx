import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDistricts } from "src/fetchers/districts";
import { bayiFetcher } from "src/fetchers/bayiler";
import { useQuery, UseQueryResult } from "react-query";
import { IBayi } from "@shared/interfaces";
import { AxiosError } from "axios";
import { PaginatorType } from "@shared/interfaces";
import { IBayiPoint } from "src/types/map";
import { getFeatures } from "src/components/map/map_helpers";

const defaultIsStale = false;
// User Districts
const defaultDistricts = useDistricts();

export type MapContextType = {
    groupedDistricts: any;
    defaultOptions?: any[];

    setIsStale: (value: boolean) => void;
    setFilters: (value: any[]) => void;

    useBayiler: () => UseQueryResult<IBayi[], AxiosError>;
    usePings: () => UseQueryResult<IBayiPoint[], AxiosError>;
    usePagination: () => UseQueryResult<PaginatorType>;
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
        }, { cities: [], towns: [] });
    };

    const groupDistricts = (districts) => {
        return districts?.map((district, i) => ({
            id: i,
            label: district.city,
            value: district.city,
            options: district.districts.map((d, j) => ({
                city: district.city,
                label: d.name,
                value: d.code
            }))
        }));
    };

    const router = useRouter();
    const { page = "1", limit = 40 }: any = router.query;

    const groupedDistricts = groupDistricts(defaultDistricts);
    let defaultOptions = [].concat.apply([], groupedDistricts?.map(v => v.options));
    let { cities : defaultCities, towns : defaultTowns } = setupDistricts(defaultDistricts) || { cities: [], towns: [] };
    
    // Set initial filters after route changed to prevent unreliable results
    useEffect(() => {
        router.events.on('beforeHistoryChange', (pathname: string) => {
            if (!pathname.includes("/map")) {
                setFiltersState({page : 1, limit : 40, cities : defaultCities, towns : defaultTowns});
                setIsStale(false);
            }
        })
    }, []);

    const [isStale, setIsStaleState] = useState(defaultIsStale);

    const [filters, setFiltersState] = useState({ page, limit, cities : defaultCities, towns : defaultTowns } as FiltersType);

    useEffect(() => {
        setFiltersState({ ...filters, page, limit });
        setIsStale(false);
    }, [page, limit]);

    const setFilters = (values: any[]) => {
        let { cities, towns } = values.reduce((result, value) => {
            result["cities"].add(value.city)
            result["towns"].add(value.label)
            return result;
        }, { cities: new Set(), towns: new Set() });

        setFiltersState({ ...filters, cities: Array.from(cities), towns: Array.from(towns) });
        setIsStale(false);
    };

    const setIsStale = (value: boolean) => {
        setIsStaleState(value);
    };

    // Initial Call
    useQuery(["bayiler_main", filters], bayiFetcher, {
        initialData: null,
        refetchOnWindowFocus: false,
        enabled: !isStale,
        notifyOnChangeProps: 'tracked',
        onSuccess: (result) => {
            setPagination(result?.paginator);
            setBayiler(result?.data);
            setPings(getFeatures(result?.data))
            setIsStale(true);
        },

    });

    // Bayiler
    const [bayiler, setBayilerState] = useState([] as IBayi[]);
    const setBayiler = (bayiler) => setBayilerState(bayiler)
    const getBayiler = () => bayiler;
    const useBayiler = (): UseQueryResult<IBayi[], AxiosError> => useQuery(["bayiler"], getBayiler, { enabled: !!isStale });

    // Pings
    const [pings, setPingsState] = useState([] as IBayiPoint[]);
    const setPings = (pings) => setPingsState(pings)
    const getPings = () => pings;
    const usePings = (): UseQueryResult<IBayiPoint[], AxiosError> => useQuery(["pings"], getPings, { enabled: !!isStale });

    // Pagination
    const [paginator, setPaginatorState] = useState(null as PaginatorType);
    const setPagination = (pag) => setPaginatorState(pag);
    const getPagination = () => paginator;
    const usePagination = () => useQuery(["pagination"], getPagination, { enabled: !!isStale });

    return (
        <mapContext.Provider value={{ setIsStale, defaultOptions, groupedDistricts, useBayiler, usePings, usePagination, setFilters }}>
            {children}
        </mapContext.Provider>
    )
}

export { mapContext, MapContextProvider };
