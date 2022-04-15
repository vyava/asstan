import dynamic from "next/dynamic";
import styles from "./map.module.scss";
import * as _ from "lodash";
import MapSidebar from "./sidebar";
import UtilityButtons from "./utility_buttons";
import {LayoutContextProvider} from "src/contexts/layout.context";

const MapField = dynamic(() => import("src/components/map/search/index"), { ssr: false })

const Map = () => {
    return (
        <div className={styles.root}>
            <LayoutContextProvider>
                <MapField />
                <MapSidebar />
                <UtilityButtons />
            </LayoutContextProvider>
        </div>
    );
};

export default Map;