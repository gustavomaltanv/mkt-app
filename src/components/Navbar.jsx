import NavbarItem from "./NavbarItem";

export function Navbar(props) {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark mb-2" data-bs-theme="dark">
        <div className="container">
          <a className="navbar-brand" href="/">MKT</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor02">

            <ul className="navbar-nav me-auto">

              <li className="nav-item">
                <NavbarItem
                  render='true'
                  href='/listagem-compras'
                  label='Compras'
                />
              </li>
              <li className="nav-item">
                <NavbarItem
                  render='true'
                  href='/listagem-produtos'
                  label='Produtos'
                />
              </li>
              <li className="nav-item">
                <NavbarItem
                  render='true'
                  href='/listagem-estoques'
                  label='Estoques'
                />
              </li>
              <li className="nav-item">
                <NavbarItem
                  render='true'
                  href='/listagem-sugestoes'
                  label='Sugestões'
                />
              </li>
              <li className="nav-item">
                <NavbarItem
                  render='true'
                  href='/listagem-usuarios'
                  label='Usuários'
                />
              </li>

            </ul>
            
          </div>
        </div>
      </nav>
    </>
  )
}