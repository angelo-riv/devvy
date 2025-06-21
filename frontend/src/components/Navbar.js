import {Link} from 'react-router-dom';

const Navbar = () => {
  return ( 
  <div className = "navbar">
    <div className = "left-navbar">
      <img src="/logo.png" alt="Logo" className="nav-logo" />
      <h1>Devvy</h1>
    </div>
    <div className = "right-navbar">
      <Link to = "/">Home</Link>
      <Link to = "/problems">Problems</Link>
      <Link to = "/explore">Explore</Link>
      <Link to = "/events">Events</Link>
      <Link to = "/profile">Profile</Link>
    </div>
  </div> );
}
 
export default Navbar;