import React, { useEffect, useState, useRef } from "react";
import './FolderPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { faTrashCan, faFolder, faFolderPlus, faArrowDownAZ, faArrowDown19, faTableList, faTableCellsLarge, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { authHeader } from '../../../_helpers';
import { useParams } from 'react-router-dom';
import { createBrowserHistory } from "history";

function FolderPage (props) {
    // let { folderid } = useParams();
    const [view, setview] = useState('list'); // icon, list
    const [sort, setsort] = useState('name'); // time, name
    const [isViewAddModal, setisViewAddModal] = useState(false); // 폴더 생성 모달 노출 여부
    const [newFolderName, setnewFolderName] = useState('') // 생성할 폴더 이름
    const [newFile, setnewFile] = useState({}); // 업로드할 파일
    const [folderInfo, setfolderInfo] = useState({}); // 현재 폴더 정보
    const [folderItems, setfolderItems] = useState([]) // 폴더 안 하위 내용 
    const [folderPath, setfolderPath] = useState([]) // 폴더 경로
    const [viewbutton, setviewbutton] =useState(false); // 폴더 수정 삭제 이동 버튼 노출 여부
    const [selectedItem, setselectedItem] = useState({id:'', is_folder: '', made_by:''}); // 선택된(삭제, 수정, 이동) 폴더 또는 파일 아이디
    const [user, setuser] = useState({});
    const baseurl = 'http://3.231.84.43:8000';
    let path = JSON.parse(localStorage.getItem('path'));
    const history = createBrowserHistory();

    // 필요한 데이터:
    // 부모 폴더 아이디

    // 페이지 첫 렌더링 시 동작
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('user'));

        if (user){
            path = JSON.parse(localStorage.getItem('path'));

            setuser({
                id: user.id,
                is_student: user.is_student
            })
            setFolder();

            folderPathRequest()
            .then(
                data=>{
                    const pathList = data.path.split('>');
                    setfolderPath(pathList);
                }
            )
        } else {
            return ;
        }

    }, [])

    useEffect(()=>{

        colorBar();

    }, [folderInfo]);

    useEffect(() => {
        const listenBackEvent = () => {
          // 뒤로가기 할 때 수행할 동작을 적는다
          
        };
    
        const unlistenHistoryEvent = history.listen(({ action }) => {
          if (action === "POP") {
            console.log('뒤로가기')
            listenBackEvent();
          }
        });
    
        return unlistenHistoryEvent;
      }, [
      // effect에서 사용하는 state를 추가
    ]);

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

    const setFolder = ()=>{
        folderRequest()
        .then(
            data=>{
                console.log(data);
                setfolderInfo({
                    // parent: data.parent,
                    id: data.id,
                    made_by: data.made_by,
                    name: data.name,
                    max_volume: data.max_volume,
                    pres_volume: data.volume,
                    type: data.type,
                });

                if (data.items) {
                    setfolderItems(data.items);
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
    // 폴더 정보 요청 함수
    const folderRequest = () => {
        
        const url = baseurl + '/api/folder/' + path.pro + '/1';

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
    // 폴더 경로 요청 함수
    const folderPathRequest = () => {
        const url = baseurl + '/api/folder_path/' + path.pro;

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
    // 폴더 생성 요청 함수
    const addFolderRequest = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
            body: JSON.stringify({
                parent: folderInfo.id,
                name: newFolderName,
                type: 1
            })
        };

        return (
            fetch(baseurl + '/api/folder/', requestOptions)
            .then(handleResponse)
        )
    }
    // 파일 업로드 요청 함수
    const addFileRequest = (formData)=>{
        const url = baseurl + '/api/folder/' + folderInfo.id.toString() + '/file/';

        const requestOptions = {
            method: 'POST',
            headers: {
                //'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
            body: formData
        };

        return (
            fetch(url, requestOptions)
            .then(handleResponse)
        )
    }
    // 폴더 삭제 요청 함수
    const deleteFolderRequest = () => {
        const url = baseurl + '/api/folder/' + selectedItem.id.toString();

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
        const url = baseurl + '/api/foler/' + folderInfo.id.toString() + '/file/' + selectedItem.id.toString();
        
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
    const handleResponse = (response) => {
        return response.text().then(json => {
            const data = json && JSON.parse(json);
            if (response.status !== 200) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    logout();
                    window.location.reload(true);
                }
    
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            
            return data;
        });
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
            data => {
                setFolder();
                alert('추가되었습니다.');
                closeAddFolderModal();
            }
        )
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
        //onFileSubmitHandler();
    }
    // 파일 업로드 함수
    const onFileSubmitHandler = ()=> {
        // event.preventDefault();

        const formData = new FormData();
        formData.append('file', newFile);

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
        localStorage.setItem('path', JSON.stringify({pre: path.pro, pro: folderId, post: ''}));
        window.location.reload();
    }

    /**
     * 삭제 기능
     */
    // 폴더, 파일 삭제 함수
    const deleteItem = () => {
        // 폴더 삭제
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
        }
    }
    // 아이템 선택 함수 
    const clickEvent = (item) =>{
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



    return (
        <div className="ClassPage">
            <div className="CContainer">
                <div className='FCategory'>
                    <div className='Category'>{folderInfo.name}</div>
                    <div className="FPath">
                        {
                            folderPath.map(function(item){
                                if (item === folderInfo.name) {
                                    return (<div key={item}>{item}</div>)
                                }
                                else {
                                    return (
                                        <div key={item}>{item} {'>'}</div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                <div className='storage-box'>
                    <div>저장용량</div>
                    <div className='storage-content'>
                        <div className='bar'>
                            <div className='barfill' id='barfill'></div>
                        </div>
                        <div>{folderInfo.pres_volume}{' / '}{folderInfo.max_volume}{'GB'}</div>
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
                        <div onClick={onSortHandler} className='SetViewElement'>
                            {
                                sort === 'name'
                                ? (<div title="최신순"><FontAwesomeIcon icon={faArrowDown19} /></div>)
                                : (<div title="이름순"><FontAwesomeIcon icon={faArrowDownAZ} /></div>)
                            }
                        </div>
                    </div>
                </div>
                <div className="FBContainer">
                    <div className="FButtonBox">
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
                            {
                                user.is_student === false && (
                                    <div className="CategoryPlusIcon" title='생성' onClick={viewAddFolderModal}><FontAwesomeIcon icon={faFolderPlus} /></div>
                                )
                            }
                            {/* 파일 업로드 버튼 */}
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
                        view === 'list'
                        ? (
                        <div className="ListView">
                            <div className="ListColDescription">
                                <div className='ListColLeft'>이름</div>
                                <div>소유자</div>
                            </div>
                            {
                                folderItems.map(function(item){
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
                                                    ? (<p onClick={()=>clickEvent({id: item.child, is_folder: item.is_folder, made_by:''})} onDoubleClick={()=>onFolderHandler(item.child)}>{item.name}</p>)
                                                    : (<p onClick={()=>clickEvent({id: item.child, is_folder: item.is_folder, made_by: ''})}>{item.name}</p>)
                                                }
                                            </div>
                                            <div className='ListOwner'>
                                                <p>{''}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>)
                        : (
                        <ul className="IconList">
                        {
                            folderItems.map(item => (
                                <li key={item.child} id={item.child} onClick={()=>clickEvent({id: item.child, is_folder: item.is_folder, made_by: ''})}> 
                                {
                                    item.is_folder === true 
                                    ? (
                                    <div className="Iconbox" onDoubleClick={()=>onFolderHandler(item.child)}>
                                        <FontAwesomeIcon icon={faFolder} className="FolderIcon"/>
                                    </div>
                                    )
                                    : (
                                    <div className="Iconbox">
                                        <FontAwesomeIcon icon={faFileLines} className="FileIcon"/>
                                    </div>
                                    )
                                }
                                    <div className="IconNameBox">
                                        <p>{item.name}</p>
                                    </div>            
                                </li>
                            ))
                        } 
                        </ul>)
                    }
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

export { FolderPage }