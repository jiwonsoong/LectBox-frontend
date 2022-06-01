import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import rootReducer from '../../../_reducers';


function LandingPage() {

    const now = useSelector(rootReducer=>rootReducer.folder)

    useEffect(()=>{
        console.log(now)
    })
    return (
        <div>
            시작 페이지



        </div>
    )
}

export {LandingPage}