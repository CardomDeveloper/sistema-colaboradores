import { useContext } from "react";
import ColabContext from "../context/ColabProvider";

const useColab = () => {
    return useContext(ColabContext)
}

export default useColab
