import MainLayout from "src/layouts/Main";
import Map from "src/components/map";
import { MapContextProvider } from "src/contexts/map.context";

const MapPage = () => {
  return (
    <MainLayout title="Map Page">
      <MapContextProvider>
        <Map />
      </MapContextProvider>
    </MainLayout>
  );
};

export default MapPage;
