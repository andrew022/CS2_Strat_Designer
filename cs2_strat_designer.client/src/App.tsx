import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Stage, Layer, Image as KonvaImage, Circle } from 'react-konva';
import useImage from 'use-image';

function HomePage() {
    const [steamId, setSteamId] = useState<string | null>(null);
    const [selectedMap, setSelectedMap] = useState<string>('Blank');

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
    }
    const [flashes, setFlashes] = useState<FlashData[]>([]);
    const [circles, setCircles] = useState<CircleData[]>([]);

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
    };

    const handleMapChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedMap(event.target.value);
        setCircles([]);
    };
    const handleAddCircle = (team: Team) => {
        const newCircle: CircleData = {
            id: Date.now(),
            x: 300,
            y: 200,
            team,
        };
        setCircles([...circles, newCircle]);
    };

    const handleAddFlash = () => {
        const newFlash: FlashData = {
            id: Date.now(),
            x: 300,
            y: 200,
        };
        setFlashes([...flashes, newFlash]);
    };

    return (
        <div className="parent">
            <div className="div1">
                <h1>CS2 Strategy Designer</h1>
            </div>
            <div className="div2">
                {steamId ? (
                    <>
                        <p>Logged in as: {steamId}</p>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <a href="https://localhost:7011/auth/login">
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
                <button disabled={selectedMap === 'Blank'} onClick={() => handleAddCircle('CT')} style={{ marginLeft: '10px' }}>
                    Add CT
                </button>
                <button disabled={selectedMap === 'Blank'} onClick={() => handleAddCircle('T')} style={{ marginLeft: '10px' }}>
                    Add T
                </button>
                <button disabled={selectedMap === 'Blank'} onClick={() => handleAddFlash()} style={{ marginLeft: '10px' }}>
                    Add Flash
                </button>
            </div>
            <div className="div5">
                <div className="stage-wrapper">
                    <Stage width={600} height={400}>
                        <Layer>
                            <KonvaImage image={image} width={600} height={400} />

                            {circles.map((circle, index) => (
                                <Circle
                                    key={circle.id}
                                    x={circle.x}
                                    y={circle.y}
                                    radius={10}
                                    fill={circle.team === 'CT' ? '#5C94C1' : '#DEBC3F'}
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
                                    radius={10}
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
                        </Layer>
                    </Stage>
                </div>
            </div>
            <div className="div6"></div>
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
