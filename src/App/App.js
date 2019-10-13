import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Logs from './pages/Logs';
import Users from './pages/Users';
import Balance from './pages/Balance';
import './App.css';

export default class App extends Component {

    render() {
        const App = () => (
            <div>
                <Switch>
                    <Route exact path='/' component={Login}/>
                    <Route exact path='/logs' component={Logs}/>
                    <Route exact path='/users' component={Users}/>
                    <Route exact path='/balance' component={Balance}/>
                </Switch>
            </div>
        )

        return (
            <Switch>
                <App/>
            </Switch>
        );
    }

}
