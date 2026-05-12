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

  const isBlooming = flower.waterCount >= 3
  const isRare = flower.waterCount >= 10

  const size =
    flower.waterCount >= 10
      ? 88
      : flower.waterCount >= 3
      ? 68
      : 48

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
        zIndex: isRare ? 30 : 12,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 14,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(flower)
      }}
    >
       <div
        style={{
          position: 'absolute',
          bottom: -6,
          width: size * 0.45,
          height: 10,
          background: 'rgba(0,0,0,0.18)',
          borderRadius: '50%',
          filter: 'blur(4px)',
          zIndex: -1,
        }}
      />
      {/* THOUGHT BUBBLE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          marginBottom: 4,
          fontFamily: "'Caveat', cursive",
          fontSize: '1rem',
          color: '#2f2f2f',
          textAlign: 'center',
          textShadow: '0 1px 2px rgba(255,255,255,0.7)',
          maxWidth: 120,
          lineHeight: 1.1,
          pointerEvents: 'none',
        }}
      >
        {flower.message}
      </motion.div>

      {/* FLOWER AREA */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isRare && (
          <motion.div
            style={{
              position: 'absolute',
              width: size + 90,
              height: size + 90,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,220,120,0.45) 0%, transparent 72%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Bloom aura */}
        {isBlooming && !isRare && (
          <motion.div
            style={{
              position: 'absolute',
              width: size + 40,
              height: size + 40,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,170,210,0.22) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
        )}

        {/* Flower */}
        <motion.img
          src={`/images/flowers/${flower.flowerType}.png`}
          alt={flower.flowerType}
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            imageRendering: 'pixelated',
            filter: isRare
              ? 'drop-shadow(0 0 14px rgba(255,210,100,0.95))'
              : isBlooming
              ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.28))'
              : 'drop-shadow(0 4px 8px rgba(0,0,0,0.18))',
          }}
          animate={{
            rotate: [-2, 2, -2],
            y: [0, -2, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* WATER COUNT */}
      {flower.waterCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginTop: 10,
            padding: '4px 10px',
            borderRadius: 999,
            background: 'rgba(60,140,210,0.14)',
            backdropFilter: 'blur(6px)',
            fontFamily: "'Caveat', cursive",
            fontSize: '0.9rem',
            color: '#2c6ea8',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          💧 {flower.waterCount}
        </motion.div>
      )}
    </motion.div>
  )
}