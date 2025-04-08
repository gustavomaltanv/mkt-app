import "bootswatch/dist/zephyr/bootstrap.min.css"
import { rotas } from "./rotas"
import { RouterProvider } from "react-router-dom"

function App() {
  return <RouterProvider router={ rotas } />
}

export default App
