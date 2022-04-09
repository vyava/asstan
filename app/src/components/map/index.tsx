import { useEffect, useState, useContext } from "react";
import dynamic from "next/dynamic";
import styles from "./map.module.scss";
import * as _ from "lodash";

import MapSidebar from "./sidebar";

const MapField = dynamic(() => import("src/components/map/search/index"), { ssr: false })

const Map = () => {
    return (
        <div className={styles.root}>
            <MapField />
            <MapSidebar />
        </div>
    );
};

export default Map;