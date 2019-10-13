import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, CurrencyUsdIcon, AccountBoxMultipleIcon, TaxiIcon, AccountArrowLeftOutlineIcon, AccountCircleOutlineIcon } from '@icons/material';
import './Nav.css';

export class SideBar extends Component {

    constructor(props){
        super(props);

        this.state = {
            username: '',
            admin: 'false'
        };
    }

    componentDidMount(){
        let username = localStorage.getItem('username');
        let admin = localStorage.getItem('admin');
        let token = localStorage.getItem('token');

        if(token === 'null'){
            this.props.history.push('/');
        }else{
            this.setState({admin, username});
        }
    }

    render(){
        return (
            <ul className="SideBar">
                <li key={-1} className="heading">
                    <AccountCircleOutlineIcon className="pic"/>
                    <h2><b>Hello</b>, {this.state.username}</h2>
                </li>
                <li key={0}><Link className="disabled" to={'#'}>PAGES</Link></li>
                <li key={1}><Link className={this.checkActive('Logs')} to={'./logs'}><CalendarIcon className="ico"/> Logs</Link></li>
                {this.state.admin === 'true' ?
                    <li key={2}><Link className={this.checkActive('Users')} to={'./users'}><AccountBoxMultipleIcon className="ico"/> Users</Link></li>
                    :
                    <li key={2}><Link className={this.checkActive('Balance')} to={'./balance'}><CurrencyUsdIcon className="ico"/> Balance</Link></li>
                }
                <li key={3}><button onClick={this.logout}><AccountArrowLeftOutlineIcon className="ico"/> Logout</button></li>
            </ul>
        );
    }

    logout = e => {
        localStorage.setItem('token', null);

        this.props.history.push('/');
    }

    checkActive = n => this.props.page === n ? 'active' : '';

}

export class TopBar extends Component {

    render(){
        return (
            <div className="TopBar">
                <TaxiIcon className="img"/>
                <h1>{this.props.title}</h1>
            </div>
        );
    }

}
