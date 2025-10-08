import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useItemHandling } from './hooks/ItemHandling';
import { useMapSelection } from './hooks/MapSelection';
import { CanvasStage } from './CanvasStage';

function HomePage() {

    const {
        flashes,
        setFlashes,
        smokes,
        setSmokes,
        selectedItem,
        setSelectedItem,
        flashIcon,
        smokeIcon,
        lines,
        isDrawing,
        setLines,
        brushToggle,
        setBrushToggle,
        eraseToggle,
        setEraseToggle,
        setTool,
        stageRef,
        setScale,
        scale,
        tIcon,
        ctIcon,
        setT,
        setCT,
        handleAddCT,
        handleAddT,
        handleAddFlash,
        handleAddSmoke,
        CT,
        T,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave,
        handleBrushToggle,
        handleEraseToggle,
        handleClearCanvas,
        setColor,
        color,
        setHe,
        setFire,
        handleAddFire,
        handleAddHe,
        fire,
        he,
        fireIcon,
        heIcon,
        tool, } = useItemHandling();

    const { selectedMap, image, handleMapChange } = useMapSelection();

    {/* Page Contents */ }
    return (
        <div className="parent">
            <div className="div1">
                <h1>CS2 Strategy Designer</h1>
                <div className="login">
                    <button>Login</button>
                </div>
            </div>
            <div className="div2">
                <div className="stage-wrapper">
                    <CanvasStage
                        width={800}
                        height={800}
                        image={image}
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
                        eraseToggle={eraseToggle}
                        setEraseToggle={setEraseToggle}
                        setTool={setTool}
                        stageRef={stageRef}
                        scale={scale}
                        setScale={setScale}
                        setCT={setCT}
                        setT={setT}
                        TIcon={tIcon}
                        CTIcon={ctIcon}
                        T={T}
                        CT={CT}
                        handleMouseDown={handleMouseDown}
                        handleMouseMove={handleMouseMove}
                        handleMouseUp={handleMouseUp}
                        handleMouseLeave={handleMouseLeave}
                        handleBrushToggle={handleBrushToggle}
                        handleEraseToggle={handleEraseToggle}
                        handleClearCanvas={handleClearCanvas}
                        setColor={setColor}
                        color={color}
                        setFire={setFire}
                        setHe={setHe}
                        he={he}
                        fire={fire}
                        fireIcon={fireIcon}
                        heIcon={heIcon}
                    />
                </div>
                <div className="items">
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
                    <hr style={{ width: "80%" }} />
                    <div>
                        <p style={{marginLeft:"5px"}}>Spawn Items</p>
                        <img width="17" style={{marginLeft:"5px", marginRight:"5px"}} src="/ct_icon.png" onClick={() => {
                            if (selectedMap === 'Blank') return;
                            if (CT.length >= 5) alert('Cannot have more than 5!');
                            handleAddCT();
                        }}></img>
                        <img width="17" src="/t_icon.png" onClick={() => {
                            if (selectedMap === 'Blank') return;
                            if (T.length >= 5) alert('Cannot have more than 5!');
                            handleAddT();
                        }}></img>
                        <img src="/he_grenade.png" onClick={() => {
                            if (selectedMap === 'Blank') return;
                            handleAddHe();
                        }}></img>
                        <img src="/molotov.png" onClick={() => {
                            if (selectedMap === 'Blank') return;
                            handleAddFire();
                        }}></img>
                        <img src="/smoke_grenade.png" onClick={() => {
                            if (selectedMap === 'Blank') return;
                            handleAddSmoke();
                        }}></img>
                        <img src="/flash_grenade.png" onClick={() => {
                            if (selectedMap === 'Blank') return;
                            handleAddFlash();
                        }}></img>
                    </div>
                    <hr style={{width:"80%" }} />
                    <div>
                        <p style={{marginLeft: "5px"}}>Tools</p>
                        <img width="17" style={{ marginLeft: "5px" }} src={brushToggle || eraseToggle ? "/pointer.png" : "/pointer-active.png"} onClick={() => {
                            if (selectedMap === 'Blank') return;
                            if (brushToggle) handleBrushToggle();
                            if (eraseToggle) handleEraseToggle();
                        }}></img>
                        <img style={{ marginLeft: "5px" }} src={!brushToggle ? "/brush.png" : "/brush-active.png"} onClick={() => {
                            if (selectedMap === 'Blank') return;
                            if (eraseToggle) {
                                alert('Disable Eraser first!');
                                return;
                            }
                            handleBrushToggle();
                        }}></img>
                        <img style={{ marginLeft: "5px" }} src={!eraseToggle ? "/eraser.png" : "/eraser-active.png"} onClick={() => {
                            if (selectedMap === 'Blank') return;
                            if (brushToggle) {
                                alert('Disable Brush first!');
                                return;
                            }
                            handleEraseToggle();
                        }}></img>
                        <img style={{ marginLeft: "5px" }} width="30" src="/delete.png" onClick={() => {
                            if (!selectedItem) return;
                            if (selectedItem.type === 'T') setT(T.filter((item) => item.id !== selectedItem.id));
                            if (selectedItem.type === 'CT') setCT(CT.filter((item) => item.id !== selectedItem.id));
                            if (selectedItem.type === 'flash') setFlashes(flashes.filter((item) => item.id !== selectedItem.id));
                            if (selectedItem.type === 'smoke') setSmokes(smokes.filter((item) => item.id !== selectedItem.id));
                            if (selectedItem.type === 'fire') setFire(fire.filter((item) => item.id !== selectedItem.id));
                            if (selectedItem.type === 'he') setHe(he.filter((item) => item.id !== selectedItem.id));
                            setSelectedItem(null);
                        }}></img>
                        <div>
                            <img onClick={() => {setColor('red')}} style={{ marginLeft: "5px" }} src="/colors/red.png"></img>
                            <img onClick={() => { setColor('blue') }} style={{ marginLeft: "5px" }} src="/colors/blue.png"></img>
                            <img onClick={() => { setColor('green') }} style={{ marginLeft: "5px" }} src="/colors/green.png"></img>
                            <img onClick={() => { setColor('yellow') }} style={{ marginLeft: "5px" }} src="/colors/yellow.png"></img>
                        </div>
                    </div>
                </div>
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
