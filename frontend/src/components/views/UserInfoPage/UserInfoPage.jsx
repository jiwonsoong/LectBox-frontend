import React, { useEffect, useState } from "react"
import './UserInfoPage.css';
function UserInfoPage(){
	const [UserInfo, setuserInfo] = useState({u_id: "", u_email: "", u_name: "",u_password: 
    "",change_password: ""});

    const user_pass = '1234'

    useEffect(() => {
        // 폴더 정보 요청
        setuserInfo({
            u_id: 'sjw0592',
            u_email: "sjw0592@khu.ac.kr",
            u_name: "손지원",
            u_password: "1234",
            change_password: "",
        })

         // UserRequest().then((data) =>
        //     setuserInfo({
        //     u_id: data.id,
        //     u_name: data.name,
        //     u_email: data.e-mail
        //     u_password: data.password 
        //     })
        // );
    }, []);

    function onChangetext (e){
        setuserInfo.u_password(e.target.value);
    }

    const UserRequest = () => {
        const url = "api/member-detail/";
        const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: authHeader().Authorization,
            },
        };

        return (
            fetch(url, requestOptions)
            .then(handleResponse)
        )
    };

    const deleteUser = () => {
        if (user_pass === UserInfo.u_password) {
            deleteRequest()
            .then(
                ()=>{
                    alert('회원탈퇴 되었습니다.');
                    props.history.push('/login');
                }
            )
        } else {
            alert('삭제 권한이 없습니다.')
        }
    }

    const deleteRequest = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            }
        };

        const url = '/api/member-detail/'

        return (
            fetch(url, requestOptions)
            .then(handleResponse)
        )
    }

    const handleResponse = (response) => {
        if (!response.status === 200 && !response.status === 204) {
        if (
            response.status === 400 ||
            response.status === 401 ||
            response.status === 404
        ) {
            window.location.reload(true);
        }
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
        }
        return response;
    };


    return(
        <div className="UserInfoPage">
            <div className="UContainer">
                <div className="UCategory">
                    <div className="CategoryName">계정 설정</div>
                </div>
                <div className="UItem">
                    <p className="UItemTitle">아이디</p>
                    <p>{UserInfo.u_id}</p>
                </div>
                <div className="UItem">
                    <p className="UItemTitle">이메일</p>
                    <p>{UserInfo.u_email}</p>
                </div>
                <div className="UItem">
                    <p className="UItemTitle">이름</p>
                    <p>{UserInfo.u_name}</p>
                </div>
                <div className="UItem">
                    <p className="UItemTitle">비밀번호 변경</p>
                    <input onChange={onChangetext}/>
                </div>
                <div className="UItem">
                    <button>확인</button>
                </div>
                <div className="UItem">
                    <button className="UButton" onClick={deleteUser}>회원탈퇴</button>
                </div>
            </div>
        </div>
    );
}
export {UserInfoPage}