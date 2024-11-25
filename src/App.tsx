import { useEffect, useState } from 'react'
import './App.scss'
import { RouterProvider } from "react-router-dom";
import router from './router';
import ipc from './utils/IPC';
function App() {

  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
