import { useRef, useState } from 'react';
import useImage from 'use-image';
import React from 'react';
import Konva from 'konva';

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

export type HeData = {
    id: number;
    x: number;
    y: number;
};

export type FireData = {
    id: number;
    x: number;
    y: number;
};

export type CTData = {
    id: number;
    x: number;
    y: number;
};

export type TData = {
    id: number;
    x: number;
    y: number;
};

export type LineData = {
    points: number[];
    tool: 'brush' | 'eraser';
    color: 'red' | 'green' | 'blue' | 'yellow';
};

export function useItemHandling() {
    const [selectedItem, setSelectedItem] = useState<{ type: | 'fire' | 'he' | 'T' | 'CT' | 'flash' | 'smoke'; id: number } | null>(null);
    const [flashes, setFlashes] = useState<FlashData[]>([]);
    const [smokes, setSmokes] = useState<SmokeData[]>([]);
    const [flashIcon] = useImage('/flash.png');
    const [smokeIcon] = useImage('/smoke.png');
    const [fireIcon] = useImage('/fire.png');
    const [heIcon] = useImage('/he.png');
    const [tIcon] = useImage('/t_icon.png');
    const [ctIcon] = useImage('/ct_icon.png');
    const [CT, setCT] = useState<CTData[]>([]);
    const [T, setT] = useState<TData[]>([]);
    const [tool, setTool] = React.useState<'brush' | 'eraser'>('brush');
    const [lines, setLines] = React.useState<LineData[]>([]);
    const isDrawing = React.useRef(false);
    const [brushToggle, setBrushToggle] = useState(false);
    const [eraseToggle, setEraseToggle] = useState(false);
    const stageRef = useRef<Konva.Stage>(null);
    const [scale, setScale] = useState(1);
    const [color, setColor] = useState<'red' | 'green' | 'blue' | 'yellow'>('red');
    const [fire, setFire] = useState<FireData[]>([]);
    const [he, setHe] = useState<HeData[]>([]);

    const handleAddT = () => {
        const newT: FlashData = {
            id: Date.now(),
            x: 400,
            y: 400,
        };
        setT([...T, newT]);
    };

    const handleAddCT = () => {
        const newCT: CTData = {
            id: Date.now(),
            x: 400,
            y: 400,
        };
        setCT([...CT, newCT]);
    };

    const handleAddFlash = () => {
        const newFlash: TData = {
            id: Date.now(),
            x: 400,
            y: 400,
        };
        setFlashes([...flashes, newFlash]);
    };

    const handleAddHe = () => {
        const newHe: HeData = {
            id: Date.now(),
            x: 400,
            y: 400,
        };
        setHe([...he, newHe]);
    };

    const handleAddFire = () => {
        const newFire: FireData = {
            id: Date.now(),
            x: 400,
            y: 400,
        };
        setFire([...fire, newFire]);
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
        if ( lines.length === 0 && CT.length === 0 && T.length === 0 && flashes.length === 0 && smokes.length === 0) {
            alert("Canvas is already clear!");
            return;
        }
        setT([]);
        setCT([]);
        setFlashes([]);
        setSmokes([]);
        setLines([]);
        setFire([]);
        setHe([]);
    }; 

    {/* Handling Free drawing */ }

    const getRelativePointerPosition = (stage: Konva.Stage) => {
        const pointer = stage.getPointerPosition();
        if (!pointer) return { x: 0, y: 0 };
        return {
            x: (pointer.x - stage.x()) / scale,
            y: (pointer.y - stage.y()) / scale
        };
    };

    const handleBrushToggle = () => {
        setBrushToggle(prev => {
            const newValue = !prev
            if (newValue) {
                stageRef.current!.container().style.cursor = "url('/OTROX.cur'), auto";
            } else {
                stageRef.current!.container().style.cursor = 'default';
                setColor('red');
            }
            return newValue;
        });
    };

    const handleEraseToggle = () => {
        setEraseToggle(prev => {
            const newValue = !prev;
            if (newValue) {
                setTool('eraser');
                stageRef.current!.container().style.cursor = "url('/eraser.cur'), auto";
            } else {
                setTool('brush');
                stageRef.current!.container().style.cursor = 'default';
            }
            return newValue;
        });
    };

    const handleMouseDown = (e: any) => {
        if (brushToggle === true || tool === 'eraser') {
            isDrawing.current = true;
            const stage = e.target.getStage();
            const pos = getRelativePointerPosition(stage);
            setLines([...lines, { tool, points: [pos.x, pos.y], color }]);
        } else {
            return;
        }
    };

    const handleMouseMove = (e: any) => {
        if (brushToggle === true || tool === 'eraser') {
            if (!isDrawing.current) {
                return;
            }
            const stage = e.target.getStage();
            const pos = getRelativePointerPosition(stage);
            let lastLine = lines[lines.length - 1];
            lastLine.points = lastLine.points.concat([pos.x, pos.y]);
            lines.splice(lines.length - 1, 1, lastLine);
            setLines(lines.concat());
        } else {
            return;
        }
    };

    const handleMouseUp = () => {
        if (brushToggle === true || tool === 'eraser') {
            isDrawing.current = false;
        } else {
            return;
        }
    };
    const handleMouseLeave = () => {
        if (brushToggle === true || tool === 'eraser') {
            isDrawing.current = false;
        } else {
            return;
        }
    }

    return {
        selectedItem,
        setSelectedItem,
        flashes,
        setFlashes,
        smokes,
        setSmokes,
        handleAddFlash,
        handleAddSmoke,
        flashIcon,
        smokeIcon,
        handleClearCanvas,
        tool,
        setTool,
        lines,
        setLines,
        isDrawing,
        brushToggle,
        setBrushToggle,
        eraseToggle,
        setEraseToggle,
        stageRef,
        scale,
        setScale,
        handleAddCT,
        handleAddT,
        ctIcon,
        tIcon,
        setCT,
        setT,
        T,
        CT,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave,
        handleBrushToggle,
        handleEraseToggle,
        color,
        setColor,
        setHe,
        setFire,
        handleAddFire,
        handleAddHe,
        fire,
        he,
        fireIcon,
        heIcon,
    };
}