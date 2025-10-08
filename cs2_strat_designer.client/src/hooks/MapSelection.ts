import { useState } from 'react';
import useImage from 'use-image';
import { useItemHandling } from './ItemHandling';
export function useMapSelection() {

    const { setLines, setCT, setT, setFlashes, setSmokes } = useItemHandling();

    const [selectedMap, setSelectedMap] = useState<string>('Blank');
    const mapImagePaths: { [key: string]: string } = {
        Dust2: '/dust2.webp',
        Mirage: '/mirage.webp',
        Ancient: '/ancient.webp',
        Overpass: '/overpass.webp',
        Inferno: '/inferno.webp',
        Nuke: '/nuke.webp',
        Train: '/train.webp',
        Vertigo: '/vertigo.webp',
        Anubis: 'anubis.webp',
    };
    const [image] = useImage(mapImagePaths[selectedMap]);
    const handleMapChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedMap(event.target.value);
        setLines([]);
        setT([]);
        setCT([]);
        setFlashes([]);
        setSmokes([]);
    };
    return { selectedMap, image, handleMapChange };
}