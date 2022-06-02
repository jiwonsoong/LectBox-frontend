import './ClassPage.css';
import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { faFolder, faFolderPlus, faArrowDownAZ, faArrowDown19, faTableList, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons'
import { authHeader } from '../../../_helpers';


function ClassPage(props) {
    const now = useSelector(rootReducer => rootReducer.folder);
    const [view, setview] = useState('icon'); // icon, list
    const [sort, setsort] = useState('name'); // time, name
    const { params } = props.match
    const [lectItems, setlectItems] = useState([]);
    const [assignItems, setassignItems] = useState([]);
    const [folderInfo, setfolderInfo] = useState({});
    const [isViewAddModal, setisViewAddModal] = useState(false);
    const [newFolderName, setnewFolderName] = useState('')
    const [newParent, setnewParent] = useState('Lecture') // Lecture, Assignment

    // const user = JSON.parse(localStorage.getItem('user'));
    // const is_student = user.is_student;
    const is_student = false;

    useEffect(() => {
        const state = 'development';

        if(state==='development'){
            // dummy 데이터
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

        } 
        else {
            // 백엔드랑 연동 시

            // 강의 폴더 정보 요청
            const url_lect = 'api/folder/' + params.classid + '/1';
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader().Authorization
                },
            };
            fetch(url_lect, requestOptions)
            .then(
                (response) => {
                    handleResponse(response)
                    .then(
                        data => {
                            setlectItems([data.items]);
                            setfolderInfo(
                                {
                                    f_id: data.id,
                                    f_name: data.name
                                }
                            )
                        },
                        error => alert("에러입니다.")
                    )
                }
            )
            
            // 과제 폴더 정보 요청
            const url_assign = 'api/folder/' + params.classid + '/2';

        }


    }, [])
    
    const handleResponse = (response) => {
        if (!response.status === 200) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return response;
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

    // 강의 - 폴더 추가 
    const addFolder = (e) => {
        console.log(newFolderName)
        console.log(newParent)
        if(newFolderName==='') {
            return alert('폴더명을 입력하세요.')
        } 
        else {
            if(newParent==='Lecture') {
                // 강의 내에 폴더 생성
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authHeader().Authorization
                    },
                    body: JSON.stringify({
                        parent: folderInfo.f_id,
                        name: newFolderName,
                        type: 1
                    })
                };

                addFolderRequest(requestOptions, 1)
    
            } else {
                // 과제 내에 폴더 생성
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authHeader().Authorization
                    },
                    body: JSON.stringify({
                        parent: folderInfo.f_id,
                        name: newFolderName,
                        type: 2
                    })
                };

                addFolderRequest(requestOptions, 2)
    
            }
        }
    }
    const addFolderRequest = (requestOptions, parent) => {
        fetch('/api/folder', requestOptions)
        .then((response) => {
            handleResponse(response)
            .then(
                data => {
                    if (parent === 1) {
                        setlectItems([data.items])
                    } else {
                        setassignItems([data.items])
                    }
                    alert('추가되었습니다.');
                    closeAddFolderModal();
                },
                error => {
                    alert("에러입니다.");
                    closeAddFolderModal();
                }
            )
        })
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


    // 폴더 입장
    const onFolderHandler = (item) => {
        const url = '/folder/' + item[0];
        props.history.push(url);
    }

    const linkToManagePage = () => {
        const url = '/class/' + folderInfo.f_id.toString() + '/manage';
        console.log(1)
        console.log(url)
        props.history.push(url);
        console.log(2)

    }

    return (
        <div>
            {/* 강의실 이름 */}
            <div>
                {folderInfo.f_name}
            </div>
            {/* 강의실 관리 버튼 */}
            <div>
                {
                    is_student === false && (
                        <div>
                            <button onClick={linkToManagePage}>강의실 관리</button>
                        </div>
                    )
                }
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
                                    <div className="ListItem"  key={item[0]} >
                                        <div className="ListIconBox">
                                        {
                                            item[2] === true 
                                            ? (
                                            <div onDoubleClick={()=>onFolderHandler(item)}>
                                                <FontAwesomeIcon icon={faFolder} className="ListFolderIcon" />
                                                <div className="ListNameBox">
                                                    <p>{item[1]}</p>
                                                </div>
                                            </div>
                                            )
                                            : (
                                            <div>
                                                <FontAwesomeIcon icon={faFileLines} className="ListFileIcon"/>
                                                <div className="ListNameBox">
                                                    <p>{item[1]}</p>
                                                </div>
                                            </div>
                                            )
                                        }
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
                            <li key={item[0]}> 
                                <div className="Iconbox">
                                        {
                                            item[2] === true 
                                            ? (
                                            <div onDoubleClick={()=>onFolderHandler(item)}>
                                                <FontAwesomeIcon icon={faFolder} className="FolderIcon"/>
                                                <div className="ListNameBox">
                                                    <p>{item[1]}</p>
                                                </div>   
                                            </div>
                                            )
                                            : (
                                            <div>
                                                <FontAwesomeIcon icon={faFileLines} className="FileIcon"/>
                                                <div className="ListNameBox">
                                                    <p>{item[1]}</p>
                                                </div> 
                                            </div>
                                            )
                                        }
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
                                    <div className="ListItem"  key={item[0]} >
                                        <div className="ListIconBox">
                                        {
                                            item[2] === true 
                                            ? (
                                            <div onDoubleClick={()=>onFolderHandler(item)}>
                                                <FontAwesomeIcon icon={faFolder} className="ListFolderIcon"/>
                                                <div className="ListNameBox">
                                                    <p>{item[1]}</p>
                                                </div>
                                            </div>
                                            )
                                            : (
                                            <div>
                                                <FontAwesomeIcon icon={faFileLines} className="ListFileIcon"/>
                                                <div className="ListNameBox">
                                                    <p>{item[1]}</p>
                                                </div>
                                            </div>
                                            )
                                        }
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
                            <li key={item[0]}> 
                                <div className="Iconbox">
                                        {
                                            item[2] === true 
                                            ? (
                                            <div onDoubleClick={()=>onFolderHandler(item)}>
                                                <FontAwesomeIcon icon={faFolder} className="FolderIcon"/>
                                                <div className="ListNameBox">
                                                    <p>{item[1]}</p>
                                                </div>    
                                            </div>
                                            )
                                            : (
                                            <div>
                                                <FontAwesomeIcon icon={faFileLines} className="FileIcon"/>
                                                <div className="ListNameBox">
                                                    <p>{item[1]}</p>
                                                </div>  
                                            </div>
                                            )
                                        }
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