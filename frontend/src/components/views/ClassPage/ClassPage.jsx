import './ClassPage.css';
import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { faFolder, faFolderPlus, faArrowDownAZ, faArrowDown19, faTableList, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons'


function ClassPage(props) {
    const now = useSelector(rootReducer => rootReducer.folder);
    const [view, setview] = useState('icon'); // icon, list
    const [sort, setsort] = useState('name'); // time, name
    const { params } = props.match
    const [lectItems, setlectItems] = useState([]);
    const [assignItems, setassignItems] = useState([]);
    const [folderInfo, setfolderInfo] = useState({});
    const [isViewAddModal, setisViewAddModal] = useState(false);
    const [newFolderName, setnewFolderName] = useState('제목 없는 폴더')
    const [newParent, setnewParent] = useState('Lecture') // Lecture, Assignment

    // const user = JSON.parse(localStorage.getItem('user'));
    // const is_student = user.is_student;
    const is_student = false;

    useEffect(() => {
        // 강의실 정보 요청
        const url = 'api/folder/' + params.classid

        // dummy 데이터
//         {폴더id, name, made_by(fk .//유저id), max_볼륨, pres_볼륨, 종류(0(일반),1(강의실),2(과제),3(팀))
// ‘items’ : [[id, name, is_folder(boolen),],[],…..]}
        const response = {
            f_id: 12345,
            f_name: '클라우드컴퓨팅',
            made_by: '김재홍',
            max_vol: 50,
            pres_vol: 30

        }

        setfolderInfo(
            {
                f_id: response.f_id,
                f_name: response.f_name,
            }
        )

        setlectItems([
            [101, '1주차', true],
            [102, '2주차', true],
            [201, '강의계획서', false]
        ]);
        
        setassignItems([
            [301, '장고과제', true],
            [302, 'ec2과제', true],
            [401, '숙제1_홍길동', false]
        ])


    }, [])
    
    
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

    // 강의 - 폴더 추가 
    const addFolder = (e) => {
        console.log(newFolderName)
        console.log(newParent)

        if(newParent==='Lecture') {
            // 요청
            
        } else {
            // 요청
            
        }

        
    }
    const newParentIsLect = ()=>{
        setnewParent('Lecture')

    }
    const newParentIsAssign = ()=>{
        setnewParent('Assignment')
    }
    

    const onFolderNameHandler = (e) => {
        setnewFolderName(e.currentTarget.value)
    }

    const viewAddFolderModal = () => {
        setisViewAddModal(true)
    }
    const closeAddFolderModal = () => {
        setisViewAddModal(false)
    }

    return (
        <div>
            <div>
                {folderInfo.f_name}
            </div>
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
            {/* 강의란 */}
            <div>
                <div>강의</div>
                {/* 폴더 생성 버튼 */}
                <div onClick={newParentIsLect}>
                    {
                        is_student === false && (
                            <div className="CategoryPlusIcon" title='생성' onClick={viewAddFolderModal}><FontAwesomeIcon icon={faFolderPlus} /></div>
                        )
                    }
                </div>
                {/* 강의 폴더 내 보여주기 */}
                <div className="Views">
                {
                    view === 'icon'
                    ? (
                    <div className="ListView">
                        <div className="ListColDescription">
                            <div>이름</div>
                        </div>
                        {
                            lectItems.map(function(item){
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
                    : (
                    <ul className="IconList">
                    {
                        lectItems.map(item => (
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
                        ))
                    } 
                    </ul>)
                }
                </div>
            </div>
            {/* 과제란 */}
            <div>
                <div>
                    과제
                </div>
                {/* 폴더 생성 버튼 */}
                <div onClick={newParentIsAssign}>
                    {
                        is_student === false && (
                            <div className="CategoryPlusIcon" title='생성' onClick={viewAddFolderModal}><FontAwesomeIcon icon={faFolderPlus} /></div>
                        )
                    }
                </div>
                <div className="Views">
                {
                    view === 'icon'
                    ? (
                    <div className="ListView">
                        <div className="ListColDescription">
                            <div>이름</div>
                        </div>
                        {
                            assignItems.map(function(item){
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
                    : (
                    <ul className="IconList">
                    {
                        assignItems.map(item => (
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
                        ))
                    } 
                    </ul>)
                }
                </div>
            </div>
            {/* 폴더 생성 모달 */}
            {
                    isViewAddModal === true
                    && (
                        <div className="modal">
                            <div className="modal-item">
                                <div className="modal-content">
                                    <p>새 폴더</p>
                                    <input type="text" value={newFolderName} onChange={onFolderNameHandler} style={{margin:'10px 0'}}/>
                                    <div className="modal-button">
                                        <button onClick={addFolder}>
                                            생성하기
                                        </button>
                                        <button onClick={closeAddFolderModal} style={{backgroundColor:'white'}}>
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

export { ClassPage }