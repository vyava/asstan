import { useState } from "react";
import styles from "./select_box.module.scss";
import Select, { components, DropdownIndicatorProps } from 'react-select';
import cls from "classnames";
import { SelectBoxProps } from "src/components/component_interfaces";

export interface ColourOption {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
  }

export const colourOptions: readonly ColourOption[] = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
  ];

const DropdownIndicator = (
    props: DropdownIndicatorProps<ColourOption, true>
) => {
    return (
        <components.DropdownIndicator {...props}>
            {/* <EmojiIcon label="Emoji" primaryColor={colourOptions[2].color} /> */}
        </components.DropdownIndicator>
    );
};



export const SelectBox = ({ options = [] }: SelectBoxProps) => {

    const [isShown, setIsShown] = useState<boolean>(false);

    return (
        <div className={styles.root}>
            <Select
                closeMenuOnSelect={false}
                components={{ DropdownIndicator }}
                // defaultValue={}
                isMulti
                options={colourOptions}
            />

            {/* <button className={styles.button} type="button" onClick={() => setIsShown(!isShown)}>
                Şehir
            </button>

            <div className={cls(styles.hidden_box, !!isShown ? '' : 'hidden')}>
                <div className="py-3 px-4 text-gray-900 dark:text-white">
                    <span className="block text-sm">Bonnie Green</span>
                    <span className="block text-sm font-medium truncat">name@flowbite.com</span>
                </div>
                <ul className={styles.list}>
                    <li>
                        <a href="#" className={styles.list_item}>İstanbul</a>
                    </li>
                </ul>
                <div className="py-1">
                    <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                </div>
            </div> */}
        </div>
    )
};