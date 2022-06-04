import './ClassPage.css';
import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { faGear, faFolder, faFolderPlus, faArrowDownAZ, faArrowDown19, faTableList, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons'
import { authHeader } from '../../../_helpers';


function ClassPage(props) {
    // 컴포넌트 State
    const [view, setview] = useState('icon'); // icon, list
    const [sort, setsort] = useState('name'); // time, name
    const { params } = props.match
    const [lectItems, setlectItems] = useState([]); // 강의 폴더의 하위 내용
    const [assignItems, setassignItems] = useState([]); // 과제 폴더의 하위 내용
    const [folderInfo, setfolderInfo] = useState({}); // 현재 폴더 정보
    const [isViewAddModal, setisViewAddModal] = useState(false); // 폴더 생성 모달 노출 여부
    const [newFolderName, setnewFolderName] = useState('') // 생성할 폴더 이름
    const [isLect, setisLect] = useState() // 생성할 폴더의 위치 (강의면 true, 과제면 false)
    // 필요한 유저 정보: is_student, id
    
    // dummy data
    const is_student = false;

    // 페이지 첫 렌더링 시 동작
    useEffect(() => {
        // dummy data 
        setfolderInfo({
            f_id: 12345,
            f_name: '클라우드 컴퓨팅',
            made_by: 'user2'
        });
        setlectItems([
            [101, '1주차', true, '김재홍'],
            [102, '2주차', true, '김재홍'],
            [201, '강의계획서', false, '김재홍']
        ]);
        setassignItems([
            [301, '장고과제', true, '김재홍'],
            [302, 'ec2과제', true, '김재홍'],
            [401, '숙제1_홍길동', false, '홍길동']
        ]);

        /** 
         * 백엔드랑 연동 시
         */ 

        // 강의 폴더 정보 요청
        // lectureRequest()
        // .then(
        //     data => {
        //         // 강의 폴더 정보
        //         setlectItems([data.items]);
        //         // 강의실 정보 
        //         setfolderInfo({
        //             f_id: data.id,
        //             f_name: data.name,
        //             made_by: data.made_by
        //         })
        //     }
        // )
        
        // // 과제 폴더 정보 요청
        // assignRequest()
        // .then(
        //     data => { 
        //         // 과제 폴더 정보
        //         assignItems([data.items]); 
        //     }
        // )
    }, [])

    /**
     * 요청
     */
    // 강의 폴더 정보 요청 함수
    const lectureRequest = () => {
        const url = 'api/folder/' + params.classid + '/1';

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
        };

        return (
            fetch(url, requestOptions)
            .then(handleResponse)
        )
    }
    // 과제 폴더 정보 요청 함수
    const assignRequest = () => {
        const url = 'api/folder/' + params.classid + '/2';

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
        };

        return (
            fetch(url, requestOptions)
            .then(handleResponse)
        )
    }
    // 폴더 생성 요청 함수
    const addFolderRequest = (parentType) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
            body: JSON.stringify({
                parent: folderInfo.f_id,
                name: newFolderName,
                type: parentType
            })
        };

        return (
            fetch('/api/folder', requestOptions)
            .then(handleResponse)
        )
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

    /**
     * 폴더 생성 기능
     */
    // 폴더 생성 함수
    const addFolder = (e) => {
        // 폼 유효성 검사
        if(newFolderName==='') {
            return alert('폴더명을 입력하세요.')
        } 
        
        // 강의 폴더 내에 생성
        if(isLect===true) {
            const parentType = 1;
            addFolderRequest(parentType)
            .then(
                data => {
                    setlectItems([data.items]);
                }
            )
        } 
        // 과제 폴더 내에 생성
        else {
            const parentType = 2;
            addFolderRequest(parentType)
            .then(
                data => {
                    setassignItems([data.items]);
                }
            )
        }
        alert('추가되었습니다.');
        closeAddFolderModal();
    }
    

    // 생성할 폴더의 부모 폴더 설정 함수
    const newParentIsLect = ()=>{
        setisLect(true);
    }
    const newParentIsAssign = ()=>{
        setisLect(false);
    }
    
    // 생성할 폴더 이름 설정 함수
    const onFolderNameHandler = (e) => {
        setnewFolderName(e.currentTarget.value);
    }

    // 폴더 생성 모달창 노출 설정 함수
    const viewAddFolderModal = () => {
        setisViewAddModal(true)
    }
    const closeAddFolderModal = () => {
        setisViewAddModal(false)
    }


    /**
     * 다른 페이지 이동 
     */
    // 폴더 열기 함수
    const onFolderHandler = (folder) => {
        const url = '/folder/' + folder[0];
        props.history.push(url);
    }
    // 강의실 관리 페이지 이동 함수 
    const linkToManagePage = () => {
        const url = '/class/' + folderInfo.f_id.toString() + '/manage';
        props.history.push(url);
    }


    return (
        <div className="ClassPage">
            <div className="CContainer">
                {/* 강의실 이름 */}
                <div className='CCategory'>
                    <div className='Category'>{folderInfo.f_name}</div>
                    {/* 강의실 관리 버튼 */}
                    {
                        is_student === false && (
                            <div className="CCIcon" onClick={linkToManagePage} title='강의실 관리'>
                                <FontAwesomeIcon icon={faGear} />
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
                <div className='CItem'>
                    <div className='ItemTitle'>
                        <div>강의</div>
                        {/* 폴더 생성 버튼 */}
                        <div onClick={newParentIsLect}>
                            {
                                is_student === false && (
                                    <div className="CategoryPlusIcon" title='생성' onClick={viewAddFolderModal}><FontAwesomeIcon icon={faFolderPlus} /></div>
                                )
                            }
                        </div>
                    </div>
                    
                    {/* 강의 폴더 내 보여주기 */}
                    <div className="Views">
                    {
                        view === 'icon'
                        ? (
                        <div className="ListView">
                            <div className="ListColDescription">
                                <div className='ListColLeft'>이름</div>
                                <div>소유자</div>
                            </div>
                            {
                                lectItems.map(function(item){
                                    return (
                                        <div className="ListItem"  key={item[0]} >
                                            <div className="ListIconBox">
                                                {
                                                    item[2] === true 
                                                    ? (<FontAwesomeIcon icon={faFolder} className="ListFolderIcon" />)
                                                    : (<FontAwesomeIcon icon={faFileLines} className="ListFileIcon"/>)
                                                }
                                            </div>
                                            <div className='ListNameBox'>
                                                {
                                                    item[2] === true
                                                    ? (<p onDoubleClick={()=>onFolderHandler(item)}>{item[1]}</p>)
                                                    : (<p>{item[1]}</p>)
                                                }
                                            </div>
                                            <div className='ListOwner'>
                                                <p>{item[3]}</p>
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
                <div className='CItem'>
                    <div className='ItemTitle'>
                        <div>과제</div>
                        {/* 폴더 생성 버튼 */}
                        <div onClick={newParentIsAssign}>
                            {
                                is_student === false && (
                                    <div className="CategoryPlusIcon" title='생성' onClick={viewAddFolderModal}><FontAwesomeIcon icon={faFolderPlus} /></div>
                                )
                            }
                        </div>
                    </div>
                    
                    <div className="Views">
                    {
                        view === 'icon'
                        ? (
                        <div className="ListView">
                            <div className="ListColDescription">
                                <div className='ListColLeft'>이름</div>
                                <div>소유자</div>
                            </div>
                            {
                                assignItems.map(function(item){
                                    return (
                                        <div className="ListItem"  key={item[0]} >
                                            <div className="ListIconBox">
                                                {
                                                    item[2] === true 
                                                    ? (<FontAwesomeIcon icon={faFolder} className="ListFolderIcon" />)
                                                    : (<FontAwesomeIcon icon={faFileLines} className="ListFileIcon"/>)
                                                }
                                            </div>
                                            <div className='ListNameBox'>
                                                {
                                                    item[2] === true
                                                    ? (<p onDoubleClick={()=>onFolderHandler(item)}>{item[1]}</p>)
                                                    : (<p>{item[1]}</p>)
                                                }
                                            </div>
                                            <div className='ListOwner'>
                                                <p>{item[3]}</p>
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
        </div>
    )
}

export { ClassPage }