import { motion } from 'framer-motion'

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

export function getRandomFlower() {
  return FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)]
}

export default function Flower({ flower, offset, onClick }) {
  const screenX = flower.worldX + offset.x
  const screenY = flower.worldY + offset.y

  const size = flower.waterCount >= 10 ? 72
    : flower.waterCount >= 3 ? 56
    : 40

  const isRare = flower.waterCount >= 10
  const isBlooming = flower.waterCount >= 3

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: screenX,
        top: screenY,
        transform: 'translate(-50%, -100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        pointerEvents: 'all',
        zIndex: 10,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(flower)
      }}
    >
      {/* Glow for rare flowers */}
      {isRare && (
        <motion.div
          style={{
            position: 'absolute',
            width: size + 100,
            height: size + 100,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,220,100,0.4) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: -1,
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      )}

      {/* Flower image with sway */}
      <motion.img
        src={`/images/flowers/${flower.flowerType}.png`}
        alt={flower.flowerType}
        style={{
          width: size,
          height: size,
          imageRendering: 'pixelated',
          filter: isRare
            ? 'drop-shadow(0 0 8px rgba(255,200,50,0.9))'
            : isBlooming
            ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            : 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
        }}
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 3 + Math.random() * 2, ease: 'easeInOut' }}
      />

      {/* Thought preview */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          marginTop: 4,
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(4px)',
          borderRadius: 10,
          padding: '2px 8px',
          fontFamily: "'Caveat', cursive",
          fontSize: '0.72rem',
          color: '#3a3a3a',
          maxWidth: 90,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          pointerEvents: 'none',
        }}
      >
        {flower.message}
      </motion.div>

      {/* Water count badge */}
      {flower.waterCount > 0 && (
        <div style={{
          fontFamily: "'Caveat', cursive",
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.9)',
          textShadow: '0 1px 3px rgba(0,0,0,0.4)',
          marginTop: 2,
        }}>
          💧 {flower.waterCount}
        </div>
      )}
    </motion.div>
  )
}