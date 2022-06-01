import React from "react";
import './ListView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';


function ListView() {
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

    return (
        <div className="ListView">
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
        </div>
    )
}

export { ListView }