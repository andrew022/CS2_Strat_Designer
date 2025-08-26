import { useState } from 'react';
import useImage from 'use-image';
import { useItemHandling } from './ItemHandling';
export function useMapSelection() {

    const { setCircles, setFlashes, setSmokes } = useItemHandling();

    const [selectedMap, setSelectedMap] = useState<string>('Blank');
    const mapImagePaths: { [key: string]: string } = {
        Dust2: '/dust2.png',
        Mirage: '/mirage.png',
        Ancient: '/ancient.png',
        Overpass: '/overpass.png',
        Inferno: '/inferno.png',
        Nuke: '/nuke.png',
        Train: '/train.png',
        Vertigo: '/vertigo.png',
    };
    const [image] = useImage(mapImagePaths[selectedMap]);
    const handleMapChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedMap(event.target.value);
        setCircles([]);
        setFlashes([]);
        setSmokes([]);
    };
    return { selectedMap, image, handleMapChange };
}