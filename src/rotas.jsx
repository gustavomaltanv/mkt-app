import { createBrowserRouter, Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import ListagemUsuarios from "./view/ListagemUsuarios";
import CadastroUsuario from "./view/CadastroUsuario";

const rotas = createBrowserRouter([
  {
    element: 
      <> 
        <Navbar /> 
        <Outlet /> 
      </>,
    children: [
      {
        path: "/",
        element: <> oi </>
      },

      /* Listagens */

      {
        path: "/listagem-usuarios",
        element: <ListagemUsuarios />
      },


      /* Cadastros */

      {
        path: "/cadastro-usuario/:idParam?",
        element: <CadastroUsuario />
      },

      /* 404 */

      {
        path: "*",
        element: <> 404 NOT FOUND </>
      },
    ]
  }
])

export { rotas };