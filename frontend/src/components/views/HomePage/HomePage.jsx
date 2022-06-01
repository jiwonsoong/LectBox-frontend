import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus, faArrowDownAZ, faArrowDown19, faTableList, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons'
import { ListView } from "../../utils/ListVIew";
import { IconView } from "../../utils/IconView/IconView";
import { useDispatch } from "react-redux";
import { folderActions } from "../../../_actions";
import { authHeader } from "../../../_helpers";

function HomePage() {
    const dispatch = useDispatch();
    const [view, setview] = useState('icon'); // icon, list
    const [sort, setsort] = useState('name'); // time, name
    const [isViewModal, setisViewModal] = useState(true);
    const [classCode, setclasscode] = useState('') 

    const u_id = localStorage.getItem('user');

    // 페이지 첫 렌더링 시 폴더 정보 요청
    useEffect(() => {
        // dispatch(folderActions.read({u_id}))
        // .then(response => {
        //     f_data = response.payload

        // })
    }, [])
    

    // 폴더 정보 받아오면 이름순, 생성순 각각 저장 

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
            // 요청
        } else {
            setsort('time')
            // 요청
        }
    }

    const viewModal = () => {
        setisViewModal(true)
    }
    const closeModal = () => {
        setisViewModal(false)
    }

    const handleResponse = (response) => {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.status === 200) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    
                    window.location.reload(true);
                }
    
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
    
            return data;
        });
    }

    // 강의실 입장 코드 입력
    const onClassCodeHandler = (event) => {
        setclasscode(event.currentTarget.value)
    }
    // 강의실 생성 함수
    const AddClass = () => {
        // 유효성 검사
        if (classCode === "") {
            return alert('강의실 코드를 입력해주세요.')
        }

        // 요청 보내기 
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };
        
        f_id = classCode;

        fetch('/users/{f_id}', requestOptions)
        .then(handleResponse)
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
                    <div className="CategoryPlusIcon" title='강의실 생성' onClick={viewModal}><FontAwesomeIcon icon={faFolderPlus} /></div>
                </div>
                
            </div>
            <div className="Views">
                {
                    view === 'icon'
                    ? (<ListView/>)
                    : (<IconView/>)
                }
            </div>
            {/* 강의실 생성 모달 */}
            {
                isViewModal === true
                && (
                    <div className="modal">
                        <div className="modal-item">
                            <div className="modal-content">
                                <p>강의실 입장</p>
                                <p style={{fontSize:'12px', marginTop: '0'}}>강의실에 입장하기 위해서는 강의실 코드를 입력해주세요.</p>
                                <input type="text" value={classCode} onChange={onClassCodeHandler} style={{margin:'10px 0'}}/>
                                <div className="modal-button">
                                    <button onClick={AddClass}>
                                        입장하기
                                    </button>
                                    <button onClick={closeModal} style={{backgroundColor:'white'}}>
                                        취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export { HomePage }