import { NavLink } from "react-router-dom";

function NavbarItem({ render, ...props }) {
  if (render) {
    return (
      <li className='nav-item'>
        <NavLink onClick={props.onClick} className='nav-link' activeClassName='active' to={props.href}>
          {props.label}
        </NavLink>
      </li>
    );
  } else {
    return false;
  }
}

export default NavbarItem;