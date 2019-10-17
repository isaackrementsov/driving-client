import React, { Component } from 'react';
import { TopBar } from '../Nav.js';
import prefix from '../../static.js';
import './Login.css';

export default class Login extends Component {

    constructor(props){
        super(props);

        this.state = {username: "", password: "", error: null};
    }

    componentDidMount(){
        let token = localStorage.getItem('token');

        if(token !== 'null'){
            this.props.history.push('/logs');
        }
    }

    render() {
        return (
            <div className="App Login">
                <div className="main">
                    <div className="form-container">
                        <h1>Login to Your Account</h1>
                        <form onSubmit={this.login}>
                            {this.state.error && <p style={{color: '#FF5252', marginTop: 0}}>{this.state.error}</p>}
                            <label>
                                Username
                                <input type="text" name="username" value={this.state.username} onChange={this.handleInput}/>
                            </label><br/>
                            <label>
                                Password
                                <input type="password" name="password" value={this.state.password} onChange={this.handleInput}/>
                            </label><br/>
                            <input type="submit" value="Login"/>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    handleInput = e => {
        let name = e.target.name;
        let val = e.target.value;

        this.setState({[name]: val});
    }

    login = e => {
        e.preventDefault();

        fetch(prefix + '/api/login', {
            method: 'POST',
            body: JSON.stringify({username: this.state.username, password: this.state.password}),
            headers: {"Content-Type": "application/json"}
        }).then(res => res.json()).then(data => {
            if(data.user){
                localStorage.setItem('token', data.user.token);
                localStorage.setItem('admin', data.user.admin);
                localStorage.setItem('username', data.user.username);

                this.props.history.push('/logs');
            }else{
                let error;

                if(data.error){
                    error = data.error;
                }else{
                    error = "Incorrect credentials";
                }

                this.setState({error});
            }
        });
    }

}
