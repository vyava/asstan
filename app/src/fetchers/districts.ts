import { IDistrictUser } from "src/interfaces/district.interface";

const ISSERVER = typeof window === "undefined";

/**
   *
   */
const useDistricts = () : IDistrictUser[] => {
    if(!ISSERVER) {
        let { districts } =  JSON.parse(localStorage.getItem("user"));
        return districts || [];
    }
};

export { useDistricts }