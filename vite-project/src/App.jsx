import { useState, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'

import './App.css'

import Flower, { getRandomFlower } from './components/Flower.jsx'
import PlantModal from './components/PlantModal.jsx'
import ThoughtPopup from './components/ThoughtPopup.jsx'

export default function App() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const [flowers, setFlowers] = useState([])

  // stores click position for planting
  const [modal, setModal] = useState(null)

  // stores currently selected flower
  const [selectedFlower, setSelectedFlower] = useState(null)

  const startPos = useRef({ x: 0, y: 0 })
  const startOffset = useRef({ x: 0, y: 0 })
  const didDrag = useRef(false)

  // -----------------------------
  // DRAG START
  // -----------------------------
  const handleMouseDown = (e) => {
    e.preventDefault()

    setIsDragging(true)
    didDrag.current = false

    startPos.current = {
      x: e.clientX,
      y: e.clientY,
    }

    startOffset.current = {
      ...offset,
    }
  }

  // -----------------------------
  // DRAG MOVE
  // -----------------------------
  const handleMouseMove = (e) => {
    if (!isDragging) return

    const dx = e.clientX - startPos.current.x
    const dy = e.clientY - startPos.current.y

    // detect actual drag
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      didDrag.current = true
    }

    setOffset({
      x: startOffset.current.x + dx,
      y: startOffset.current.y + dy,
    })
  }

  // -----------------------------
  // DRAG END / CLICK
  // -----------------------------
  const handleMouseUp = (e) => {
    if (!isDragging) return

    setIsDragging(false)

    // if user dragged, don't plant
    if (didDrag.current) return

    const worldX = e.clientX - offset.x
    const worldY = e.clientY - offset.y

    setModal({
      worldX,
      worldY,
    })
  }

  // -----------------------------
  // PLANT FLOWER
  // -----------------------------
  const handlePlant = (message) => {
    // safety check
    if (!modal) return

    const newFlower = {
      id: Date.now(),

      message,

      worldX: modal.worldX,
      worldY: modal.worldY,

      waterCount: 0,

      flowerType: getRandomFlower(),

      createdAt: new Date().toISOString(),
    }

    setFlowers((prevFlowers) => {
      return [...prevFlowers, newFlower]
    })

    setModal(null)
  }

  // -----------------------------
  // WATER FLOWER
  // -----------------------------
  const handleWater = (flowerId) => {
    setFlowers((prevFlowers) => {
      return prevFlowers.map((flower) => {
        if (flower.id === flowerId) {
          return {
            ...flower,
            waterCount: flower.waterCount + 1,
          }
        }

        return flower
      })
    })

    setSelectedFlower((prevSelectedFlower) => {
      if (!prevSelectedFlower) return null

      if (prevSelectedFlower.id === flowerId) {
        return {
          ...prevSelectedFlower,
          waterCount: prevSelectedFlower.waterCount + 1,
        }
      }

      return prevSelectedFlower
    })
  }

  return (
    <div
      className="scene"
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* Grass Background */}
      <div
        className="grass-layer"
        style={{
          backgroundPosition: `${offset.x}px ${offset.y}px`,
        }}
      />

      {/* Flowers */}
      <div className="flowers-layer">
        <AnimatePresence>
          {flowers.map((flower) => {
            return (
              <Flower
                key={flower.id}
                flower={flower}
                offset={offset}
                onClick={setSelectedFlower}
              />
            )
          })}
        </AnimatePresence>
      </div>

      {/* Plant Modal */}
      {modal && (
        <PlantModal
          position={modal}
          onPlant={handlePlant}
          onClose={() => setModal(null)}
        />
      )}

      {/* Thought Popup */}
      {selectedFlower && (
        <ThoughtPopup
          flower={selectedFlower}
          onClose={() => setSelectedFlower(null)}
          onWater={handleWater}
        />
      )}
    </div>
  )
}