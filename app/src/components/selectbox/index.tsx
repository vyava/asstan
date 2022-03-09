import { useState } from "react";
import styles from "./select_box.module.scss";
import Select, { components, GroupHeadingProps, GroupProps } from 'react-select';
import cls from "classnames";
import { SelectBoxProps } from "src/components/component_interfaces";
import { uniqueArray } from "src/utils/common";

export const SelectBox = ({ options = [], defaultOptions, onChange }: SelectBoxProps) => {

    const [selectedOption, setSelectedOption] = useState(defaultOptions); //add initial state

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            //   color: state.isSelected ? 'red' : 'blue',
            //   padding: 20,
        }),
        control: (provided) => ({
            ...provided,
            // none of react-select's styles are passed to <Control />
            fontSize: '13px',
            minWidth: "100%",
            height: 'auto',
            border: '2px solid #040849',
            alignItems: 'flex-start',
            padding : '3px'
        })
    };

    const formatGroupLabel = data => (
        <div>
            <span>{data.label}</span>
        </div>
    );

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        onChange(selectedOption);
    };
    
    const GroupHeading = (props: GroupHeadingProps<any | any>) => {
        // console.log(props)

        const groupClicked = (props) => {
            let { options } = props.data;
            if(options){
                let uniqueOptions = uniqueArray([...selectedOption, ...options]);
                setSelectedOption(uniqueOptions);
                onChange(uniqueOptions);
            }
        }
        
        return (
            <div onClick={() => groupClicked(props)}>
                <components.GroupHeading {...props} />
            </div>
        )
    }

    return (
        <div className={styles.root}>
            <Select
                value={selectedOption}
                closeMenuOnSelect={false}
                options={options}
                components={{GroupHeading}}
                onChange={(values) => handleChange(values)}
                noOptionsMessage={() => <div>Bulunamadı</div>}
                isMulti
                styles={customStyles}
                isSearchable
                classNamePrefix="cs-"
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: '#040849'
                    }
                })}
                formatGroupLabel={formatGroupLabel}
            />
        </div>
    )
};