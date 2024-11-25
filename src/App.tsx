import { useEffect } from 'react'
import './App.scss'
import { RouterProvider } from "react-router-dom";
import router from './router';
function App() {
  useEffect(() => {
  }, [])
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
