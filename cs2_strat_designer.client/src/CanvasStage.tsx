import React from 'react';
import { Stage, Layer, Image as KonvaImage, Circle, Line } from 'react-konva';
import type { CircleData, FlashData, SmokeData, LineData } from './hooks/ItemHandling';
import Konva from 'konva';

type CanvasStageProps = {
    width: number;
    height: number;
    image: HTMLImageElement | undefined;
    circles: CircleData[];
    setCircles: React.Dispatch<React.SetStateAction<CircleData[]>>;
    flashes: FlashData[];
    setFlashes: React.Dispatch<React.SetStateAction<FlashData[]>>;
    smokes: SmokeData[];
    setSmokes: React.Dispatch<React.SetStateAction<SmokeData[]>>;
    lines: LineData[];
    setLines: React.Dispatch<React.SetStateAction<LineData[]>>;
    tool: 'brush' | 'eraser';
    isDrawing: React.MutableRefObject<boolean>;
    selectedItem: { type: 'circle' | 'flash' | 'smoke'; id: number } | null;
    setSelectedItem: React.Dispatch<React.SetStateAction<{ type: 'circle' | 'flash' | 'smoke'; id: number } | null>>;
    flashIcon: HTMLImageElement | undefined;
    smokeIcon: HTMLImageElement | undefined;
    brushToggle: boolean;
    setBrushToggle: React.Dispatch<React.SetStateAction<boolean>>;
    selectedMap: string;
    steamId: string | null;
    eraseToggle: boolean;
    setEraseToggle: React.Dispatch<React.SetStateAction<boolean>>;
    setTool: React.Dispatch<React.SetStateAction<'brush' | 'eraser'>>;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
};

export const CanvasStage: React.FC<CanvasStageProps> = ({
    width,
    height,
    image,
    circles,
    setCircles,
    flashes,
    setFlashes,
    smokes,
    setSmokes,
    lines,
    setLines,
    tool,
    isDrawing,
    selectedItem,
    setSelectedItem,
    flashIcon,
    smokeIcon,
    brushToggle,
    setBrushToggle,
    selectedMap,
    steamId,
    eraseToggle,
    setEraseToggle,
    setTool,
    stageRef,
}) => {

    const handleWheel = (e: any) => {
        if (!(selectedMap === 'Blank' || !steamId)){
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
    };

    const handleBrushToggle = () => {
        setBrushToggle(prev => !prev);
    };

    const handleEraseToggle = () => {
        setEraseToggle(prev => {
            const newValue = !prev;
            setTool(newValue ? 'eraser' : 'brush');
            return newValue;
        });
    };

    const handleMouseDown = (e: any) => {
        if (brushToggle === true || tool === 'eraser') {
            isDrawing.current = true;
            const pos = e.target.getStage().getPointerPosition();
            setLines([...lines, { tool, points: [pos.x, pos.y] }]);
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
            const point = stage.getPointerPosition();
            let lastLine = lines[lines.length - 1];
            lastLine.points = lastLine.points.concat([point.x, point.y]);
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

    return (
        <>
            <button onClick={handleBrushToggle} disabled={selectedMap === 'Blank' || !steamId }>
                {brushToggle ? 'Disable Brush' : 'Enable Brush'}
            </button>
            <button onClick={handleEraseToggle} disabled={selectedMap === 'Blank' || !steamId}>
                {eraseToggle ? 'Disable Eraser' : 'Enable Eraser'}
            </button>
            <button disabled={selectedMap === 'Blank' || !steamId} onClick={() => {
                if (lines.length === 0) {
                    alert('Nothing to clear!');
                    return;
                }
                setLines([]);
            }}>
                Clear Scribbles
            </button>
            <button onClick={handleResetZoom} disabled={selectedMap === 'Blank' || !steamId}>
                Reset Zoom
            </button>
            <Stage
                width={width}
                height={height}
                ref={stageRef}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}>
                <Layer>
                    {image && <KonvaImage image={image} width={width} height={height} />}
                </Layer>
                <Layer>
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={line.tool === 'eraser' ? 'white' : 'red'}
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
                    {circles.map((circle, i) => (
                        <Circle
                            key={circle.id}
                            x={circle.x}
                            y={circle.y}
                            radius={10}
                            fill={circle.team === 'CT' ? '#5C94C1' : '#DEBC3F'}
                            onClick={() => setSelectedItem({ type: 'circle', id: circle.id })}
                            shadowColor={selectedItem?.type === 'circle' && selectedItem?.id === circle.id ? '#FF5D5F' : undefined}
                            shadowBlur={selectedItem?.type === 'circle' && selectedItem?.id === circle.id ? 15 : 0}
                            draggable
                            onDragEnd={(e) => {
                                const newCircles = [...circles];
                                newCircles[i] = { ...circle, x: e.target.x(), y: e.target.y() };
                                setCircles(newCircles);
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
                </Layer>
            </Stage>
        </>
    );
};
