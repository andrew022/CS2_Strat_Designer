import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Stage, Layer, Image as KonvaImage, Circle } from 'react-konva';
import useImage from 'use-image';

function HomePage() {

    {/* Steam Authentication */ }
    const [steamId, setSteamId] = useState<string | null>(null);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("steamid");
        if (id) {
            setSteamId(id);
            localStorage.setItem("steamid", id);
            window.history.replaceState({}, document.title, "/");
        } else {
            const saved = localStorage.getItem("steamid");
            if (saved) setSteamId(saved);
        }
    }, []);

    const handleLogout = (): void => {
        setSteamId(null);
        localStorage.removeItem("steamid");
        setCircles([]);
        setFlashes([]);
        setSmokes([]);
    };

    {/* Adding Circles, Flashes, and Smokes */ }
    const [selectedItem, setSelectedItem] = useState<{ type: 'circle' | 'flash' | 'smoke'; id: number } | null>(null);
    const [flashes, setFlashes] = useState<FlashData[]>([]);
    const [smokes, setSmokes] = useState<SmokeData[]>([]);
    const [circles, setCircles] = useState<CircleData[]>([]);

    type Team = 'CT' | 'T';

    type CircleData = {
        id: number;
        x: number;
        y: number;
        team: Team;
    };

    const [flashIcon] = useImage('/flash-effect.png'); 
    type FlashData = {
        id: number;
        x: number;
        y: number;
    };

    const [smokeIcon] = useImage('/smoke-effect.png');
    type SmokeData = {
        id: number;
        x: number;
        y: number;
    };

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

    {/* Map Selection */ }
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

    {/* Clear Canvas */}

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

    {/* Page Contents */ }
    return (
        <div className="parent">
            <div className="div1">
                <h1>CS2 Strategy Designer</h1>
            </div>
            <div className="div2">
                {steamId? (
                    <>
                        <p>Logged in as: {steamId}</p>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <a href="https://localhost:7038/auth/login">
                        <button>Login with Steam</button>
                    </a>
                )}
            </div>
            <div className="div3">
                <select
                    name="maps"
                    id="maps"
                    value={selectedMap}
                    onChange={handleMapChange}
                >
                    <option value="Blank" disabled>Select Map</option>
                    <option value="Dust2">Dust 2</option>
                    <option value="Mirage">Mirage</option>
                    <option value="Ancient">Ancient</option>
                    <option value="Overpass">Overpass</option>
                    <option value="Inferno">Inferno</option>
                    <option value="Nuke">Nuke</option>
                    <option value="Train">Train</option>
                    <option value="Vertigo">Vertigo</option>
                </select>
            </div>
            <div className="div4">
                {steamId ? (
                    <>
                        <p></p>
                    </>
                ) : (
                    <p><b>Login to use buttons!</b></p>
                )}
                <button className='teamBtn' disabled={selectedMap === 'Blank' || !steamId} onClick={() => handleAddCircle('CT')} style={{ marginLeft: '10px' }}>
                    Add CT
                </button>
                <button className='teamBtn' disabled={selectedMap === 'Blank' || !steamId} onClick={() => handleAddCircle('T')} style={{ marginLeft: '10px' }}>
                    Add T
                </button>
                <button className='util' disabled={selectedMap === 'Blank' || !steamId} onClick={() => handleAddFlash()} style={{ marginLeft: '10px' }}>
                    Add Flash
                </button>
                <button className='util' disabled={selectedMap === 'Blank' || !steamId} onClick={() => handleAddSmoke()} style={{ marginLeft: '10px' }}>
                    Add Smoke
                </button>
                <button className='delete'
                    disabled={!selectedItem}
                    onClick={() => {
                        if (!selectedItem) return;
                        if (selectedItem.type === 'circle') {
                            setCircles(circles.filter(c => c.id !== selectedItem.id));
                        } else if (selectedItem.type === 'flash') {
                            setFlashes(flashes.filter(f => f.id !== selectedItem.id));
                        } else if (selectedItem.type === 'smoke') {
                            setSmokes(smokes.filter(s => s.id !== selectedItem.id));
                        }
                        setSelectedItem(null);
                    }}>
                    Delete Selected
                </button>
                <button className='clear' disabled={selectedMap === 'Blank' || !steamId} onClick={() => handleClearCanvas()} style={{ marginLeft: '10px' }}>
                    Clear Canvas
                </button>
            </div>
            <div className="div5">
                <div className="stage-wrapper">
                    <Stage width={800} height={800}>
                        <Layer>
                            <KonvaImage image={image} width={800} height={800} />

                            {circles.map((circle, index) => (
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
                                        newCircles[index] = {
                                            ...circle,
                                            x: e.target.x(),
                                            y: e.target.y(),
                                        };
                                        setCircles(newCircles);
                                    }}
                                />
                            ))}
                            {flashes.map((flash, index) => (
                                <KonvaImage
                                    key={flash.id}
                                    image={flashIcon}
                                    x={flash.x}
                                    y={flash.y}
                                    width={40}
                                    height={40}
                                    radius={10}
                                    onClick={() => setSelectedItem({ type: 'flash', id: flash.id })}
                                    shadowColor={selectedItem?.type === 'flash' && selectedItem?.id === flash.id ? '#FF5D5F' : undefined}
                                    shadowBlur={selectedItem?.type === 'flash' && selectedItem?.id === flash.id ? 15 : 0}
                                    draggable
                                    onDragEnd={(e) => {
                                        const newFlash = [...flashes];
                                        newFlash[index] = {
                                            ...flash,
                                            x: e.target.x(),
                                            y: e.target.y(),
                                        };
                                        setFlashes(newFlash);;
                                    }}
                                />
                            ))}
                            {smokes.map((smoke, index) => (
                                <KonvaImage
                                    key={smoke.id}
                                    image={smokeIcon}
                                    x={smoke.x}
                                    y={smoke.y}
                                    width={60}
                                    height={60}
                                    radius={10}
                                    onClick={() => setSelectedItem({ type: 'smoke', id: smoke.id })}
                                    shadowColor={selectedItem?.type === 'smoke' && selectedItem?.id === smoke.id ? '#FF5D5F' : undefined}
                                    shadowBlur={selectedItem?.type === 'smoke' && selectedItem?.id === smoke.id ? 15 : 0}
                                    draggable
                                    onDragEnd={(e) => {
                                        const newSmoke = [...smokes];
                                        newSmoke[index] = {
                                            ...smoke,
                                            x: e.target.x(),
                                            y: e.target.y(),
                                        };
                                        setSmokes(newSmoke);;
                                    }}
                                />
                            ))}
                        </Layer>
                    </Stage>
                </div>
            </div>
            <div className="div6">
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default App;
