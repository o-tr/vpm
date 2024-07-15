import { useEffect, useState } from "react";
import { Manifest } from "../types/manifest";

export const useManifests = () => {
    const [manifests, setManifests] = useState<Manifest>();
    
    useEffect(() => {
        void (async()=>{
            const response = await fetch('/vpm.json');
            const data = await response.json();
            setManifests(data);
        })();
    }, []);
    
    return manifests;
}