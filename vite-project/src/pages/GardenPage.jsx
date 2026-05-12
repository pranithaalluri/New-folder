import { useState, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'

import './GardenPage.css'

import Flower, { getRandomFlower } from '../components/Flower'
import PlantModal from '../components/PlantModal'
import ThoughtPopup from '../components/ThoughtPopup'

export default function GardenPage() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const [isDragging, setIsDragging] = useState(false)

  const [flowers, setFlowers] = useState([])

  const [modal, setModal] = useState(null)

  const [selectedFlower, setSelectedFlower] = useState(null)

  const startPos = useRef({ x: 0, y: 0 })

  const startOffset = useRef({ x: 0, y: 0 })

  const didDrag = useRef(false)

  // Drag start
const handleMouseDown = (e) => {
  if (modal || selectedFlower) return  // ← ignore clicks when modal is open
  e.preventDefault()
  setIsDragging(true)
  didDrag.current = false              // ← this already resets, so drag detection is fine
  startPos.current = { x: e.clientX, y: e.clientY }
  startOffset.current = { ...offset }
}

  // Drag move
  const handleMouseMove = (e) => {
    if (!isDragging) return

    const dx = e.clientX - startPos.current.x
    const dy = e.clientY - startPos.current.y

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      didDrag.current = true
    }

    setOffset({
      x: startOffset.current.x + dx,
      y: startOffset.current.y + dy,
    })
  }

  // Drag end
  const handleMouseUp = (e) => {
    if (!isDragging) return

    setIsDragging(false)

    if (didDrag.current) return

    const worldX = e.clientX - offset.x
    const worldY = e.clientY - offset.y

    setModal({
      worldX,
      worldY,
    })
  }

  // Plant flower
  const handlePlant = (message) => {
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

    setIsDragging(false)

    didDrag.current = false

    setModal(null)
  }

  // Water flower
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
      className="garden-scene"
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {setIsDragging(false),didDrag.current = false} }
    >
      {/* Grass */}
      <div
        className="garden-grass"
        style={{
          backgroundPosition: `${offset.x}px ${offset.y}px`,
        }}
      />

      {/* Flowers */}
      <div className="garden-flowers">
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

      {/* Plant modal */}
      {modal && (
        <PlantModal
          onPlant={handlePlant}
          onClose={() => setModal(null)}
        />
      )}

      {/* Thought popup */}
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