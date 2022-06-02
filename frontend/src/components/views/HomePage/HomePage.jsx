import axios from "axios";
import React, { useEffect, useState } from "react";
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { faFolder, faFolderPlus, faArrowDownAZ, faArrowDown19, faTableList, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from "react-redux";
import { folderActions } from "../../../_actions";
import { authHeader } from "../../../_helpers";

function HomePage(props) {
    // 컴포넌트 State
    const [view, setview] = useState('icon'); // 보기 방식 - icon, list
    const [sort, setsort] = useState('name'); // 정렬 방식 - time, name
    const [isViewModal, setisViewModal] = useState(false); // 강의실 추가 모달창 노출 여부
    const [classCode, setclasscode] = useState(''); // 강의실 추가 코드
    //const [itemList, setitemList] = useState([]); // 강의실 목록 
    // 필요한 유저 정보: is_student (localStorage에서 가져오기)

    // dummy data
    const itemList = [['folder1','캡스톤디자인', true], ['folder2','클라우드컴퓨팅',true]]
    // const u_id = localStorage.getItem('user');
    const is_student = false;

    // 페이지 첫 렌더링 시 동작
    useEffect(() => {
        // 폴더 정보 요청하여 강의실 리스트 생성
        // folderRequest()
        // .then(
        //     data => {
        //         setitemList([data.items]);
        //     }
        // )
        
    }, [])

    /**
     * 요청
     */
    // 폴더 정보 요청 함수
    const folderRequest = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
        };

        return (
            fetch('api/class', requestOptions)
            .then(handleResponse)
        )
    };

    // 강의실 입장 요청 함수
    const registerClassRequest = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
            body: JSON.stringify({ classCode })
        };

        return (
            fetch('api/class', requestOptions)
            .then(handleResponse)
        )
    }

    // 강의실 생성 요청 함수 
    const addClassRequest = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
            body: JSON.stringify({
                parent: 0,
                name: classCode,
                type: 0
            })
        };

        return (
            fetch('/api/folder', requestOptions)
            .then(handleResponse)
        )
    }

    const handleResponse = (response) => {
        if (!response.status === 200) {
            if (response.status === 400 || response.status === 401 || response.status === 404) {
                window.location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return response;
    }

    // 강의실 이동 함수
    const openFolder = (item)=> {
        // 페이지 리다이렉트
        const url = '/class/' + item[0]
        props.history.push(url);
    }

    // 파일 보기 방식 변경 함수
    const onViewHandler = (e)=>{
        if (view==='icon'){
            setview('list')
        } else {
            setview('icon')
        }
    }

    // 파일 정렬 방식 변경 함수
    const onSortHandler = (e) => {
        if (sort==='time') {
            setsort('name')
            // 
        } else {
            setsort('time')
            // 
        }
    }

    /**
     * 강의실 추가 기능
     */
    // 모달창 여는 함수
    const viewModal = () => {
        setisViewModal(true)
    }
    // 모달창 닫는 함수
    const closeModal = () => {
        setisViewModal(false)
    }
    // 강의실 추가 코드 변경 함수
    const onClassCodeHandler = (event) => {
        setclasscode(event.currentTarget.value)
    }

    // 강의실 추가 함수
    const addClass = () => {
        // 수강자 권한일 경우 
        if (is_student === true) {
            // 폼 유효성 검사
            if (classCode === "") {
                return alert('강의실 코드를 입력해주세요.')
            }
            // 강의실 입장
            registerClassRequest()
            .then(
                data => {
                    setitemList([data.items])
                    closeModal()
                    alert("입장되었습니다.")
                }
            )
        }
        // 강의자 권한일 경우
        else {
            // 폼 유효성 검사
            if (classCode === "") {
                return alert('강의실 이름을 입력해주세요.')
            }
            // 강의실 생성
            addClassRequest()
            .then(
                data => {
                    setitemList([data.items])
                    closeModal()
                    alert("생성되었습니다.")
                }
            )
        }   
    }
    

    return (
        <div className="HomePage">
            <div className="SetViewContainer">
                <div className='SetView'>
                    <div onClick={onViewHandler} className='SetViewElement'>
                        {
                            view === 'icon'
                            ? (<div title="아이콘 보기"><FontAwesomeIcon icon={faTableCellsLarge} /></div>)
                            : (<div title="리스트 보기"><FontAwesomeIcon icon={faTableList} /></div>)
                        }
                    </div>
                    <div onClick={onSortHandler} className='SetViewElement'>
                        {
                            sort === 'time'
                            ? (<div title="최신순"><FontAwesomeIcon icon={faArrowDown19} /></div>)
                            : (<div title="이름순"><FontAwesomeIcon icon={faArrowDownAZ} /></div>)
                        }
                    </div>
                </div>
            </div>
            <div className="CategoryContainer">
                <div className="Category">
                    <div className="CategoryName">강의실</div>
                    {/* 강의실 추가 버튼 */}
                    <div className="CategoryPlusIcon" title='강의실 추가' onClick={viewModal}><FontAwesomeIcon icon={faFolderPlus} /></div>
                </div>
                
            </div>
            <div className="Views">
                {
                    view === 'icon'
                    ? (<div className="ListView">
                    <div className="ListColDescription">
                        <div>강의실 이름</div>
                    </div>
                    {
                        itemList.map(function(item){
                            return (
                                <div className="ListItem" onDoubleClick={()=>openFolder(item)} key={item[0]} >
                                    <div className="ListIconBox">
                                    {
                                        item[2] === true 
                                        ? (<FontAwesomeIcon icon={faFolder} className="ListFolderIcon"/>)
                                        : (<FontAwesomeIcon icon={faFileLines} className="ListFileIcon"/>)
                                    }
                                    </div>
                                    <div className="ListNameBox">
                                        <p>{item[1]}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>)
                    : (<ul className="IconList">
                    {itemList.map(item => (
                        <li onDoubleClick={()=>openFolder(item)} key={item[0]}> 
                            <div className="Iconbox">
                                    {
                                        item[2] === true 
                                        ? (<FontAwesomeIcon icon={faFolder} className="FolderIcon"/>)
                                        : (<FontAwesomeIcon icon={faFileLines} className="FileIcon"/>)
                                    }
                            </div>
                            <div className="ListNameBox">
                                <p>{item[1]}</p>
                            </div>                     
                        </li>
                    ))} 
                </ul>)
                }
            </div>
            {/* 강의실 추가 모달 */}
            {
                isViewModal === true
                && (
                    <div className="modal">
                        <div className="modal-item">
                            {
                                is_student === true
                                ? (
                                    <div className="modal-content">
                                        <p>강의실 입장</p>
                                        <p style={{fontSize:'12px', marginTop: '0'}}>강의실에 입장하기 위해서는 강의실 코드를 입력해주세요.</p>
                                        <input type="text" value={classCode} onChange={onClassCodeHandler} style={{margin:'10px 0'}}/>
                                        <div className="modal-button">
                                            <button onClick={addClass}>
                                                입장하기
                                            </button>
                                            <button onClick={closeModal} style={{backgroundColor:'white'}}>
                                                취소
                                            </button>
                                        </div>
                                    </div>
                                )
                                : (
                                    <div className="modal-content">
                                        <p>강의실 생성</p>
                                        <p style={{fontSize:'12px', marginTop: '0'}}>생성할 강의실 이름을 입력해주세요.</p>
                                        <input type="text" value={classCode} onChange={onClassCodeHandler} style={{margin:'10px 0'}}/>
                                        <div className="modal-button">
                                            <button onClick={addClass}>
                                                생성하기
                                            </button>
                                            <button onClick={closeModal} style={{backgroundColor:'white'}}>
                                                취소
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export { HomePage }