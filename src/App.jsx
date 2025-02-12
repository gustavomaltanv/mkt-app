import "bootswatch/dist/Zephyr/bootstrap.min.css"
import "./index.css"
import { rotas } from "./rotas"
import { RouterProvider } from "react-router-dom"

function App() {
  return <RouterProvider router={ rotas } />
}

export default App
