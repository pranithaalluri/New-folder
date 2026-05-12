import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function PlantModal({ position, onPlant, onClose }) {
  const [message, setMessage] = useState('')

  const handlePlant = () => {
    if (!message.trim()) return
    onPlant(message.trim())
    setMessage('')
  }

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
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #fffdf4 0%, #fff8e7 100%)',
            border: '2px solid rgba(180,140,80,0.3)',
            borderRadius: 20,
            padding: '28px 32px',
            width: 320,
            boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(180,140,80,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>🌱</div>
            <h2 style={{
              fontFamily: "'Klee One', cursive",
              fontSize: '1.3rem',
              color: '#4a3728',
              fontWeight: 400,
              letterSpacing: '0.03em',
            }}>
              Plant a thought
            </h2>
            <p style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '0.9rem',
              color: '#9a8070',
              marginTop: 2,
            }}>
              what's on your mind?
            </p>
          </div>

          {/* Textarea */}
          <textarea
            autoFocus
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handlePlant()
              }
            }}
            placeholder="write something here..."
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.1rem',
              color: '#3a3028',
              background: 'rgba(255,255,255,0.6)',
              border: '1.5px solid rgba(180,140,80,0.25)',
              borderRadius: 12,
              padding: '12px 14px',
              resize: 'none',
              height: 100,
              outline: 'none',
              lineHeight: 1.5,
              letterSpacing: '0.02em',
            }}
          />

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
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
              maybe later
            </button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handlePlant}
              disabled={!message.trim()}
              style={{
                flex: 2,
                fontFamily: "'Klee One', cursive",
                fontSize: '1rem',
                background: message.trim()
                  ? 'linear-gradient(135deg, #6dbf5e, #4a9e3f)'
                  : 'rgba(180,180,180,0.3)',
                border: 'none',
                borderRadius: 12,
                padding: '8px 0',
                color: message.trim() ? 'white' : '#aaa',
                cursor: message.trim() ? 'pointer' : 'not-allowed',
                letterSpacing: '0.05em',
                boxShadow: message.trim() ? '0 2px 12px rgba(80,180,70,0.3)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              🌱 Plant
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}