import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Sensitivity math: larger numbers = slower movement
      const x = (e.clientX - window.innerWidth / 2) / 15
      const y = (e.clientY - window.innerHeight / 2) / 15
      setOffset({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div 
      className="grass-field" 
      style={{ 
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` 
      }}
    ></div>
  )
}

export default App