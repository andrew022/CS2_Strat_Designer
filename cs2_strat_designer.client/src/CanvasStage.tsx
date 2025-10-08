import React from 'react';
import { Stage, Layer, Image as KonvaImage, Line } from 'react-konva';
import type { FlashData, SmokeData, LineData, CTData, TData, HeData, FireData } from './hooks/ItemHandling';
import Konva from 'konva';

type CanvasStageProps = {
    width: number;
    height: number;
    image: HTMLImageElement | undefined;
    flashes: FlashData[];
    setFlashes: React.Dispatch<React.SetStateAction<FlashData[]>>;
    smokes: SmokeData[];
    setSmokes: React.Dispatch<React.SetStateAction<SmokeData[]>>;
    lines: LineData[];
    setLines: React.Dispatch<React.SetStateAction<LineData[]>>;
    tool: 'brush' | 'eraser';
    isDrawing: React.MutableRefObject<boolean>;
    selectedItem: { type: 'fire' | 'he' | 'T' | 'CT' | 'flash' | 'smoke'; id: number } | null;
    setSelectedItem: React.Dispatch<React.SetStateAction<{ type: 'fire' | 'he' | 'T' | 'CT' | 'flash' | 'smoke'; id: number } | null>>;
    flashIcon: HTMLImageElement | undefined;
    smokeIcon: HTMLImageElement | undefined;
    brushToggle: boolean;
    setBrushToggle: React.Dispatch<React.SetStateAction<boolean>>;
    selectedMap: string;
    eraseToggle: boolean;
    setEraseToggle: React.Dispatch<React.SetStateAction<boolean>>;
    setTool: React.Dispatch<React.SetStateAction<'brush' | 'eraser'>>;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
    scale: number;
    setScale: React.Dispatch<React.SetStateAction<number>>;
    setCT: React.Dispatch<React.SetStateAction<CTData[]>>;
    CT: CTData[];
    setT: React.Dispatch<React.SetStateAction<TData[]>>;
    T: TData[];
    TIcon: HTMLImageElement | undefined;
    CTIcon: HTMLImageElement | undefined;
    fireIcon: HTMLImageElement | undefined;
    heIcon: HTMLImageElement | undefined;
    handleMouseDown: (e: any) => void;
    handleMouseMove: (e: any) => void;
    handleMouseUp: (e: any) => void;
    handleMouseLeave: (e: any) => void;
    handleBrushToggle: () => void;
    handleEraseToggle: () => void;
    handleClearCanvas: () => void;
    setColor: React.Dispatch<React.SetStateAction<'red' | 'green' | 'blue' | 'yellow'>>;
    color: 'red' | 'blue' | 'green' | 'yellow';
    setHe: React.Dispatch<React.SetStateAction<HeData[]>>;
    he: HeData[];
    setFire: React.Dispatch<React.SetStateAction<FireData[]>>;
    fire: FireData[];
};

export const CanvasStage: React.FC<CanvasStageProps> = ({
    width,
    height,
    image,
    flashes,
    setFlashes,
    smokes,
    setSmokes,
    lines,
    setLines,
    tool,
    selectedItem,
    setSelectedItem,
    flashIcon,
    smokeIcon,
    brushToggle,
    selectedMap,
    stageRef,
    scale,
    setScale,
    setCT,
    setT,
    T,
    CT,
    TIcon,
    CTIcon,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleClearCanvas,
    setFire,
    setHe,
    he,
    heIcon,
    fireIcon,
    fire,
}) => {

    {/* Handling zooming based on pointer position */ }

    const handleWheel = (e: any) => {
        if (!(selectedMap === 'Blank')) {
            e.evt.preventDefault();

            const stage = stageRef.current;
            if (!stage) return;
            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();
            if (!pointer) return;

            const mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };

            let direction = e.evt.deltaY > 0 ? -1 : 1;
            if (e.evt.ctrlKey) {
                direction = -direction;
            }

            const scaleBy = 1.05;
            const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

            setScale(newScale)

            stage.scale({ x: newScale, y: newScale });

            const newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            stage.position(newPos);
        }
        return;
    };

    const handleResetZoom = () => {
        const stage = stageRef.current;
        if (!stage) return;
        stage.scale({ x: 1, y: 1 });
        stage.position({ x: 0, y: 0 });
        setScale(1);
    };

    {/* Canvas contents */}

    return (
        <>
             <div>
                <button disabled={selectedMap === 'Blank'} onClick={() => {
                    if (lines.length === 0) {
                        alert('Nothing to clear!');
                        return;
                    }
                    setLines([]);
                }}>
                    Clear Scribbles
                </button>
                <button disabled={selectedMap === 'Blank' || brushToggle} onClick={handleClearCanvas}>
                    Clear Canvas
                </button>
                <button onClick={handleResetZoom} disabled={selectedMap === 'Blank'}>
                    Reset Zoom
                </button>
            </div>
            <Stage
                width={width}
                height={height}
                ref={stageRef}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                draggable={!brushToggle && tool !== 'eraser' && scale>1}>
                <Layer>
                    {image && <KonvaImage image={image} width={width} height={height} />}
                </Layer>
                <Layer>
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={line.tool === 'eraser' ? 'white' : line.color}
                            strokeWidth={line.tool === 'eraser' ? 20 : 5}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={
                                line.tool === 'eraser' ? 'destination-out' : 'source-over'
                            }
                        />
                    ))}
                </Layer>
                <Layer>
                    {CT.map((CTs, i) => (
                        <KonvaImage
                            key={CTs.id}
                            image={CTIcon}
                            x={CTs.x}
                            y={CTs.y}
                            width={20}
                            height={20}
                            onClick={() => setSelectedItem({ type: 'CT', id: CTs.id })}
                            shadowColor={selectedItem?.type === 'CT' && selectedItem?.id === CTs.id ? '#FF5D5F' : undefined}
                            shadowBlur={selectedItem?.type === 'CT' && selectedItem?.id === CTs.id ? 15 : 0}
                            draggable
                            onDragEnd={(e) => {
                                const newCT = [...CT];
                                newCT[i] = { ...CTs, x: e.target.x(), y: e.target.y() };
                                setCT(newCT);
                            }}
                        />
                    ))}
                    {T.map((Ts, i) => (
                        <KonvaImage
                            key={Ts.id}
                            image={TIcon}
                            x={Ts.x}
                            y={Ts.y}
                            width={20}
                            height={20}
                            onClick={() => setSelectedItem({ type: 'T', id: Ts.id })}
                            shadowColor={selectedItem?.type === 'T' && selectedItem?.id === Ts.id ? '#FF5D5F' : undefined}
                            shadowBlur={selectedItem?.type === 'T' && selectedItem?.id === Ts.id ? 15 : 0}
                            draggable
                            onDragEnd={(e) => {
                                const newT = [...T];
                                newT[i] = { ...Ts, x: e.target.x(), y: e.target.y() };
                                setT(newT);
                            }}
                        />
                    ))}
                    {flashes.map((flash, i) => (
                        <KonvaImage
                            key={flash.id}
                            image={flashIcon}
                            x={flash.x}
                            y={flash.y}
                            width={40}
                            height={40}
                            onClick={() => setSelectedItem({ type: 'flash', id: flash.id })}
                            shadowColor={selectedItem?.type === 'flash' && selectedItem?.id === flash.id ? '#FF5D5F' : undefined}
                            shadowBlur={selectedItem?.type === 'flash' && selectedItem?.id === flash.id ? 15 : 0}
                            draggable
                            onDragEnd={(e) => {
                                const newFlashes = [...flashes];
                                newFlashes[i] = { ...flash, x: e.target.x(), y: e.target.y() };
                                setFlashes(newFlashes);
                            }}
                        />
                    ))}
                    {smokes.map((smoke, i) => (
                        <KonvaImage
                            key={smoke.id}
                            image={smokeIcon}
                            x={smoke.x}
                            y={smoke.y}
                            width={60}
                            height={60}
                            onClick={() => setSelectedItem({ type: 'smoke', id: smoke.id })}
                            shadowColor={selectedItem?.type === 'smoke' && selectedItem?.id === smoke.id ? '#FF5D5F' : undefined}
                            shadowBlur={selectedItem?.type === 'smoke' && selectedItem?.id === smoke.id ? 15 : 0}
                            draggable
                            onDragEnd={(e) => {
                                const newSmokes = [...smokes];
                                newSmokes[i] = { ...smoke, x: e.target.x(), y: e.target.y() };
                                setSmokes(newSmokes);
                            }}
                        />
                    ))}
                    {he.map((hes, i) => (
                        <KonvaImage
                            key={hes.id}
                            image={heIcon}
                            x={hes.x}
                            y={hes.y}
                            width={60}
                            height={60}
                            onClick={() => setSelectedItem({ type: 'he', id: hes.id })}
                            shadowColor={selectedItem?.type === 'he' && selectedItem?.id === hes.id ? '#FF5D5F' : undefined}
                            shadowBlur={selectedItem?.type === 'he' && selectedItem?.id === hes.id ? 15 : 0}
                            draggable
                            onDragEnd={(e) => {
                                const newHe = [...he];
                                newHe[i] = { ...hes, x: e.target.x(), y: e.target.y() };
                                setHe(newHe);
                            }}
                        />
                    ))}
                    {fire.map((fires, i) => (
                        <KonvaImage
                            key={fires.id}
                            image={fireIcon}
                            x={fires.x}
                            y={fires.y}
                            width={60}
                            height={60}
                            onClick={() => setSelectedItem({ type: 'fire', id: fires.id })}
                            shadowColor={selectedItem?.type === 'fire' && selectedItem?.id === fires.id ? '#FF5D5F' : undefined}
                            shadowBlur={selectedItem?.type === 'fire' && selectedItem?.id === fires.id ? 15 : 0}
                            draggable
                            onDragEnd={(e) => {
                                const newFire = [...fire];
                                newFire[i] = { ...fires, x: e.target.x(), y: e.target.y() };
                                setFire(newFire);
                            }}
                        />
                    ))}
                </Layer>
            </Stage>
        </>
    );
};
