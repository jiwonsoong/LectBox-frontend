import React, { useState, useEffect } from "react";
import './ManageClassPage.css';
import { authHeader } from "../../_helpers";

function ManageClassPage(props) {
	// const { params } = props.match;
    const [user, setuser] = useState({});
    const baseurl = 'http://3.231.84.43:8000';
    const path = JSON.parse(localStorage.getItem('path'));
	const [folderInfo, setfolderInfo] = useState({f_id: path.pro, f_name: "unknown", manager: "unknown"});

    // 페이지 첫 렌더링 시 동작
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user){
            setuser({
                id: user.id
            })
            // 폴더 정보 요청
            folderRequest()
            .then((data) =>
                setfolderInfo({
                    f_id: data.id,
                    f_name: data.name,
                    manager: data.made_by
                })
            );
        } else {
            return ;
        }
        
    }, []);

    /**
     * 요청
     */
    // 폴더 정보 요청 함수
    const folderRequest = () => {
        console.log(path)
        console.log(path.pro)
        const url = baseurl + "/api/folder/" + path.pro + "/0";
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

    // 강의실 삭제 요청 함수 
    const deleteRequest = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            }
        };

        const url = baseurl + '/api/folder/' + folderInfo.f_id.toString();

        return (
            fetch(url, requestOptions)
            .then(handleResponse)
        )
    }

    const handleResponse = (response) => {
        return response.text().then(json => {
            const data = json && JSON.parse(json);
            if (!response.status === 200) {
                if (response.status === 400 ||
                    response.status === 401 ||
                    response.status === 404) {

                    window.location.reload(true);
                }
    
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            

            return data;
        });
    };


    /**
     * 강의실 삭제 기능
     */
    const deleteClass = () => {
        if (user.id === folderInfo.manager) {
            deleteRequest()
            .then(
                ()=>{
                    alert('강의실이 삭제되었습니다.');
                    props.history.push('/user');
                }
            )
        } else {
            alert('삭제 권한이 없습니다.')
        }
    }


    return (
        <div className="ManageClassPage">
            <div className="MContainer">
                <div className="MCategory">
                    <div className="CategoryName">강의실 관리</div>
                </div>
                <div className="MItem">
                    <p className="MItemTitle">강의실 이름</p>
                    <p>{folderInfo.f_name}</p>
                </div>
                <div className="MItem">
                    <p className="MItemTitle">강의실 입장 코드</p>
                    <p>{folderInfo.f_id}</p>
                </div>
                <div className="MItem">
                    <button onClick={deleteClass}>강의실 삭제</button>
                </div>
            </div>
        </div>
    );
}

export { ManageClassPage }