import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useState } from 'react';


function LandingPage() {
    const [content, setcontent] = useState('')

    const setFile = (e) =>{
        setcontent(e.currentTarget.value)
    }

    const viewContent=()=>{
        console.log(content)
    }

    useEffect(()=>{
        console.log(now)
    })
    return (
        <div>
            시작 페이지
            <input type='file' value={content} onChange={setFile}></input>
            <div onClick={viewContent}>
                클릭
            </div>


        </div>
    )
}

export {LandingPage}