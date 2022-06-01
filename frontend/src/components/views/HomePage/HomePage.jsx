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
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';

function HomePage() {
    const dispatch = useDispatch();
    const [view, setview] = useState('icon'); // icon, list
    const [sort, setsort] = useState('name'); // time, name
    const [isViewModal, setisViewModal] = useState(false);

    const u_id = localStorage.getItem('user');

    const onFolderHandler = (item)=> {
        if (item[2] === true) {
            // 현재 폴더 변경
            
            // 페이지 리다이렉트

        } else {
            // 파일 미리보기 
        }
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
    const itemList = response.items

    // 페이지 첫 렌더링 시 폴더 정보 요청
    /*useEffect(() => {
        dispatch(folderActions.read({u_id}))
        .then(response => {
            f_data = response.payload

        })
    }, [])*/
    

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
    // 강의실 생성 함수
    const AddRoom = () => {

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
            <div className="modal">

            </div>
        </div>
    )
}

export { HomePage }