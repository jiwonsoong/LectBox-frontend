import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../../img/logoText.jpg';
import './NavBar.css'

function NavBar() {
    // dummy
    const userName = '손지원'
    const Is_student = true
    let loginState = true

    let auth = ""
    if (Is_student === true) auth = "학생"
    else auth = "강의자"

    let title = ""
    // root면 userName으로, 강의실이면 강좌 이름으로
    title = "손지원"
    let link = ""
    // 
    link = "/user"

    return (
        <div className='Navbar'>
            <div className='NavbarLeft'>
                <Link to="/">
                    <img className='NavbarLogo' src={logoImage}/>
                </Link>
                {/* {
                    loginState===true 
                    && 
                    (<Link to={link} className='NavbarLink'>
                        <div className="NavbarTitle">{title}'s Lectbox</div>
                    </Link>)
                } */}
                
            </div>
            {
                loginState===true
                ? (
                    <button className='NavbarRight'>
                        <div><Link to="/userinfo">{userName} ({auth})</Link></div>
                    </button>
               )
                : (<div></div>)
            }
        </div>
    );
}

export { NavBar };