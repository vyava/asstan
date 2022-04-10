import headerStyle from "./Header.module.scss";
import Dropdown from "src/components/dropdown_menu";
import Icon from "src/utils/icon";

const Header = () => {
  return (
    <header className={headerStyle.root}>
      <div className={headerStyle.search}>
        <span className={headerStyle.search_icon}>
          <Icon theme="light" name="search" className="icon" />
        </span>
        <input placeholder="Ruhsat No | Vergi Numarası" />
      </div>
      <Dropdown />
    </header>
  );
};

export default Header;
