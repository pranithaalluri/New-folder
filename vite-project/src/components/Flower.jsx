import { motion } from 'framer-motion'

import './Flower.css'

export default function Flower({
  flower,
  offset,
  onWater,
}) {
  const screenX = flower.worldX + offset.x
  const screenY = flower.worldY + offset.y

  return (
    <motion.div
      className="flower-wrapper"
      style={{
        left: screenX,
        top: screenY,
        transform: 'translateX(-50%)',
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flower-thought">
        {flower.message}
      </div>

      <img
        src={`/images/flowers/${flower.flowerType}.png`}
        alt=""
        className="flower-image"
      />

      <button
        className="flower-water"
        onClick={(e) => {
          e.stopPropagation()
          onWater(flower.id)
        }}
      >
        💧 {flower.waterCount}
      </button>
    </motion.div>
  )
}