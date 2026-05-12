import { motion, AnimatePresence } from 'framer-motion'

const stageLabel = (count) => {
  if (count >= 10) return { label: '✨ Rare bloom', color: '#f0a500' }
  if (count >= 3) return { label: '🌸 Blooming', color: '#e06090' }
  return { label: '🌱 Sprouting', color: '#6dbf5e' }
}

export default function ThoughtPopup({ flower, onClose, onWater }) {
  if (!flower) return null
  const stage = stageLabel(flower.waterCount)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #fffdf4 0%, #fff8e7 100%)',
            border: '2px solid rgba(180,140,80,0.25)',
            borderRadius: 20,
            padding: '28px 32px',
            width: 320,
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            alignItems: 'center',
          }}
        >
          {/* Flower image */}
          <motion.img
            src={`/images/flowers/${flower.flowerType}.png`}
            alt={flower.flowerType}
            style={{ width: 64, height: 64, imageRendering: 'pixelated' }}
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          />

          {/* Stage */}
          <div style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '0.9rem',
            color: stage.color,
            letterSpacing: '0.05em',
          }}>
            {stage.label}
          </div>

          {/* Message */}
          <p style={{
            fontFamily: "'Klee One', cursive",
            fontSize: '1.1rem',
            color: '#3a3028',
            textAlign: 'center',
            lineHeight: 1.6,
            background: 'rgba(255,255,255,0.5)',
            borderRadius: 12,
            padding: '12px 16px',
            width: '100%',
          }}>
            "{flower.message}"
          </p>

          {/* Water count */}
          <div style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1rem',
            color: '#7a9080',
          }}>
            💧 {flower.waterCount} waters
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                fontFamily: "'Caveat', cursive",
                fontSize: '1rem',
                background: 'transparent',
                border: '1.5px solid rgba(180,140,80,0.3)',
                borderRadius: 12,
                padding: '8px 0',
                color: '#9a8070',
                cursor: 'pointer',
              }}
            >
              close
            </button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onWater(flower.id)}
              style={{
                flex: 2,
                fontFamily: "'Klee One', cursive",
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #5ab4e8, #3a8fc8)',
                border: 'none',
                borderRadius: 12,
                padding: '8px 0',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(60,140,200,0.3)',
              }}
            >
              💧 Water
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}