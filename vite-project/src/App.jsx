import './App.css'

import GardenPage from './pages/GardenPage'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

// import LoginPage from './pages/LoginPage'
// import RegisterPage from './pages/RegisterPage'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<GardenPage />}
        />

        {/* <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        /> */}

      </Routes>

    </BrowserRouter>
  )
}

export default App