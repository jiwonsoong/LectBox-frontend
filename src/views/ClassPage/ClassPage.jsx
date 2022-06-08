import './ClassPage.css';
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { faTrashCan, faGear, faFolder, faFolderPlus, faArrowDownAZ, faArrowDown19, faTableList, faTableCellsLarge, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { authHeader } from '../../_helpers';
import axios from 'axios';


function ClassPage(props) {
    // 컴포넌트 State
    const [view, setview] = useState('list'); // icon, list
    const [sort, setsort] = useState('name'); // time, name
    // const { params } = props.match
    const [lectItems, setlectItems] = useState([]); // 강의 폴더의 하위 내용
    const [assignItems, setassignItems] = useState([]); // 과제 폴더의 하위 내용
    const [folderInfo, setfolderInfo] = useState({}); // 현재 폴더 정보
    const [isViewAddModal, setisViewAddModal] = useState(false); // 폴더 생성 모달 노출 여부
    const [newFolderName, setnewFolderName] = useState('') // 생성할 폴더 이름
    const [isLect, setisLect] = useState() // 생성할 폴더의 위치 (강의면 true, 과제면 false)
    const [viewbutton, setviewbutton] =useState(false); // 폴더 수정 삭제 이동 버튼 노출 여부
    const [Lectviewbutton, setLectviewbutton] =useState(false); // 폴더 수정 삭제 이동 버튼 노출 여부
    const [newFile, setnewFile] = useState({}); // 업로드할 파일
    const [selectedItem, setselectedItem] = useState({id:'', is_folder: '', made_by:''}); // 선택된(삭제, 수정, 이동) 폴더 또는 파일 아이디
    const [user, setuser] = useState({}); // 유저 정보
    const baseurl = 'http://3.231.84.43:8000';
    const path = JSON.parse(localStorage.getItem('path'));


    // 페이지 첫 렌더링 시 동작
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user){
            setuser({
                id: user.id,
                is_student: user.is_student
            })
            setFolder();
        } else {
            return ;
        }

        return ()=>{
            // localStorage.removieItem('path');
        }
    }, [])

    

    // 폴더 정보 받아온 후 동작
    useEffect(()=>{
        if (!isEmptyObj(folderInfo)) {
            setItems();
            colorBar();
        }
    }, [folderInfo])

    //파일 객체 설정후 동작
    useEffect(()=>{
        if(!isEmptyObj(newFile)){
            onFileSubmitHandler()
        }
    },[newFile])

    // 빈 객체 확인 함수
    const isEmptyObj = (obj) => {
        if(obj.constructor === Object
           && Object.keys(obj).length === 0)  {
          return true;
        }
        
        return false;
    }
    // 강의실 정보, 강의 폴더 정보, 과제 폴더 정보 reset 함수
    const setFolder = ()=>{
        // 강의실 정보 요청
        folderInfoRequest()
        .then(
            data=>{
                console.log(data);
                setfolderInfo({
                    id: data.id,
                    made_by: data.made_by,
                    name: data.name,
                    max_volume: data.max_volume,
                    pres_volume: data.volume,
                    type: data.type,
                    lectureId: data.items[0].child,
                    assignId: data.items[1].child
                });
            }
        )
    }
    // 강의, 과제 폴더 아이템 요청 함수
    const setItems = ()=>{
        // 강의 폴더 정보 요청
        lectureRequest()
        .then(
            data => {
                if (data.items) {
                    console.log(data)
                    setlectItems(data.items);
                }
            }
        )
        // 과제 폴더 정보 요청
        assignRequest()
        .then(
            data => { 
                // 과제 폴더 정보
                if (data.items) {
                    setassignItems(data.items);
                }
            }
        )
    }
    // 용량 표시 위한 css 조작 함수
    const colorBar = ()=>{
        const fill = folderInfo.pres_volume / folderInfo.max_volume * 100;
        document.getElementById('barfill').style.width = fill.toString() + '%';
    }

    /**
     * 요청
     */
    const handleResponse = (response) => {
        return response.text().then(json => {
            const data = json && JSON.parse(json);
            if (response.status !== 200) {
                if (response.status === 401) {
                    window.location.reload(true);
                }
    
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            
            return data;
        });
    }
    // 강의실 정보 요청 함수 
    const folderInfoRequest = ()=>{
        const url = baseurl + '/api/folder/' + path.pro;

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
        const url = baseurl + '/api/folder/' + folderInfo.lectureId.toString() ;

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
        const url = baseurl + '/api/folder/' + folderInfo.assignId.toString();

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
            parentId = folderInfo.lectureId;
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
            fetch(baseurl + '/api/folder/', requestOptions)
            .then(handleResponse)
        )
    }
    // 폴더 삭제 요청 함수
    const deleteFolderRequest = () => {
        const url = baseurl + '/api/folder' + selectedItem.id.toString();

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            }
        };

        return (
            fetch(url,requestOptions)
            .then(handleResponse)
        )
    }
    // 파일 삭제 요청 함수
    const deleteFileRequest = ()=>{
        let parentId = '';

        // 강의 폴더에서 삭제하는 경우
        if (Lectviewbutton === true) {
            parentId = folderInfo.lectureId;
        } 
        // 과제 폴더에서 삭제하는 경우
        else {
            parentId = folderInfo.assignId;
        }

        const url = baseurl + '/api/folder/' + parentId.toString() + '/file/' + selectedItem.id.toString() + '/delete/';
        
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            }
        };

        return (
            fetch(url,requestOptions)
            .then(handleResponse)
        )
    }
    // 폴더 정보 수정 요청 함수
    const EditFolderRequest = () => {
        const url = baseurl + '/api/folder/' + folderInfo.id.toString();

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            }
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
            parentId = folderInfo.lectureId.toString();
        } else {
            parentId = folderInfo.assignId.toString();
        }

        const url = baseurl + '/api/folder/' + parentId + '/file/';

        formData.append('data', new Blob([JSON.stringify({is_protected: true})] , {type: "application/json"}));

        const requestOptions = {
            method: 'POST',
            headers: {
                //'Content-Type': 'multipart/form-data',
                'Authorization': authHeader().Authorization
            },
            body: formData
        };
        
        return (
            fetch(url, requestOptions)
            .then(handleResponse)
        )
    }
    // 파일 다운로드 요청 함수
    const FileDownloadRequest = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            }
        };

        const url = baseurl + '/api/folder/' + path.pro.toString() + '/file/' + selectedItem.id.toString() + '/downloads';

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
                setFolder();
                closeAddFolderModal();
                alert('추가되었습니다.');
            },
            ()=>alert('폴더를 추가할 수 없습니다.')
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
    }
    // 파일 업로드 함수
    const onFileSubmitHandler = ()=> {
        // event.preventDefault();

        const formData = new FormData();
        formData.append('file', newFile);

        // console.log(formData);

        addFileRequest(formData)
        .then(
            data => { 
                setFolder();
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
    const onFolderHandler = (folderId) => {
        const url = '/folder';
        localStorage.setItem('path', JSON.stringify({pro: folderId, class: path.class, className: path.className}));
        props.history.push(url);
    }
    // 강의실 관리 페이지 이동 함수 
    const linkToManagePage = () => {
        const url = '/class/manage';
        props.history.push(url);
    }


    /**
     * 삭제 기능
     */
    // 폴더, 파일 삭제 함수
    const deleteItem = () => {
        // 폴더 삭제
        
        if (true) { 
            console.log(folderInfo.lectureId);
            deleteFileRequest()
            .then(
                ()=>{
                    alert('파일이 삭제되었습니다.');
                    setFolder();
                },
                ()=>{
                    alert('폴더를 삭제할 수 없습니다.');
                }
            )
        } else {
            alert('삭제 권한이 없습니다.')
        }
        /*
        if (selectedItem.is_folder === true) {
        
            if (user.id === selectedItem.made_by) { 
                deleteFolderRequest()
                .then(
                    ()=>{
                        alert('폴더가 삭제되었습니다.');
                        setFolder();
                    }
                )
            } else {
                alert('삭제 권한이 없습니다.')
            }
        }
        // 파일 삭제
        else {
            if (user.id === selectedItem.made_by) { 
                deleteFileRequest()
                .then(
                    ()=>{
                        alert('파일이 삭제되었습니다.');
                        setFolder();
                    }
                )
            } else {
                alert('삭제 권한이 없습니다.')
            }
        }*/
    }
    // 아이템 선택 함수 
    const clickEvent = (item, type) =>{
        // 강의에서 선택됨
        if (type === 1) {
            // 선택된게 한 번 더 선택 => 선택 취소 
            if (selectedItem.id === item.id) {
                setLectviewbutton(false); // 삭제 버튼 안 보이게
                setselectedItem({id: '', made_by: ''});
                document.getElementById(item.id).style.backgroundColor = 'white';
            } 
            // 신규 선택 => 선택
            else {
                // 기존에 선택된 게 있는 경우
                if (selectedItem.id !== ''){
                    setLectviewbutton(true); 
                    setviewbutton(false);
                    document.getElementById(selectedItem.id).style.backgroundColor = 'white';
                    setselectedItem({id: item.id, made_by: item.made_by});
                    document.getElementById(item.id).style.backgroundColor = '#efefef';
                    console.log("sected");
                } 
                // 기존에 선택된 게 없는 경우 
                else {
                    setLectviewbutton(true);
                    setselectedItem({id: item.id, made_by: item.made_by});
                    document.getElementById(item.id).style.backgroundColor = '#efefef';
                }
            }
        } 
        // 과제에서 선택됨
        else {
            // 선택된게 한 번 더 선택 => 선택 취소 
            if (selectedItem.id === item.id) {
                setviewbutton(false); // 삭제 버튼 안 보이게
                setselectedItem({id: '', made_by: ''});
                document.getElementById(item.id).style.backgroundColor = 'white';
            } 
            // 신규 선택 => 선택
            else {
                // 기존에 선택된 게 있는 경우
                if (selectedItem.id !== ''){
                    setviewbutton(true); 
                    setLectviewbutton(false);
                    document.getElementById(selectedItem.id).style.backgroundColor = 'white';
                    setselectedItem({id: item.id, made_by: item.made_by});
                    document.getElementById(item.id).style.backgroundColor = '#efefef';
                } 
                // 기존에 선택된 게 없는 경우 
                else {
                    setviewbutton(true);
                    setselectedItem({id: item.id, made_by: item.made_by});
                    document.getElementById(item.id).style.backgroundColor = '#efefef';
                }
            }
        }
    }
    
    /**
     * 파일 다운로드 기능
     */
    // 파일 다운로드 함수
    const FileDownload = () => {
        console.log("double clock");
        FileDownloadRequest()
        .then(response => {
            /*const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
      
            const filename = response.headers['content-disposition']
            .split('filename=')[1]
            .split(';')[0];
      
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);*/
            console.log(response);
        }).catch(e => {
            console.log(e);
        });
    }

    /*const FileDownload = (response) => {
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
      
        const filename = response.headers['content-disposition']
          .split('filename=')[1]
          .split(';')[0];
      
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      };*/

    


    return (
        <div className="ClassPage" >
            <div className="CContainer">
                {/* 강의실 이름 */}
                <div className='CCategory'>
                    <div className='Category'>{folderInfo.name}</div>
                    {/* 강의실 관리 버튼 */}
                    {
                        user.is_student === false && (
                            <div className="CCIcon" onClick={linkToManagePage} title='강의실 관리'>
                                <FontAwesomeIcon icon={faGear} />
                            </div>
                        )
                    }
                </div>
                <div className='storage-box'>
                    <div>저장용량</div>
                    <div className='storage-content'>
                        <div className='bar'>
                            <div className='barfill' id='barfill'></div>
                        </div>
                        <div>{folderInfo.pres_volume}{' / '}{folderInfo.max_volume}{'MB'}</div>
                    </div>
                </div>
                <div className="SetViewContainer">
                    <div className='SetView'>
                        <div onClick={onViewHandler} className='SetViewElement'>
                            {
                                view === 'list'
                                ? (<div title="아이콘 보기"><FontAwesomeIcon icon={faTableCellsLarge} /></div>)
                                : (<div title="리스트 보기"><FontAwesomeIcon icon={faTableList} /></div>)
                            }
                        </div>
                        {/* <div onClick={onSortHandler} className='SetViewElement'>
                            {
                                sort === 'name'
                                ? (<div title="최신순"><FontAwesomeIcon icon={faArrowDown19} /></div>)
                                : (<div title="이름순"><FontAwesomeIcon icon={faArrowDownAZ} /></div>)
                            }
                        </div> */}
                    </div>
                </div>
                {/* 강의란 */}
                <div className='CItem'>
                    <div className='ItemTitle'>
                        <div>강의</div>
                        <div className='BContainer'>
                            <div className='DeleteContainer'>
                                {
                                    Lectviewbutton === true && (
                                    <div className='EditfolderButton'>
                                        <div className="DE" onClick={deleteItem}><FontAwesomeIcon icon={faTrashCan} /></div>
                                        <div style={{color:'#efefef'}}> | </div>
                                    </div>
                                    ) 
                                }
                            </div>
                            <div className='PlusContainer'>
                                {/* 폴더 생성 버튼 */}
                                <div onClick={newParentIsLect}>
                                    {
                                        user.is_student === false && (
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
                    </div>
                    
                    {/* 강의 폴더 내 보여주기 */}
                    <div className="Views">
                    {
                        view === 'list'
                        ? (
                        <div className="ListView">
                            <div className="ListColDescription">
                                <div className='ListColLeft'>이름</div>
                                <div>소유자</div>
                                <div className="volumeTitle">용량</div>
                            </div>
                            {
                                lectItems.map(function(item){
                                    return (
                                        <div className="ListItem"  key={item.child} id={item.child}>
                                            <div className="ListIconBox">
                                                {
                                                    item.is_folder === true 
                                                    ? (<FontAwesomeIcon icon={faFolder} className="ListFolderIcon" />)
                                                    : (<FontAwesomeIcon icon={faFileLines} className="ListFileIcon"/>)
                                                }
                                            </div>
                                            <div className='ListNameBox'>
                                                {
                                                    item.is_folder === true
                                                    ? (<div onClick={()=>clickEvent({id: item.child, is_folder: item.is_folder, made_by: ''}, 1)} onDoubleClick={()=>onFolderHandler(item.child)}>{item.name}</div>)
                                                    : (<div onClick={()=>clickEvent({id: item.child, is_folder: item.is_folder, made_by: ''}, 1)} onDoubleClick={()=>FileDownload} >{item.name}</div>)
                                                }
                                            </div>
                                            <div className='ListOwner'>
                                                <p>{item.child_made_by_name}</p>
                                            </div>
                                            <div className='ListVolume'>
                                                {
                                                    item.is_folder === false &&
                                                    (<div>{item.child_volume}{'KB'}</div>)
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
                                <li key={item.child} id={item.child} onClick={()=>clickEvent({id: item.child, is_folder: item.is_folder, made_by: ''}, 1)} > 
                                {
                                    item.is_folder === true 
                                    ? (
                                    <div className="Iconbox" onDoubleClick={()=>onFolderHandler(item.child)}>
                                        <FontAwesomeIcon title={item.name} icon={faFolder} className="FolderIcon"/>
                                    </div>
                                    )
                                    : (
                                    <div className="Iconbox" onDoubleClick={FileDownload}>
                                        <FontAwesomeIcon title={item.name} icon={faFileLines} className="FileIcon"/>
                                    </div>
                                    )
                                }
                                    <div title={item.name} className="IconNameBox">
                                        <p>{item.name}</p>
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
                        <div className='BContainer'>
                            <div className='DeleteContainer'>
                                {
                                    viewbutton === true && (
                                    <div className='EditfolderButton'>
                                        <div className="DE" onClick={deleteItem}><FontAwesomeIcon icon={faTrashCan} /></div>
                                        <div style={{color:'#efefef'}}> | </div>
                                    </div>
                                    ) 
                                }
                            </div>
                            <div className='PlusContainer'>
                                {/* 폴더 생성 버튼 */}
                                <div onClick={newParentIsAssign}>
                                    {
                                        user.is_student === false && (
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
                    </div>
                    
                    <div className="Views">
                    {
                        view === 'list'
                        ? (
                        <div className="ListView">
                            <div className="ListColDescription">
                                <div className='ListColLeft'>이름</div>
                                <div>소유자</div>
                                <div className="volumeTitle">용량</div>
                            </div>
                            {
                                assignItems.map(function(item){
                                    return (
                                        <div className="ListItem"  key={item.child} id={item.child}>
                                            <div className="ListIconBox">
                                                {
                                                    item.is_folder === true 
                                                    ? (<FontAwesomeIcon icon={faFolder} className="ListFolderIcon" />)
                                                    : (<FontAwesomeIcon icon={faFileLines} className="ListFileIcon"/>)
                                                }
                                            </div>
                                            <div className='ListNameBox'>
                                                {
                                                    item.is_folder === true
                                                    ? (<p onClick={()=>clickEvent({id: item.child, is_folder: item.is_folder, made_by: ''}, 2)} onDoubleClick={()=>onFolderHandler(item.child)}>{item.name}</p>)
                                                    : (<p onClick={()=>clickEvent({id: item.child, is_folder: item.is_folder, made_by: ''}, 2)} onDoubleClick={()=>FileDownload}>{item.name}</p>)
                                                }
                                            </div>
                                            <div className='ListOwner'>
                                                <p>{item.child_made_by_name}</p>
                                            </div>
                                            <div className='ListVolume'>
                                                {
                                                    item.is_folder === false &&
                                                    (<div>{item.child_volume}{'KB'}</div>)
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
                                <li key={item.child} id={item.child} onClick={()=>clickEvent({id: item.child, is_folder: item.is_folder, made_by: ''}, 2)}> 
                                {
                                    item.is_folder === true 
                                    ? (
                                    <div className="Iconbox" onDoubleClick={()=>onFolderHandler(item)}>
                                        <FontAwesomeIcon title={item.name} icon={faFolder} className="FolderIcon"/>
                                    </div>
                                    )
                                    : (
                                    <div className="Iconbox" >
                                        <FontAwesomeIcon title={item.name} icon={faFileLines} className="FileIcon"/>
                                    </div>
                                    )
                                }
                                    <div title={item.name} className="IconNameBox">
                                        <p>{item.name}</p>
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