import React, { useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_Pageroute';
import { LandingPage } from '../components/views/LandingPage';
import { HomePage } from '../components/views/HomePage';
import { LoginPage } from '../components/views/LoginPage/LoginPage';
import { RegisterPage } from "../components/views/RegisterPage/RegisterPage";
import { NavBar } from '../components/views/NavBar';
import { ClassPage } from '../components/views/ClassPage';
import { FolderPage } from '../components/views/FolderPage/FolderPage';


function App() {
    const alert = useSelector(state => state.alert);
    const dispatch = useDispatch();

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
                    <Route exact path="/" component={LandingPage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <Route path='/user' component={HomePage} />
                    <Route path='/class/:classid' component={ClassPage}/>
                    <Route path='/folder/:folderid' component={FolderPage}/>
                    <Redirect from="*" to="/" />
                </Switch>
            </Router>
        </div>
    );
}

export { App };