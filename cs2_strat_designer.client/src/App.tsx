import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Stage, Layer, Image as KonvaImage, Circle } from 'react-konva';
import { useItemHandling } from './hooks/ItemHandling';
import { useMapSelection } from './hooks/MapSelection';
import { useSteamAuth } from './hooks/SteamAuth';
function HomePage() {

    const {
        circles, setCircles, flashes, setFlashes, smokes, setSmokes, selectedItem, setSelectedItem, flashIcon, smokeIcon, handleAddCircle, handleAddFlash, handleAddSmoke, handleClearCanvas,
    } = useItemHandling();

    const { selectedMap, image, handleMapChange } = useMapSelection();

    const { steamId, handleLogout } = useSteamAuth();

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
                <button className='teamBtn' disabled={selectedMap === 'Blank' || !steamId} onClick={() => handleAddCircle('CT')}>
                    Add CT
                </button>
                <button className='teamBtn' disabled={selectedMap === 'Blank' || !steamId} onClick={() => handleAddCircle('T')}>
                    Add T
                </button>
                <button className='util' disabled={selectedMap === 'Blank' || !steamId} onClick={() => handleAddFlash()}>
                    Add Flash
                </button>
                <button className='util' disabled={selectedMap === 'Blank' || !steamId} onClick={() => handleAddSmoke()}>
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
                <button className='clear' disabled={selectedMap === 'Blank' || !steamId} onClick={() => handleClearCanvas()}>
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
