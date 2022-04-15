import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "src/styles/Icon.module.css";

const Icon = ({ name, ...rest }: any) => {
  return <FontAwesomeIcon className={`${style.as_icon} icon`} icon={name} {...rest}/>;
};

export default Icon;
