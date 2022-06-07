import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../img/logoText.jpg';
import { authHeader } from '../../_helpers';
import './NavBar.css'

function NavBar() {
    const [loginState, setloginState] = useState();
    const [userId, setuserId] = useState();
    const [userName, setuserName] = useState();
    const [Is_student, setIs_student] = useState();
    const [auth, setauth] = useState();

    const link = "/user"

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        // 로그인 된 상태
        if(user) {
            setloginState(true);
            setuserId(user.id);
            setuserName(user.name);
            setIs_student(user.is_student);
            if (Is_student) setauth('수강자');
            else setauth('강의자');
        } 
        // 로그인 안 된 상태
        else {
            setloginState(false);
        }
    }, )
    

    function logout() {
        alert('로그아웃 되었습니다.');
        window.location.reload();
        localStorage.removeItem('user');
    }

    return (
        <div className='Navbar'>
            <div className='NavbarLeft'>
                <Link to="/">
                    <img className='NavbarLogo' src={logoImage}/>
                </Link>
            </div>
            {
                loginState===true
                ? (
                    <div className='NavbarRight'>
                        <button><Link to="/userinfo">{userName} ({auth})</Link></button>
                        <button onClick={logout}><Link to="/login" >로그아웃</Link></button>
                    </div>
               )
                : (<div></div>)
            }
        </div>
    );
}

export { NavBar };