import React from 'react'
import "../scss/Navbar.scss"
import { Switch } from 'antd';
import { MoonFilled, SunFilled } from '@ant-design/icons';

// SVGs
import Chat from "../assets/navbar_svg/Chat.svg?react"
import Users from "../assets/navbar_svg/Users.svg?react"
import Phone from "../assets/navbar_svg/Phone.svg?react"
import Settings from "../assets/navbar_svg/Gear.svg?react"

// User Profile
import user_profile from "../assets/img/user_profile.jpg"

// Logo
import logo from "../assets/img/kumomo_logo.png"

function Navbar() {
  return (
    <div className='navbar-container'>
      <div className="logo-container">
        <img className='logo' src={logo} alt="" />
      </div>
      <ul className='nav-items'>
        <li className='nav-item active'>
          <Chat className='nav-icon'/>
        </li>
        <li className='nav-item'>
          <Users className='nav-icon'/>
        </li>
        <li className='nav-item'>
          <Phone />
        </li>
        <li className='nav-item'>
          <Settings />
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
          <img className='user-profile' src={user_profile} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Navbar