import React, { Component } from 'react';
import { SideBar, TopBar } from '../Nav';
import { PlusCircleIcon, WeatherSunnyIcon, WeatherSunsetIcon } from '@icons/material';
import prefix from '../../static.js';

export default class Logs extends Component {

    constructor(props){
        super(props);

        this.state = {
            logs: [],
            token: localStorage.getItem('token'),
            admin: localStorage.getItem('admin')
        };
    }

    componentDidMount(){
        if(this.state.token === 'null'){
            this.props.history.push('/');
        }else{
            this.refreshLogs();
        }
    }

    render(){
        let logs = this.state.logs.length > 0 ? this.state.logs.map(log => <Log key={log._id} entry={log} refresh={this.refreshLogs} admin={this.state.admin}/>) : [];

        return (
            <div className="App">
                <TopBar title={'Driving Logs'}/>
                <SideBar history={this.props.history} page={'Logs'}/>
                <div className="main">
                    <table>
                        <thead>
                            <tr key={0}>
                                <th>User</th>
                                <th>Date</th>
                                <th>Rides</th>
                                {this.state.admin === 'true' && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {logs}
                            {(this.state.admin === 'true') && <CreateLog users={this.state.users} refresh={this.refreshLogs}/>}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    refreshLogs = () => {
        fetch(prefix + '/api/logs').then(res => res.json()).then(logsData => {
            this.setState({logs: logsData.logs});

            fetch(prefix + '/api/users?admin=false').then(res => res.json()).then(data => {
                this.setState({users: data.users});
            });
        });
    }

}

class Log extends Component {

    constructor(props){
        super(props);

        this.state = {entry: props.entry, admin: props.admin};
    }

    render(){
        let entry = this.state.entry;
        let date = new Date(entry.date);
        let dateStr = `${date.getMonth() + 1}/${date.getDate() + 1}/${date.getFullYear()}`;
        let rides = entry.rides.map((r, j) => <Ride key={j} i={j} ride={r}/>);

        return (
            <tr key={entry.id}>
                <td>{entry.user.username}</td>
                <td>{dateStr}</td>
                <td>{rides}</td>
                {this.state.admin === 'true' && <td><input type="submit" value="Delete" className="secondary" onClick={this.deleteUser}/></td>}
            </tr>
        );
    }

    deleteUser = e => {
        fetch(`${prefix}/api/logs/delete/${this.state.entry._id}`, {
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
            user: '',
            date: '',
            ride: 'shel',
            rides: [],
            custom: false,
            milesExtra: '',
            otherMiles: ''
        };
    }

    render(){
        let usArr = this.props.users || [];
        let users = usArr.map(user => <option key={user._id} value={user._id}>{user.username}</option>);
        let rides = this.state.rides.map((r, j) => <Ride key={j} i={j} ride={r}/>);

        if(this.props.users && this.state.user === '') this.state.user = this.props.users[0]._id;

        return (
            <tr key={1}>
                <td>
                    <select name="user" value={this.state.user} onChange={this.handleInput}>
                        {users}
                    </select>
                </td>
                <td><input name="date" type="date" value={this.state.data} onChange={this.handleInput}/></td>
                <td>
                    {this.state.rides.length < 2 && <select name="ride" value={this.state.ride} onChange={this.checkCustom}>
                        <option value="shel">Shelburne</option>
                        <option value="char">Charlotte</option>
                        <option value="cust">Custom...</option>
                    </select>}
                    {(this.state.custom && this.state.rides.length < 2) && <div className="small-inputs">
                        <input type="number" placeholder="Miles extra" name="milesExtra" value={this.state.milesExtra} onChange={this.handleInput}/>
                        <input type="number" placeholder="Other miles" name="otherMiles" onChange={this.handleInput}/>
                    </div>}
                    {this.state.rides.length < 2 && <button type="button" className="add" onClick={this.addTrip}><PlusCircleIcon/></button>}
                    {rides}
                </td>
                <td>
                    <input type="submit" value="Add" onClick={this.createLog}/>
                </td>
            </tr>
        );
    }

    handleInput = e => {
        let name = e.target.name;
        let val = e.target.value;

        this.setState({[name]: val});
    }

    createLog = e => {
        e.preventDefault();

        if(!(this.state.date === '' || this.state.user === '' || this.state.rides.length === 0)){
            fetch(prefix + '/api/logs/create', {
                method: 'POST',
                body: JSON.stringify({
                    date: this.state.date,
                    user: this.state.user,
                    rides: this.state.rides
                }),
                headers: {"Content-Type": "application/json"}
            }).then(res => res.json()).then(data => {
                this.setState({date: new Date(), rides: []})
                this.props.refresh();
            });
        }
    }

    addTrip = e => {
        let milesExtra = '';
        let otherMiles = '';

        if(this.state.ride === 'char'){
            milesExtra = 8.8;
            otherMiles = 8;
        }else if(this.state.ride === 'shel'){
            milesExtra = 1.3;
            otherMiles = 8;
        }else if(this.state.ride === 'cust'){
            milesExtra = parseFloat(this.state.milesExtra);
            otherMiles = parseFloat(this.state.otherMiles);
        }

        if(!(isNaN(milesExtra) || isNaN(otherMiles))){
            let price = milesExtra/22*2.69 + otherMiles*0.10;

            this.setState({rides: this.state.rides.concat(Math.round(100*price)/100)})
        }

    }

    checkCustom = async e => {
        await this.handleInput(e);
        this.setState({custom: this.state.ride === 'cust'});
    }

}

class Ride extends Component {

    render(){
        return (
            <div className="ride">
                {this.props.i === 0 ? <WeatherSunnyIcon/> : <WeatherSunsetIcon/>}${this.props.ride.toFixed(2)}
            </div>
        );
    }

}
