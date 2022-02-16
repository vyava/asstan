export interface SelectBoxProps {
    options : any[];
};

export interface SideBarProps<P, T> {
    pingsData : P[];
    townsData : T[];
};

export interface MapFilterProps<T> extends SideBarProps<any, T> {};