import { createBrowserRouter, Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import RootLayout from "./main/RootLayout";
import ListagemUsuarios from "./view/ListagemUsuarios";
import CadastroUsuario from "./view/CadastroUsuario";
import ListagemSugestoes from "./view/ListagemSugestoes";
import CadastroSugestao from "./view/CadastroSugestao";
import ListagemProdutos from "./view/ListagemProdutos";
import CadastroProduto from "./view/CadastroProduto";
import ListagemEstoques from "./view/ListagemEstoques";
import CadastroEstoque from "./view/CadastroEstoque";
import ListagemCompras from "./view/ListagemCompras";
import CadastroCompra from "./view/CadastroCompra";
import Login from "./view/Login";
import ProtectedRoute from "./main/ProtectedRoot";

const rotas = createBrowserRouter([

  {
    path: "/login",
    element: <Login />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <> </>
      },
      /* Listagens */
      {
        path: "/listagem-usuarios",
        element: <ListagemUsuarios />
      },
      {
        path: "/listagem-sugestoes",
        element: <ListagemSugestoes />
      },
      {
        path: "/listagem-produtos",
        element: <ListagemProdutos />
      },
      {
        path: "/listagem-estoques",
        element: <ListagemEstoques />
      },
      {
        path: "/listagem-compras",
        element: <ListagemCompras />
      },


      /* Cadastros */

      {
        path: "/cadastro-usuario/:idParam?",
        element: <CadastroUsuario />
      },
      {
        path: "/cadastro-sugestao/:idParam?",
        element: <CadastroSugestao />
      },
      {
        path: "/cadastro-produto/:idParam?",
        element: <CadastroProduto />
      },
      {
        path: "/cadastro-estoque/:idParam?",
        element: <CadastroEstoque />
      },
      {
        path: "/cadastro-compra/:idParam?",
        element: <CadastroCompra />
      },

      /* 404 */

      {
        path: "*",
        element: <> <h1>404 NOT FOUND</h1> <a href="/login">Voltar para Login</a> </>
      },
    ]
  }
])

export { rotas };