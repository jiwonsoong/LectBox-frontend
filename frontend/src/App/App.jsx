import React, { useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_Pageroute';
import { HomePage } from '../components/views/HomePage';
import { LoginPage } from '../components/views/LoginPage/LoginPage';
import { RegisterPage } from "../components/views/RegisterPage/RegisterPage";
import { NavBar } from '../components/views/NavBar';
import { ClassPage } from '../components/views/ClassPage';
import { FolderPage } from '../components/views/FolderPage/FolderPage';
import { ManageClassPage } from '../components/views/ManageClassPage/ManageClassPage';


function App() {
    const alert = useSelector(state => state.alert);
    const dispatch = useDispatch();
    const is_login = true;

    useEffect(() => {
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }, []);

    return (
        <div>
            {alert.message &&
                <div className={`alert ${alert.type}`}>{alert.message}</div>
            }
            <Router history={history}>
                <NavBar/>
                <Switch>
                    {
                        is_login === false
                        ? (<Route exact path="/" component={LoginPage} />)
                        : (<Route exact path="/" component={HomePage} />)
                    }
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <Route path='/user' component={HomePage} />
                    <Route exact path='/class/:classid' component={ClassPage}/>
                    <Route exact path='/folder/:folderid' component={FolderPage}/>
                    <Route exact path='/class/:classid/manage' component={ManageClassPage}/>
                    <Redirect from="*" to="/" />
                </Switch>
            </Router>
        </div>
    );
}

export { App };