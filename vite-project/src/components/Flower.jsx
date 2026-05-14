import { motion } from 'framer-motion'
import './Flower.css'
const FLOWER_SIZES = {
  SunflowerOUTLINED: 52,
  TulipOUTLINED: 36,
  RoseOUTLINED: 40,
  DaisyOUTLINED: 34,
  LavenderOUTLINED: 38,
  LilyOUTLINED: 42,
}
const FLOWER_TYPES = [
  'CosmoOUTLINED',
  'DaffodilOUTLINED',
  'DaisyOUTLINED',
  'LavenderOUTLINED',
  'LilyOfTheValleyOUTLINED',
  'LilyOUTLINED',
  'OrchidOUTLINED',
  'PansyOUTLINED',
  'PoppyOUTLINED',
  'RoseOUTLINED',
  'SunflowerOUTLINED',
  'TulipOUTLINED',
]

// export function getRandomFlower() {
//   return FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)]
// }

export default function Flower({ flower, offset, onClick }) {
  const screenX = flower.worldX + offset.x
  const screenY = flower.worldY + offset.y

  const isBlooming = flower.waterCount >= 3
  const isRare = flower.waterCount >= 10

const size =
  FLOWER_SIZES[flower.flowerType] || 40

  return (
    <motion.div
      className="flower-wrapper"
      style={{
        left: screenX,
        top: screenY,
        transform: 'translateX(-50%)',
        marginTop: -size,
        zIndex: isRare ? 20 : 10,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(flower)
      }}
    >
      <div className="flower-thought">
        {flower.message}
      </div>

      <div className="flower-area">

        {(isRare || isBlooming) && (
          <div
            className={
              isRare
                ? 'flower-glow flower-glow-rare'
                : 'flower-glow flower-glow-bloom'
            }
          />
        )}

        <div
          className="flower-shadow"
          style={{
            width: size * 0.38,
            height: 8,
          }}
        />

        <img
          src={`/images/flowers/${flower.flowerType}.png`}
          alt={flower.flowerType}
          className="flower-image"
          style={{
            width: size,
            height: size,
          }}
        />
      </div>

      {flower.waterCount > 0 && (
        <div className="flower-water">
          💧 {flower.waterCount}
        </div>
      )}
    </motion.div>
  )
}