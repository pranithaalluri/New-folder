import { motion } from 'framer-motion'

import './Flower.css'

export default function Flower({
  flower,
  onWater,
}) {

  return (

    <motion.div
      className="flower-wrapper"
      style={{
        left: flower.worldX,
        top: flower.worldY,
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