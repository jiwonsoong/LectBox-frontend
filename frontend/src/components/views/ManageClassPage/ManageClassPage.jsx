import React, { useState, } from "react";

function ManageClassPage() {
    const { params } = props.match
    const [folderInfo, setfolderInfo] = useState({f_id: params.classid, f_name: 'unknown'});
    
    useEffect(() => {
        // 폴더 정보 요청
        const state='dev';
        if(state==='dev'){
          setfolderInfo({
              f_id: params.classid, 
              f_name: 'unknown'})
        } else {
          const url = 'api/folder/' + params.classid + '/1';
          const requestOptions = {
            method: 'GET',
            headers: authHeader()
          };
          fetch(url_lect, requestOptions)
          .then(
            (response) => {
              handleResponse(response)
              .then(
                data => {
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

      }
    }, [])
    
    return (
        <div>
            <div>
              {folderInfo.f_name}
            </div>
        </div>
    )
}

export { ManageClassPage }