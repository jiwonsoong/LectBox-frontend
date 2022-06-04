import React, { useEffect, useState, useRef } from "react";
import './FolderPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { faFolder, faFolderPlus, faArrowDownAZ, faArrowDown19, faTableList, faTableCellsLarge, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { authHeader } from '../../../_helpers';

function FolderPage (props) {
    const { params } = props.match;
    const [view, setview] = useState('icon'); // icon, list
    const [sort, setsort] = useState('name'); // time, name
    const [isViewAddModal, setisViewAddModal] = useState(false); // 폴더 생성 모달 노출 여부
    const [newFolderName, setnewFolderName] = useState('') // 생성할 폴더 이름
    const [newFile, setnewFile] = useState() // 업로드할 파일
    const [folderInfo, setfolderInfo] = useState({
        parent: 0,
        id: 44444,
        made_by: 'user2',
        name: '1주차',
        max_volume: 0,
        pres_volume: 0,
        type: 0
    }); // 현재 폴더 정보
    const [folderItems, setfolderItems] = useState([]) // 폴더 안 하위 내용 
    const [folderPath, setfolderPath] = useState([]) // 폴더 경로

    // dummy data
    const is_student = false;

    // 필요한 데이터:
    // 유저 아이디, 유저 권한, 부모 폴더 아이디

    // 페이지 첫 렌더링 시 동작
    useEffect(()=>{
        setfolderInfo({
            parent: 0,
            id: 44444,
            made_by: 'user2',
            name: '1주차',
            max_volume: 0,
            pres_volume: 0,
            type: 0
        });
        const pathList = '클라우드 컴퓨팅>1주차'.split('>');
        setfolderPath(pathList)
        setfolderItems([
            [111, '숙제1_고병후', false, '고병후'],
            [112, '숙제1_손지원', false, '손지원'],
            [113, '숙제1_연동현', false, '연동현'],
            [114, '숙제1_이재호', false, '이재호'],
            [115, '숙제1_조민식', false, '조민식'],
            [116, 'test', true, '김재홍'],
        ])


        /**
         * 백엔드랑 연동 시
         */
        // setFolder();

        // folderPathRequest()
        // .then(
        //     data=>{
        //         const pathList = data.path.split('>');
        //         setfolderPath(pathList);
        //     }
        // )

    }, [])

    const setFolder = ()=>{
        folderRequest()
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
                });
                setfolderItems(data.items);
            }
        )
    }

    /**
     * 요청
     */
    // 폴더 정보 요청 함수
    const folderRequest = () => {
        const url = '/api/folder/' + params.folderid + '/1';

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
        const url = '/api/folder_path/' + params.folderid;

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
            fetch('/api/folder', requestOptions)
            .then(handleResponse)
        )
    }
    // 파일 업로드 요청 함수
    const addFileRequest = (formData)=>{
        const url = '/api/folder/' + folderInfo.id.toString() + '/file/';

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
            body: JSON.stringify({
                parent: folderInfo.id,
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
    const onFolderHandler = (folder) => {
        const url = '/folder/' + folder[0];
        props.history.push(url);
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
                <div className="FButtonBox">
                    <div className='PlusContainer'>
                        {/* 폴더 생성 버튼 */}
                        {
                            is_student === false && (
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
                                folderItems.map(function(item){
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
                            folderItems.map(item => (
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