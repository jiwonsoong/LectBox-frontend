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
    const [IsStudent, setIsStudent] = useState(false);
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
        if (event.target.value ==='student'){
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

        // 폼 유효성 검사
        if (checkInputs()){
            let body = {
                id: Id,
                pw: Password,
                is_student: IsStudent,
                name: Name,
                email: Email,
                school: School,
                department: Department
            }
    
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            };
        
            fetch(`http://localhost:8000/api/sign-up/`, requestOptions)
            .then(handleResponse)
            .then(response=>props.history.push("/login"),
                error=>alert("이미 존재하는 아이디입니다.")
            )
        }
    }
    const handleResponse = (response) => {
        return response.text().then(json => {
            const data = json && JSON.parse(json);
            if (!response.status === 200) {
    
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            
            return data;
        });
    }


    const checkInputs = ()=>{
        
        if (Id==="" || Password==="" || ConfirmPassword===""|| IsStudent==="" || Name===""|| Email==="" || School===""|| Department===""){
            alert('모든 항목을 입력해주세요.')
            return false;
        }
        else if(!isSpcIn(Password) || !isNumIn(Password) || !isEngIn(Password)) {
            alert('비밀번호는 숫자, 문자, 특수문자를 포함해야 합니다.')
            return false;
        } else if(Password.length < 8) {
            alert('비밀번호는 8자 이상입니다.')
            return false;
        }
        else if (Password !== ConfirmPassword) {
            alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
            return false;
        }
        else if(!isEmail(Email)) {
            alert('유효하지않은 형식의 이메일입니다.')
            return false;
        }
        else if(!isSchool(School)) {
            alert('정확한 학교 이름을 입력해주세요.')
            return false;
        }
        else if(!isDepartment(Department)) {
            alert('정확한 학과 이름을 입력해주세요.')
            return false;
        }
        else {
            return true;
        }
    }

    const isEmail = (email) => {
        return /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/.test(email);
    }
    
    const isSpcIn = (value) => {
        return /[~!@#$%^&*()_+|<>?:{}]/.test(value);
    }
    
    const isNumIn = (value) => {
        return /[0-9]/.test(value);
    }
    
    const isEngIn = (value) => {
        return /[a-zA-Z]/.test(value);
    }

    const isSchool = (school) => {
        return school.slice(school.length-3,school.length) === "대학교";
    }

    const isDepartment = (department) => {
        return (department.slice(department.length-2,department.length) === "학과") || 
        (department.slice(department.length-2,department.length) === "학부");
    }
   
    return (
        <div className='RegisterPage'>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <div className='register-group'>
                    <label className='info-group'>아이디</label>
                    <input className="form-control" type="text" value={Id} onChange={onIdHandler} />
                </div>
                
                <div className='register-group'>
                    <label className='info-group'>비밀번호</label>
                    <input className="form-control" type="password" value={Password} onChange={onPasswordHandler} />
                </div>
                
                <div className='register-group'>
                    <label className='info-group'>비밀번호 확인</label>
                    <input className="form-control" type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
                </div>
                
                <div className='register-group'>
                    <div className='info-group'>권한</div>
                    <div className='ig2-container'>
                        <div className='ig2-c-c'>
                            <label htmlFor="student" className='info-group2'>수강자</label>
                            <input 
                            type="radio" 
                            name="student"
                            id="student" 
                            value="student" 
                            onChange={onIsStudentHandler}
                            checked={IsStudent}
                            />
                        </div>
                        <div className='ig2-c-c'>
                            <label htmlFor="lecturer" className='info-group2'>강의자</label>
                            <input 
                            type="radio" 
                            name="lecturer" 
                            id="lecturer"
                            value="lecturer" 
                            onChange={onIsStudentHandler}
                            checked={!IsStudent}
                            />
                        </div>
                    </div>
                </div>
                
                <div className='register-group'>
                    <label className='info-group'>이름</label>
                    <input className="form-control" type="text" value={Name} onChange={onNameHandler} />
                </div>
                
                <div className='register-group'>
                    <label className='info-group'>이메일</label>
                    <input className="form-control" type="text" value={Email} onChange={onEmailHandler} />
                </div>
                
                <div className='register-group'>
                    <label className='info-group'>학교</label>
                    <input className="form-control" type="text" value={School} onChange={onSchoolHandler} />
                </div>

                <div className='register-group'>
                    <label className='info-group'>학과</label>
                    <input className="form-control" type="text" value={Department} onChange={onDepartmentHandler} />
                </div>        
                <br />
                <div  className="form-group">
                    <button className="btn btn-primary" type="submit">
                        회원 가입
                    </button>
                    <div >
                        <Link className="btn btn-link" to="/login">취소</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export {RegisterPage}