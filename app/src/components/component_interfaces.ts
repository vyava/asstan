export interface SelectBoxProps {
    options : any[];
    defaultOptions : any[];
    onChange : (values : any) => any
};

export interface SidebarProps<P, T> {
    bayilerData : P;
};