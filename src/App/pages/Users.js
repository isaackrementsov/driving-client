import React, { Component } from 'react';
import { SideBar, TopBar } from '../Nav';

export default class Users extends Component {

    constructor(props){
        super(props);

        this.state = {
            users: [],
            token: localStorage.getItem('token'),
            admin: localStorage.getItem('admin')
        };
    }

    componentDidMount(){
        if(this.state.token === 'null'){
            this.props.history.push('/');
        }else if(this.state.admin === 'false'){
            this.props.history.push('/logs');
        }else{
            this.refreshUsers();
        }
    }

    render(){
        let users = this.state.users.length > 0 ? this.state.users.map(user => <Log key={user._id} user={user} refresh={this.refreshUsers}/>) : [];

        return (
            <div className="App">
                <TopBar title={'Users'}/>
                <SideBar history={this.props.history} page={'Users'}/>
                <div className="main">
                    <table>
                        <thead>
                            <tr key={0}>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Credit</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users}
                            <CreateLog refresh={this.refreshUsers}/>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    refreshUsers = () => {
        fetch('/api/users').then(res => res.json()).then(users => {
            this.setState({users: users.users});
        });
    }

}

class Log extends Component {

    constructor(props){
        super(props);

        this.state = {
            user: props.user,
            balance: props.user.balance.toFixed(2),
            delete: true
        };
    }

    render(){
        let user = this.state.user;
        let password = '';

        for(let i = 0; i < user.password.length; i++){ password += '*'; }

        return (
            <tr key={user._id}>
                <td>{user.username}</td>
                <td>{password}</td>
                <td>$<input type="number" name="balance" value={this.state.balance} onChange={this.handleInput} onFocus={this.swapDelete} onBlur={this.swapDelete}/></td>
                <td>{this.state.delete ?
                    <input type="submit" value="Delete" className="secondary" onClick={this.deleteUser}/>
                    :
                    <input type="submit" value="Save" className="secondary" onClick={this.saveChanges}/>
                }</td>
            </tr>
        );
    }

    handleInput = e => {
        let name = e.target.name;
        let val = e.target.value;

        this.setState({[name]: val});
    }

    swapDelete = e => {
        setTimeout(() => {
            this.setState({delete: !this.state.delete})
        }, this.state.delete ? 0 : 500)
    }

    saveChanges = e => {
        fetch(`/api/users/update/${this.state.user._id}`, {
            method: 'PATCH',
            body: JSON.stringify({balance: this.state.balance}),
            headers: {"Content-Type": "application/json"}
        }).then(res => res.json()).then(data => {
            this.props.refresh();
        });
    }

    deleteUser = e => {
        fetch(`/api/users/delete/${this.state.user._id}`, {
            method: 'DELETE'
        }).then(res => res.json()).then(data => {
            this.props.refresh();
        });
    }

}

class CreateLog extends Component {

    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            balance: (0).toFixed(2),
        };
    }

    render(){
        return (
            <tr key={1}>
                <td><input type="text" name="username" placeholder="Username" value={this.state.username} onChange={this.handleInput}/></td>
                <td><input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleInput}/></td>
                <td>$<input type="number" name="balance" value={this.state.balance} onChange={this.handleInput}/></td>
                <td><input type="submit" value="Add" onClick={this.createUser}/></td>
            </tr>
        );
    }

    handleInput = e => {
        let name = e.target.name;
        let val = e.target.value;

        this.setState({[name]: val});
    }

    createUser = e => {
        e.preventDefault();

        if(!(this.state.username === '' || this.state.password === '' || this.state.balance === '')){
            fetch('/api/users/create', {
                method: 'POST',
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                    balance: this.state.balance
                }),
                headers: {"Content-Type": "application/json"}
            }).then(res => res.json()).then(data => {
                this.setState({username: '', password: '', balance: 0})
                this.props.refresh();
            });
        }
    }

}
