import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Example from './pages/Example'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Example />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
