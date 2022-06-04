import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { userActions } from '../../../_actions';
import './RegisterPage.css';

function RegisterPage(props) {
    const dispatch = useDispatch();

    const [Id, setId] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")
    const [IsStudent, setIsStudent] = useState("")
    const [Name, setName] = useState("")
    const [Email, setEmail] = useState("")
    const [School, setSchool] = useState("")
    const [Department, setDepartment] = useState("")

    const onIdHandler = (event) => {
        setId(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }
    const onIsStudentHandler = (event) => {
        if (event.currentTarget.value ==='student'){
            setIsStudent(true)
        }
        else {
            setIsStudent(false)
        }
    }
    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    const onSchoolHandler = (event) => {
        setSchool(event.currentTarget.value)
    }
    const onDepartmentHandler = (event) => {
        setDepartment(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        if (Id==="" || Password==="" || ConfirmPassword===""|| IsStudent==="" || Name===""|| Email==="" || School===""|| Department===""){
            return alert('모든 항목을 입력해주세요.')
        }
        else if (Password !== ConfirmPassword) {
            return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
        }


        let body = {
            id: Id,
            pw: Password,
            is_student: IsStudent,
            name: Name,
            email: Email,
            school: School,
            department: Department
        }
        console.log(body)

        dispatch(userActions.register(body))
        .then(response=> {
            if (response.payload.success) {
                props.history.push("/login")
            } else {
                alert("이미 존재하는 아이디입니다.")
            }
        })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <div className='register-group'>
                    <label className='info-group'>아이디</label>
                    <input className='form-control' type="text" value={Id} onChange={onIdHandler} />
                </div>
                
                <div className='register-group'>
                    <label className='info-group'>비밀번호</label>
                    <input className='form-control' type="password" value={Password} onChange={onPasswordHandler} />
                </div>
                
                <div className='register-group'>
                    <label className='info-group'>비밀번호 확인</label>
                    <input className='form-control' type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
                </div>
                
                <div className='register-group'>
                    <label className='info-group2'>수강자</label>
                    <input type="radio" value="student" onClick={onIsStudentHandler} />
                </div>
                
                <div className='register-group'>
                    <label className='info-group2'>강의자</label>
                    <input type="radio" value="lecturer" onClick={onIsStudentHandler} />
                </div>
                
                <div className='register-group'>
                    <label className='info-group'>이름</label>
                    <input className='form-control' type="text" value={Name} onChange={onNameHandler} />
                </div>
                
                <div className='register-group'>
                    <label className='info-group'>이메일</label>
                    <input className='form-control' type="text" value={Email} onChange={onEmailHandler} />
                </div>
                
                <div className='register-group'>
                    <label className='info-group'>학교</label>
                    <input className='form-control' type="text" value={School} onChange={onSchoolHandler} />
                </div>

                <div className='register-group'>
                    <label className='info-group'>학과</label>
                    <input className='form-control' type="text" value={Department} onChange={onDepartmentHandler} />
                </div>        
                <br />
                <button className='btn btn-primary' type="submit">
                    회원 가입
                </button>
                <Link to="/login" className="btn btn-link" >취소</Link>
            </form>
        </div>
    );
}

export {RegisterPage}