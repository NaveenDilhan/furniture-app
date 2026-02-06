import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './App.css'; // Ensure you have your basic CSS file

// --- 1. The 3D Component (Furniture Item) ---
function Box(props) {
  // This reference gives us direct access to the mesh object so we can rotate it
  const meshRef = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Subscribe this component to the render-loop, rotating the mesh every frame
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

// --- 2. The Main Application ---
function App() {
  
  // Function to save data to your Server (MongoDB)
  const saveDesign = async () => {
    // In a real app, you would gather these positions from the state
    const designData = {
      designerName: "John Doe", 
      furnitureData: [
        { type: 'box', position: [-1.2, 0, 0], color: 'orange' },
        { type: 'box', position: [1.2, 0, 0], color: 'orange' }
      ]
    };

    try {
      // Connect to the server running on Port 5000
      const response = await fetch('http://localhost:5000/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designData),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert("Success: " + result.message); // "Design Saved!"
      } else {
        alert("Error: " + result.error);
      }
      
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to connect to server. Is it running?");
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#202020' }}>
      
      {/* --- UI Overlay (HTML) --- */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1, color: 'white' }}>
        <h1>Furniture Designer</h1>
        <p>Click objects to scale. Drag to rotate view.</p>
        
        {/* Button to trigger the API call */}
        <button 
          onClick={saveDesign} 
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            cursor: 'pointer',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginTop: '10px'
          }}>
          Save Design to Database
        </button>
      </div>

      {/* --- 3D Scene (Canvas) --- */}
      <Canvas>
        {/* Lights to make objects visible */}
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        
        {/* Our Furniture Items (The Box Components) */}
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        
        {/* Controls to rotate the camera */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;