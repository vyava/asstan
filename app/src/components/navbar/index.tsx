import Link from "next/link";
import Icon from "src/utils/icon";
import style from "./navbar.module.scss";

const Navbar = () => {
  return (
    <div className={style.root}>
      <Link href="/" passHref>
        <a className={`${style.link} ${style.link_home}`}>
          <span>Anasayfa</span>
          <Icon name="home" />
        </a>
      </Link>
      <Link href="/bayiler" passHref>
      <a className={style.link}>
          <span>Bayiler</span>
          <Icon name="bars" />
        </a>
      </Link>
      <Link href="/map" passHref>
      <a className={style.link}>
          <span>Harita</span>
          <Icon name="map" />
        </a>
      </Link>
      <Link href="/account" passHref>
      <a className={style.link}>
          <span>Ayarlar</span>
          <Icon name="cog" />
        </a>
      </Link>
    </div>
  );
};

export default Navbar;
