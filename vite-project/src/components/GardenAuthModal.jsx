import { useState } from 'react'
import { authAccount } from '../api/flowerApi'

export default function GardenAuthModal({ onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const payload = isRegister 
      ? { username, email, password } 
      : { email, password }

    try {
      const endpoint = isRegister ? 'register' : 'login'
      const result = await authAccount(endpoint, payload)
      onAuthSuccess(result.token)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <div className="garden-modal-overlay">
      <div className="animal-crossing-popup">
        
        <div className="modal-tabs">
          <button 
            type="button" 
            className={`modal-tab-btn ${!isRegister ? 'active-tab' : ''}`}
            onClick={() => { setIsRegister(false); setErrorMessage(''); }}
          >
            Welcome Back 🔑
          </button>
          <button 
            type="button" 
            className={`modal-tab-btn ${isRegister ? 'active-tab' : ''}`}
            onClick={() => { setIsRegister(true); setErrorMessage(''); }}
          >
            New Sprout 🌱
          </button>
        </div>

        <div className="modal-content">
          <h2 className="modal-headline">
            {isRegister ? 'Identify yourself, Sprout!' : 'Who goes there?!'}
          </h2>

          {errorMessage && (
            <p className="error-banner-text" style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '0.85rem' }}>
              ⚠️ {errorMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} className="modal-form">
            {isRegister && (
              <div className="input-field-block">
                <label className="field-label">Gardener Alias</label>
                <input 
                  type="text" 
                  className="game-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="input-field-block">
              <label className="field-label">Mailbox (Email)</label>
              <input 
                type="email" 
                className="game-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-field-block">
              <label className="field-label">Secret Password</label>
              <input 
                type="password" 
                className="game-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="game-submit-btn">
              {isRegister ? 'Create My Plot! ✨' : 'Enter Garden! 🚀'}
            </button>
          </form>

          <div className="modal-divider">─── OR ───</div>

          <button type="button" className="wanderer-escape-btn" onClick={onClose}>
            I'm just a silly wanderer (Look but don't touch 👀)
          </button>
        </div>

      </div>
    </div>
  )
}