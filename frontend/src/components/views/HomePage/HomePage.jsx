import axios from "axios";
import React, { useEffect, useState } from "react";
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { faFolder, faFolderPlus, faArrowDownAZ, faArrowDown19, faTableList, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from "react-redux";
import { folderActions } from "../../../_actions";
import {authHeader} from '../../../_helpers';

function HomePage(props) {
    const dispatch = useDispatch();
    const [view, setview] = useState('icon'); // icon, list
    const [sort, setsort] = useState('name'); // time, name
    const [isViewModal, setisViewModal] = useState(false);
    const [classCode, setclasscode] = useState(''); 
    //const [itemList, setitemList] = useState([]);

    const u_id = localStorage.getItem('user');

    const onFolderHandler = (item)=> {
        // 이동할 폴더 저장 (redux 사용 시)
        // dispatch(folderActions.change(item[0], item[1]))
        // 페이지 리다이렉트
        const url = '/class/' + item[0]
        props.history.push(url);
    }


    // 폴더 정보 요청 응답 예시
    const response = {
        folderId: '123',
        folderName: 'user123',
        made_by: 'user123',
        max_volume: 100,
        pres_volume: 20,
        kinds: 0,
        items: [['folder1','캡스톤디자인', true], ['folder2','클라우드컴퓨팅',true]]
    }
    let itemList = response.items
    
    const now = useSelector(rootReducer => rootReducer.folder);

    // 페이지 첫 렌더링 시 폴더 정보 요청
    useEffect(() => {
        /*const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        fetch('/class', requestOptions)
        .then(handleResponse)*/
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
        if (!response.status === 200) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        setitemList([response.items])
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
        file_id = classCode;
        // 요청 보내기 
        const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify({file_id})
        };

        fetch('/class', requestOptions)
        .then(handleResponse)
        .then(data => console.log(data)
        .then(alert("입장되었습니다."))
        .then(closeModal())
         
        );

        setisViewModal(false)
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
                                <div className="ListItem" onDoubleClick={()=>onFolderHandler(item)} key={item[0]} >
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
                        <li onDoubleClick={()=>onFolderHandler(item)} key={item[0]}> 
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