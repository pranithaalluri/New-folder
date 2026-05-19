import { useState, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Flower from '../components/Flower'
import PlantModal from '../components/PlantModal'
import { getFlowerThoughts, createFlowerThought } from '../api/flowerApi'
import './GardenPage.css'

export default function GardenPage() {

  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const [isDragging, setIsDragging] = useState(false)

  const [flowers, setFlowers] = useState([])

  const [modal, setModal] = useState(null)

  const startPos = useRef({ x: 0, y: 0 })

  const startOffset = useRef({ x: 0, y: 0 })

  const didDrag = useRef(false)

  // LOAD FLOWERS FROM BACKEND
  useEffect(() => {

    async function loadFlowers() {

      try {

        const data = await getFlowerThoughts()

        // Map backend data to frontend structure
        const mappedFlowers = data.map((flower) => ({
          id: flower.id,

          message: flower.thought,

          flowerType: flower.flowerType,

          worldX: flower.worldX || 300,

          worldY: flower.worldY || 300,

          waterCount: flower.waterCount || 0,

          createdAt: flower.createdAt,
        }))

        setFlowers(mappedFlowers)

      } catch (error) {

        console.error('Failed to load flowers:', error)
      }
    }

    loadFlowers()

  }, [])

  // Drag start
  const handleMouseDown = (e) => {

    if (modal) return

    e.preventDefault()

    setIsDragging(true)

    didDrag.current = false

    startPos.current = {
      x: e.clientX,
      y: e.clientY,
    }

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
      selectedFlower: null,
    })
  }

  // PLANT FLOWER
  const handlePlant = async (message) => {

    if (!modal) return

    try {

      // Object sent to backend
      const flowerRequest = {

        flowerType: modal.selectedFlower,

        thought: message,

        userId: 1,

        worldX: modal.worldX,

        worldY: modal.worldY,
      }

      // Save to backend
      const savedFlower = await createFlowerThought(flowerRequest)

      // Convert backend response for frontend
      const newFlower = {

        id: savedFlower.id,

        message: savedFlower.thought,

        flowerType: savedFlower.flowerType,

        worldX: savedFlower.worldX,

        worldY: savedFlower.worldY,

        waterCount: savedFlower.waterCount || 0,

        createdAt: savedFlower.createdAt,
      }

      setFlowers((prevFlowers) => {

        return [...prevFlowers, newFlower]
      })

      setIsDragging(false)

      didDrag.current = false

      setModal(null)

    } catch (error) {

      console.error('Failed to plant flower:', error)
    }
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
  }

  return (
    <div
      className="garden-scene"
      onMouseLeave={() => {

        setIsDragging(false)

        didDrag.current = false
      }}
    >

      {/* INTERACTIVE BACKGROUND */}
      <div
        className="garden-background"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >

        <div
          className="garden-grass"
          style={{
            backgroundPosition: `${offset.x}px ${offset.y}px`,
          }}
        />

      </div>

      {/* FLOWERS */}
      <div className="garden-flowers">

        <AnimatePresence>

          {flowers.map((flower) => {

            return (
              <Flower
                key={flower.id}
                flower={flower}
                offset={offset}
                onWater={handleWater}
              />
            )
          })}

        </AnimatePresence>

      </div>

      {/* MODAL */}
      {modal && (
        <PlantModal
          modal={modal}
          setModal={setModal}
          onPlant={handlePlant}
          onClose={() => setModal(null)}
        />
      )}

    </div>
  )
}