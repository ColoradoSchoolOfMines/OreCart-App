import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Navbar.scss';
interface NavBarProps { }

const NavBar: React.FC<NavBarProps> = () => {
  return (
    <div className="c-navbar">
      <nav>
        <div className="logo">
          <img src={logo} />
        </div>
        <ul className="nav-links">
          <li><Link to="/vans">Vans</Link></li>
          <li><Link to="/alerts">Alerts</Link></li>
          <li><Link to="/routes">Routes</Link></li>
          <li><Link to="/ridership">Ridership</Link></li>
          <li><Link to="/accomodations">Accomodations</Link></li>
        </ul>
      </nav>
      <div className='divider'></div>
    </div>
  );
};

export default NavBar;
