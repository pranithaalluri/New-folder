import { useState, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Flower from '../components/Flower'
import PlantModal from '../components/PlantModal'
import { getFlowerThoughts, createFlowerThought } from '../api/flowerApi'
import './GardenPage.css'
import GardenAuthModal from '../components/GardenAuthModal'

export default function GardenPage() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [flowers, setFlowers] = useState([])
  const [modal, setModal] = useState(null)
  const [userToken, setUserToken] = useState(() => localStorage.getItem('gardener_token'))
  const [showAuthModal, setShowAuthModal] = useState(false)

  const startPos = useRef({ x: 0, y: 0 })
  const startOffset = useRef({ x: 0, y: 0 })
  const didDrag = useRef(false)

  useEffect(() => {
    async function loadFlowers() {
      try {
        const data = await getFlowerThoughts()
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

  const handleMouseDown = (e) => {
    if (modal || showAuthModal) return
    e.preventDefault()
    setIsDragging(true)
    didDrag.current = false
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
    }
    startOffset.current = { ...offset }
  }

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

  const handleMouseUp = (e) => {
    if (!isDragging) return
    setIsDragging(false)
    if (didDrag.current) return

    if (!userToken) {
      setShowAuthModal(true)
      return
    }

    const worldX = e.clientX - offset.x
    const worldY = e.clientY - offset.y

    setModal({
      worldX,
      worldY,
      selectedFlower: null,
    })
  }

  const handlePlant = async (message) => {
    if (!modal) return
    try {
      const flowerRequest = {
        flowerType: modal.selectedFlower,
        thought: message,
        worldX: modal.worldX,
        worldY: modal.worldY,
      }

      const savedFlower = await createFlowerThought(flowerRequest)
      const newFlower = {
        id: savedFlower.id,
        message: savedFlower.thought,
        flowerType: savedFlower.flowerType,
        worldX: savedFlower.worldX,
        worldY: savedFlower.worldY,
        waterCount: savedFlower.waterCount || 0,
        createdAt: savedFlower.createdAt,
      }

      setFlowers((prevFlowers) => [...prevFlowers, newFlower])
      setIsDragging(false)
      didDrag.current = false
      setModal(null)
    } catch (error) {
      console.error('Failed to plant flower:', error)
    }
  }

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

      {modal && (
        <PlantModal
          modal={modal}
          setModal={setModal}
          onPlant={handlePlant}
          onClose={() => setModal(null)}
        />
      )}

      {showAuthModal && (
        <GardenAuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(token) => {
            setUserToken(token)
            setShowAuthModal(false)
          }}
        />
      )}
    </div>
  )
}