import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { FLOWER_TYPES } from '../constants/flowers.js'
import './PlantModal.css'

export default function PlantModal({ onPlant, onClose, modal, setModal }) {
  const [message, setMessage] = useState('')

  const handlePlant = () => {
    if (!message.trim()) return

    onPlant(message.trim())
    setMessage('')
  }

  return (
    <AnimatePresence>
      <motion.div
        className="plant-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <motion.div
          className="plant-modal"
          initial={{ opacity: 0, scale: 0.7, y: 50, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 50, rotate: -3 }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 18,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        >
          <div className="plant-modal-header">
            <div className="plant-modal-emoji">🌱</div>
            <h2>Plant a thought</h2>
            <p>leave something in the field</p>
          </div>

<div>
            {FLOWER_TYPES.map((flowerType) => {
              const isSelected = modal.selectedFlower === flowerType
              return (
                <button
                  key={flowerType}
                  type="button"
                  className={`flower-option ${isSelected ? 'selected' : ''}`}
                  onClick={() =>
                    setModal({
                      ...modal,
                      selectedFlower: flowerType,
                    })
                  }
                >
                  <img
                    src={`/images/flowers/${flowerType}.png`}
                    width="40"
                    alt={flowerType}
                  />
                </button>
              )
            })}
            </div>
        

          {modal.selectedFlower && (
            <textarea
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="write here..."
              className="plant-modal-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handlePlant()
                }
              }}
            />
          )}

          <div className="plant-modal-actions">
            <button className="plant-modal-cancel" onClick={onClose}>
              maybe later
            </button>

            <button
              className="plant-modal-submit"
              onClick={handlePlant}
              disabled={!message.trim()}
            >
              🌱 plant
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}