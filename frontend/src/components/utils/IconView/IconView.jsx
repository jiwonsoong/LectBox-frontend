import React from "react";
import './IconView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';


function IconView() {
    /*
    폴더id, 
    name, 
    made_by(fk .//유저id), 
    max_볼륨, 
    pres_볼륨, 
    종류(0(일반),1(강의실),2(과제),3(팀))
    ‘items’ : [[id, name, is_folder(boolen)],[],…..

    */

    // 폴더 정보 요청 응답 예시
    const response = {
        forderId: '123',
        forderName: 'user123',
        made_by: 'user123',
        max_volume: 100,
        pres_volume: 20,
        kinds: 0,
        items: [['folder1','클라우드컴퓨팅', true], ['folder2','캡스톤디자인',true]]
    }
    const itemList = response.items

    return (
        <div>
            아이콘 보기 형식
            {
                itemList.map(function(item){
                    return (
                        <div key={item[0]}>
                            {
                                item[2] === true 
                                ? (<FontAwesomeIcon icon={faFolder} className="FolderIcon"/>)
                                : (<FontAwesomeIcon icon={faFileLines} className="FileIcon"/>)
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export { IconView }