import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Stars } from '@react-three/drei';
import { MechaModel } from './MechaModel';

const PLANETS = [
  {
    name: 'Earth',
    icon: '🌍',
    bg: '#060d1a',
    ambient: 0.4,
    keyLight: '#ffffff',
    keyIntensity: 2.5,
    fillLight: '#6688ff',
    fillIntensity: 0.8,
    rimLight: '#88ccff',
    rimIntensity: 1.0,
    env: 'sunset',
    starCount: 1500,
    desc: 'Temperate — Balanced White Sunlight',
  },
  {
    name: 'Sun',
    icon: '☀️',
    bg: '#1a0e02',
    ambient: 0.6,
    keyLight: '#ffffcc',
    keyIntensity: 5.0,
    fillLight: '#ffaa22',
    fillIntensity: 2.5,
    rimLight: '#ff6600',
    rimIntensity: 3.0,
    env: 'sunset',
    starCount: 200,
    desc: 'Solar Corona — Blinding White-Gold Radiation',
  },
  {
    name: 'Mars',
    icon: '🔴',
    bg: '#12060a',
    ambient: 0.3,
    keyLight: '#ff8855',
    keyIntensity: 3.0,
    fillLight: '#cc4422',
    fillIntensity: 1.2,
    rimLight: '#ff6633',
    rimIntensity: 0.8,
    env: 'dawn',
    starCount: 800,
    desc: 'Dusty — Warm Orange Sunlight',
  },
  {
    name: 'Jupiter',
    icon: '🟠',
    bg: '#0d0806',
    ambient: 0.2,
    keyLight: '#ffaa44',
    keyIntensity: 2.0,
    fillLight: '#dd8833',
    fillIntensity: 1.0,
    rimLight: '#ffcc66',
    rimIntensity: 1.5,
    env: 'sunset',
    starCount: 2000,
    desc: 'Gas Giant — Deep Amber Radiation',
  },
  {
    name: 'Neptune',
    icon: '🔵',
    bg: '#030810',
    ambient: 0.15,
    keyLight: '#4488ff',
    keyIntensity: 1.8,
    fillLight: '#2255cc',
    fillIntensity: 1.5,
    rimLight: '#66aaff',
    rimIntensity: 1.2,
    env: 'night',
    starCount: 3000,
    desc: 'Ice Giant — Cold Blue Reflected Light',
  },
  {
    name: 'Venus',
    icon: '🟡',
    bg: '#100d06',
    ambient: 0.5,
    keyLight: '#ffdd88',
    keyIntensity: 3.5,
    fillLight: '#ffbb44',
    fillIntensity: 1.0,
    rimLight: '#ffcc55',
    rimIntensity: 0.6,
    env: 'dawn',
    starCount: 500,
    desc: 'Scorched — Intense Yellow Haze',
  },
  {
    name: 'Moon',
    icon: '🌑',
    bg: '#08080a',
    ambient: 0.1,
    keyLight: '#eeeeff',
    keyIntensity: 3.0,
    fillLight: '#555566',
    fillIntensity: 0.3,
    rimLight: '#aaaacc',
    rimIntensity: 0.5,
    env: 'night',
    starCount: 4000,
    desc: 'Lunar — Harsh Unfiltered Sunlight',
  },
  {
    name: 'Titan',
    icon: '🪐',
    bg: '#0a0d06',
    ambient: 0.35,
    keyLight: '#bbcc88',
    keyIntensity: 1.8,
    fillLight: '#668844',
    fillIntensity: 1.2,
    rimLight: '#99bb66',
    rimIntensity: 0.9,
    env: 'forest',
    starCount: 600,
    desc: 'Saturn\'s Moon — Dense Green Atmospheric Haze',
  },
];

function App() {
  const [planetIdx, setPlanetIdx] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [hologram, setHologram] = useState(false);

  const p = PLANETS[planetIdx];

  return (
    <div className="app-container">
      <div className="corner-marker tl" />
      <div className="corner-marker tr" />
      <div className="corner-marker bl" />
      <div className="corner-marker br" />

      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 2, 7], fov: 40 }}
          gl={{ antialias: true, toneMapping: 4, toneMappingExposure: 1.0 }}
        >
          <color attach="background" args={[p.bg]} />

          {/* Planet-specific lighting rig */}
          <ambientLight intensity={p.ambient} />
          <directionalLight position={[5, 8, 3]} intensity={p.keyIntensity} color={p.keyLight} />
          <directionalLight position={[-4, 5, -3]} intensity={p.fillIntensity} color={p.fillLight} />
          <pointLight position={[2, -2, 4]} intensity={p.rimIntensity} color={p.rimLight} distance={15} />
          {hologram && <pointLight position={[0, 0, 0]} intensity={4} color="#00e5ff" distance={10} />}

          <Suspense fallback={null}>
            <MechaModel wireframe={wireframe} hologram={hologram} />
            <Environment preset={p.env} background={false} />
            <Stars radius={50} depth={40} count={p.starCount} factor={4} fade speed={0.5} />

            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={4}
              maxDistance={16}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 1.8}
              autoRotate={autoRotate}
              autoRotateSpeed={hologram ? 2.0 : 1.0}
              enableDamping={true}
              dampingFactor={0.04}
              target={[0, 0.5, 0]}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI */}
      <div className="ui-overlay">
        <div className="header">
          <div className="brand">
            <h1>MECHA<span>-01</span></h1>
            <p>Advanced Tactical Weapons Platform</p>
          </div>
          <div className="status-badge">
            <span className="status-dot" />
            {hologram ? 'Hologram Active' : `Orbiting ${p.name}`}
          </div>
        </div>

        <div className="bottom-bar">
          {/* Specs */}
          <div className="specs-panel">
            <h3>Specifications</h3>
            <div className="spec-row">
              <span className="spec-label">Height</span>
              <span className="spec-value">18.2 M</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Weight</span>
              <span className="spec-value">72.4 T</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Armor</span>
              <span className="spec-value">TITANIUM-V</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Reactor</span>
              <span className="spec-value">PLASMA MK-III</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Location</span>
              <span className="spec-value" style={{ color: 'var(--accent)' }}>{p.name.toUpperCase()} ORBIT</span>
            </div>
          </div>

          <div className="controls-panel">
            {/* Render Mode */}
            <div className="control-group">
              <h4>Render Mode</h4>
              <div className="mode-buttons">
                <button
                  className={`mode-btn ${!hologram && !wireframe ? 'active' : ''}`}
                  onClick={() => { setHologram(false); setWireframe(false); }}
                >
                  <span className="mode-icon">◆</span>
                  Standard
                </button>
                <button
                  className={`mode-btn hologram-btn ${hologram ? 'active' : ''}`}
                  onClick={() => { setHologram(!hologram); setWireframe(false); }}
                >
                  <span className="mode-icon">◇</span>
                  Hologram
                </button>
                <button
                  className={`mode-btn ${wireframe && !hologram ? 'active' : ''}`}
                  onClick={() => { setWireframe(!wireframe); setHologram(false); }}
                >
                  <span className="mode-icon">▦</span>
                  X-Ray
                </button>
              </div>
            </div>

            {/* Planet Selector */}
            <div className="control-group">
              <h4>Planetary Lighting</h4>
              <div className="planet-selector">
                {PLANETS.map((planet, i) => (
                  <button
                    key={planet.name}
                    className={`planet-btn ${planetIdx === i ? 'active' : ''}`}
                    onClick={() => setPlanetIdx(i)}
                  >
                    <span className="planet-icon">{planet.icon}</span>
                    <span className="planet-name">{planet.name}</span>
                  </button>
                ))}
              </div>
              <p className="planet-desc">{p.desc}</p>
            </div>

            {/* Camera */}
            <div className="control-group">
              <h4>Camera</h4>
              <div className="toggle-row">
                <span className="toggle-label">Auto Rotate</span>
                <button
                  className={`toggle-btn ${autoRotate ? 'active' : ''}`}
                  onClick={() => setAutoRotate(!autoRotate)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
