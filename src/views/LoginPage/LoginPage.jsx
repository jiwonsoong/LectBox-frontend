import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../_actions';
import './LoginPage.css';

function LoginPage() {
    const [inputs, setInputs] = useState({
        id: '',
        pw: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const { id, pw } = inputs;
    const loggingIn = useSelector(state => state.authentication.loggingIn);
    const dispatch = useDispatch();
    const location = useLocation();

    // reset login status
    useEffect(() => { 
        dispatch(userActions.logout());
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (id && pw) {
            // get return url from location state or default to home page
            const { from } = location.state || { from: { pathname: "/" } };
            dispatch(userActions.login(id, pw, from));
        }
    }

    return (
        <div className="loginpage">
            <form name="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>아이디</label>
                    <input type="text" name="id" value={id} onChange={handleChange} className={'form-control' + (submitted && !id ? ' is-invalid' : '')} />
                    {submitted && !id &&
                        <div className="invalid-feedback">이메일을 입력해주세요</div>
                    }
                </div>
                <div className="form-group">
                    <label>비밀번호</label>
                    <input type="pw" name="pw" value={pw} onChange={handleChange} className={'form-control' + (submitted && !pw ? ' is-invalid' : '')} />
                    {submitted && !pw &&
                        <div className="invalid-feedback">비밀번호를 입력해주세요</div>
                    }
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">
                        {loggingIn && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        로그인
                    </button>
                    <Link to="/register" className="btn btn-link">회원가입</Link>
                </div>
            </form>
        </div>
    );
}

export { LoginPage };