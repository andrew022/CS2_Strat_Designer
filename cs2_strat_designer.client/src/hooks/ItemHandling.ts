import { useState } from 'react';
import useImage from 'use-image';

export type Team = 'CT' | 'T';

export type CircleData = {
    id: number;
    x: number;
    y: number;
    team: Team;
};

export type FlashData = {
    id: number;
    x: number;
    y: number;
};

export type SmokeData = {
    id: number;
    x: number;
    y: number;
};

export function useItemHandling() {
    const [selectedItem, setSelectedItem] = useState<{ type: 'circle' | 'flash' | 'smoke'; id: number } | null>(null);
    const [flashes, setFlashes] = useState<FlashData[]>([]);
    const [smokes, setSmokes] = useState<SmokeData[]>([]);
    const [circles, setCircles] = useState<CircleData[]>([]);
    const [flashIcon] = useImage('/flash-effect.png');
    const [smokeIcon] = useImage('/smoke-effect.png');

    const handleAddCircle = (team: Team) => {
        const teamCount = circles.filter(c => c.team === team).length
        if (teamCount >= 5) {
            alert(`${team} already has 5!`);
            return;
        }
        const newCircle: CircleData = {
            id: Date.now(),
            x: 400,
            y: 400,
            team,
        };
        setCircles([...circles, newCircle]);
    };

    const handleAddFlash = () => {
        const newFlash: FlashData = {
            id: Date.now(),
            x: 400,
            y: 400,
        };
        setFlashes([...flashes, newFlash]);
    };

    const handleAddSmoke = () => {
        const newSmoke: SmokeData = {
            id: Date.now(),
            x: 400,
            y: 400,
        };
        setSmokes([...smokes, newSmoke]);
    };

    const handleClearCanvas = () => {
        const teamCount = circles.filter(c => c.team === c.team).length
        if (teamCount === 0 && flashes.length === 0 && smokes.length === 0) {
            alert("Canvas is already clear!");
            return;
        }
        setCircles([]);
        setFlashes([]);
        setSmokes([]);
    }; 

    return {
        selectedItem,
        setSelectedItem,
        circles,
        setCircles,
        flashes,
        setFlashes,
        smokes,
        setSmokes,
        handleAddCircle,
        handleAddFlash,
        handleAddSmoke,
        flashIcon,
        smokeIcon,
        handleClearCanvas,
    };
}