import './ClassPage.css';
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { faGear, faFolder, faFolderPlus, faArrowDownAZ, faArrowDown19, faTableList, faTableCellsLarge, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { authHeader } from '../../../_helpers';
import { folder } from '../../../_reducers/folder.reducer';


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
    const [viewbutton, setviewbutton] =useState(false); // 폴더 수정 삭제 이동 버튼 노출 여부
    const [Lectviewbutton, setLectviewbutton] =useState(false); // 폴더 수정 삭제 이동 버튼 노출 여부
    const [newFile, setnewFile] = useState() // 업로드할 파일
    // 필요한 유저 정보: is_student, id
    
    // dummy data
    const is_student = false;

    const item_id = "101";

    // 페이지 첫 렌더링 시 동작
    useEffect(() => {
        // dummy data 
        setfolderInfo({
            parent: 0,
            id: 12345,
            made_by: 'user2',
            name: '클라우드 컴퓨팅',
            max_volume: 0,
            pres_volume: 0,
            type: 0,
            lectureId: '',
            assignId: ''
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
        // setPage();
        
    }, [])

    // 강의실 정보, 강의 폴더 정보, 과제 폴더 정보 reset 함수
    const setPage = ()=>{
        // 강의실 정보 요청
        folderInfoRequest()
        .then(
            data=>{
                setfolderInfo({
                    parent: data.parent,
                    id: data.id,
                    made_by: data.made_by,
                    name: data.name,
                    max_volume: data.max_volume,
                    pres_volume: data.pres_volume,
                    type: data.type,
                    lectureId: data.items[0][3],
                    assignId: data.item[1][3]
                });
            }
        )
        .then(
            ()=>{
                // 강의 폴더 정보 요청
                lectureRequest()
                .then(
                    data => {
                        setlectItems([data.items]);
                    }
                )
                // 과제 폴더 정보 요청
                assignRequest()
                .then(
                    data => { 
                        // 과제 폴더 정보
                        assignItems([data.items]); 
                    }
                )
            }
        )
    }

    /**
     * 요청
     */
    // 강의실 정보 요청 함수 
    const folderInfoRequest = ()=>{
        const url = 'api/folder/' + params.classid;

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            }
        };

        return (
            fetch(url, requestOptions)
            .then(handleResponse)
        )
    }
    // 강의 폴더 정보 요청 함수
    const lectureRequest = () => {
        const url = 'api/folder/' + folderInfo.lectureId ;

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
        const url = 'api/folder/' + folderInfo.assignId;

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
    const addFolderRequest = () => {
        let parentId = '';
        let parentType = '';

        if (isLect === true) {
            parentId = folderInfo.lectureid;
            parentType = 1;
        } else {
            parentId = folderInfo.assignId;
            parentType = 2;
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
            body: JSON.stringify({
                parent: parentId,
                name: newFolderName,
                type: parentType
            })
        };

        return (
            fetch('/api/folder', requestOptions)
            .then(handleResponse)
        )
    }
    const deleteFolder = () => {
        if (item_id === lectItems) { //(수정 필요)
            deleteFolderRequest()
            .then(
                ()=>{
                    alert('폴더가 삭제되었습니다.');
                }
            )
        } else {
            alert('삭제 권한이 없습니다.')
        }
    }
    // 폴더 삭제 요청 함수
    const deleteFolderRequest = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            }
        };
        const url = '/api/forder' //+ folderInfo.f_id (수정 필요)

        return (
            fetch(url,requestOptions)
            .then(handleResponse)
        )
    }
    // 폴더 정보 수정 요청 함수
    const EditFolderRequest = (parentType) => {
        const requestOptions = {
            method: 'PUT',
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

        return(
        fetch(url,requestOptions)
        .then(handleResponse)
        )
    }
    // 파일 업로드 요청 함수
    const addFileRequest = (formData)=>{
        let parentId = '';

        if (isLect === true) {
            parentId = folderInfo.lectureid;
        } else {
            parentId = folderInfo.assignId;
        }

        const url = '/api/folder/' + parentId.toString() + '/file/';

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
            body: JSON.stringify({
                parent: parentId,
                FILES: formData,
                is_protected: false
            })
        };

        return (
            fetch(url, requestOptions)
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

    // 파일 다운로드 기능
    /*const FileDownload = () => {
        FileDownloadRequest()
        .then(response) => {
            const blob = new Blob([response.data]);
        }

    }*/

    // 파일 다운로드 요청 함수
    const FileDownloadRequest = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            }
        };

        const url = 'api/folder' + folderInfo.f_id + '/file' + faCircleInfo.file_id + '/downloads'

        return (
            fetch(url,requestOptions)
            .then(handleResponse)
        )
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
        
        addFolderRequest()
        .then(
            () => {
                setPage();
                alert('추가되었습니다.');
                closeAddFolderModal();
            }
        )
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
     * 파일 업로드 기능
     */
    // input type="file" 태그 클릭 위함
    const selectFile = useRef();
    // 업로드할 파일 입력 함수
    const onFileHandler = (event)=>{
        setnewFile(event.target.files[0]);
        onFileSubmitHandler();
    }
    // 파일 업로드 함수
    const onFileSubmitHandler = ()=> {
        // event.preventDefault();

        const formData = new FormData();
        formData.append('file', newFile);

        addFileRequest(formData)
        .then(
            data => { 
                setPage();
                alert('업로드되었습니다.');
            },
            error=>{
                alert('업로드에 실패하였습니다.')
            }
        )

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
        const url = '/class/' + folderInfo.id.toString() + '/manage';
        props.history.push(url);
    }


    return (
        <div className="ClassPage">
            <div className="CContainer">
                {/* 강의실 이름 */}
                <div className='CCategory'>
                    <div className='Category'>{folderInfo.name}</div>
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
                        <div className='PlusContainer'>
                            {/* 폴더 생성 버튼 */}
                            <div onClick={newParentIsLect}>
                                {
                                    is_student === false && (
                                        <div className="CategoryPlusIcon" title='폴더 생성' onClick={viewAddFolderModal}><FontAwesomeIcon icon={faFolderPlus} /></div>
                                    )
                                }
                            </div>
                            {/* 파일 업로드 버튼 */}
                            <div onClick={newParentIsLect}>
                                <form onSubmit={onFileSubmitHandler}>
                                    <div className="CategoryPlusIcon" title='파일 업로드' onClick={()=>{selectFile.current.click()}}>
                                        <FontAwesomeIcon icon={faFileCirclePlus} />
                                        <input type='file' ref={selectFile} onChange={onFileHandler}></input>
                                    </div>
                                </form>
                            </div>
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
                                                    ? (<p onClick={()=>setLectviewbutton(!Lectviewbutton)} onDoubleClick={()=>onFolderHandler(item)}>{item[1]}</p>)
                                                    : (<p onClick={()=>setLectviewbutton(!Lectviewbutton)} onDoubleClick={()=>FileDownload(item)} >{item[1]}</p>)
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
                                                <div onClick={()=>setLectviewbutton(!Lectviewbutton)} onDoubleClick={()=>onFolderHandler(item)}>
                                                    <FontAwesomeIcon icon={faFolder} className="FolderIcon"/>
                                                    <div className="ListNameBox">
                                                        <p>{item[1]}</p>
                                                    </div>   
                                                </div>
                                                )
                                                : (
                                                <div onClick={()=>setLectviewbutton(!Lectviewbutton)} onDoubleClick={()=>FileDownload(item)}>
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
                    {
                    Lectviewbutton === true && (
                        <div className='EditfolderButton'>
                            <button onClick={deleteFolder}>삭제</button>
                            <button>수정</button>
                            <button>이동</button>
                        </div>
                    ) 
                    }
                    </div>
                </div>
                {/* 과제란 */}
                <div className='CItem'>
                    <div className='ItemTitle'>
                        <div>과제</div>
                        <div className='PlusContainer'>
                            {/* 폴더 생성 버튼 */}
                            <div onClick={newParentIsAssign}>
                                {
                                    is_student === false && (
                                        <div className="CategoryPlusIcon" title='생성' onClick={viewAddFolderModal}><FontAwesomeIcon icon={faFolderPlus} /></div>
                                    )
                                }
                            </div>
                            {/* 파일 업로드 버튼 */}
                            <div onClick={newParentIsAssign}>
                                <form onSubmit={onFileSubmitHandler}>
                                    <div className="CategoryPlusIcon" title='파일 업로드' onClick={()=>{selectFile.current.click()}}>
                                        <FontAwesomeIcon icon={faFileCirclePlus} />
                                        <input type='file' ref={selectFile} onChange={onFileHandler}></input>
                                    </div>
                                </form>
                            </div>
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
                                                    ? (<p onClick={()=>setviewbutton(!viewbutton)} onDoubleClick={()=>onFolderHandler(item)}>{item[1]}</p>)
                                                    : (<p onClick={()=>setviewbutton(!viewbutton)} onDoubleClick={()=>FileDownload(item)}>{item[1]}</p>)
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
                                                <div onClick={()=>setviewbutton(!viewbutton)} onDoubleClick={()=>onFolderHandler(item)}>
                                                    <FontAwesomeIcon icon={faFolder} className="FolderIcon"/>
                                                    <div className="ListNameBox">
                                                        <p>{item[1]}</p>
                                                    </div>    
                                                </div>
                                                )
                                                : (
                                                <div onClick={()=>setviewbutton(!viewbutton)} onDoubleClick={()=>FileDownload(item)}>
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
                    {
                    viewbutton === true  &&(
                        <div className='EditfolderButton'>
                            <button onClick={deleteFolder}>삭제</button>
                            <button>수정</button>
                            <button>이동</button>
                        </div>
                    ) 
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