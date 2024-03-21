import "../scss/Navbar.scss"
import { Switch } from 'antd';
import { 
  MoonFilled, 
  SunFilled, 
  LogoutOutlined,
  TeamOutlined,
  WechatWorkOutlined
} from '@ant-design/icons';
import Chat from "../assets/navbar_svg/Chat.svg?react"
import logo from "../assets/img/kumomo_logo.png"
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase-config.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useContext } from "react";

function Navbar() {
  const navigate = useNavigate();
  const {currentUser} = useContext(AuthContext);
  
  const handleSignOut = () => {
    signOut(auth);
    navigate('/login');
  }

  return (
    <div className='navbar-container'>
      <div className="logo-container">
        <img className='logo' src={logo} alt="" />
      </div>
      <ul className='nav-items'>
        <li className='nav-item active'>
          <WechatWorkOutlined className='nav-icon'/>
        </li>
        <li className='nav-item'>
          <TeamOutlined className='nav-icon'/>
        </li>

        {/* TODO: Impliment call functionality in the future */}
        {/* <li className='nav-item'>
          <Phone />
        </li>
        <li className='nav-item'>
          <Settings />
        </li> */}
        
        <li className='nav-item' onClick={handleSignOut}>
          <LogoutOutlined className='nav-icon'/>
        </li>
      </ul>

      <div className="theme-user-profile-container">
        <Switch
          className='theme-switch'
          checkedChildren={<SunFilled />}
          unCheckedChildren={<MoonFilled />}
          defaultChecked
        />
        <div className="user-profile-container">
          <img className='user-profile' src={currentUser.photoURL} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Navbar