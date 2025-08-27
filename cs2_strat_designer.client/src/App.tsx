import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useItemHandling } from './hooks/ItemHandling';
import { useMapSelection } from './hooks/MapSelection';
import { useSteamAuth } from './hooks/SteamAuth';
import { CanvasStage } from './CanvasStage';
function HomePage() {

    const {
        circles,
        setCircles,
        flashes,
        setFlashes,
        smokes,
        setSmokes,
        selectedItem,
        setSelectedItem,
        flashIcon,
        smokeIcon,
        handleAddCircle,
        handleAddFlash,
        handleAddSmoke,
        handleClearCanvas,
        lines,
        isDrawing,
        setLines,
        brushToggle,
        setBrushToggle,
        eraseToggle,
        setEraseToggle,
        setTool,
        stageRef,
        tool, } = useItemHandling();

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
                    <option value="Anubis">Anubis</option>
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
                    <CanvasStage
                        width={800}
                        height={600}
                        image={image}
                        circles={circles}
                        setCircles={setCircles}
                        flashes={flashes}
                        setFlashes={setFlashes}
                        smokes={smokes}
                        setSmokes={setSmokes}
                        lines={lines}
                        setLines={setLines}
                        tool={tool}
                        isDrawing={isDrawing}
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        flashIcon={flashIcon}
                        smokeIcon={smokeIcon}
                        setBrushToggle={setBrushToggle}
                        brushToggle={brushToggle}
                        selectedMap={selectedMap}
                        steamId={steamId}
                        eraseToggle={eraseToggle}
                        setEraseToggle={setEraseToggle}
                        setTool={setTool}
                        stageRef={stageRef}
                    />
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
