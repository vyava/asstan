import { useState } from "react";
import styles from "./select_box.module.scss";
import Select, { components, GroupProps } from 'react-select';
import cls from "classnames";
import { SelectBoxProps } from "src/components/component_interfaces";

const groupStyles = {
    border: `1px dotted black`,
    borderRadius: '5px',
};

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
            fontSize: '14px',
            minWidth: "100%",
            height: '100px',
              border: '2px solid #040849',
            alignItems: 'flex-start'

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

    return (
        <div className={styles.root}>
            <Select
                value={selectedOption}
                closeMenuOnSelect={false}
                options={options}
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