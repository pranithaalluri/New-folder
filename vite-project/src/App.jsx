// import { useEffect, useState } from 'react'
// import './App.css'

// function App() {
//   const [offset, setOffset] = useState({ x: 0, y: 0 })

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       const x = (e.clientX - window.innerWidth / 2) / 10
//       const y = (e.clientY - window.innerHeight / 2) / 10
//       setOffset({ x, y })
//     }
//     window.addEventListener('mousemove', handleMouseMove)
//     return () => window.removeEventListener('mousemove', handleMouseMove)
//   }, [])

//   return (
//     <div className="scene">
//       <div
//         className="grass-layer"
//         style={{
//           transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`
//         }}
//       />
//     </div>
//   )
// }

// export default App

import React, { useState, useRef } from "react";
import "./App.css"; // We'll define background styles here

export default function App() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startOffset = useRef({ x: 0, y: 0 });

  // Start dragging
  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevent text selection
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    startOffset.current = { ...offset };
  };

  // Drag movement
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setOffset({
      x: startOffset.current.x + dx,
      y: startOffset.current.y + dy,
    });
  };

  // Stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    startPos.current = { x: touch.clientX, y: touch.clientY };
    startOffset.current = { ...offset };
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startPos.current.x;
    const dy = touch.clientY - startPos.current.y;
    setOffset({
      x: startOffset.current.x + dx,
      y: startOffset.current.y + dy,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

return (
  <div
    className="scene"
    style={{
      cursor: isDragging ? "grabbing" : "grab",
    }}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    onMouseLeave={handleMouseUp}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
    <div 
      className="grass-layer" 
      style={{
        backgroundPosition: `${offset.x}px ${offset.y}px`,
      }}
    />

  </div>
);
}
