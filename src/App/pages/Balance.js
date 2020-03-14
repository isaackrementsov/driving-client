import React, { Component } from 'react';
import { SideBar, TopBar } from '../Nav';
import CardInput from '../CardInput';
import ReactLoading from 'react-loading';
import prefix from '../../static.js';
import './Balance.css';

export default class Balance extends Component {

    constructor(props){
        super(props);

        this.state = {
            balance: 0,
            token: localStorage.getItem('token'),
            charge: 0,
            loading: true,
            credits: []
        };
    }

    componentDidMount(){
        this.refreshData();
    }

    render(){
        let credits = this.state.credits.length > 0 ? this.state.credits.map(c => <Log entry={c}/>) : [];

        return (
            <div className="App">
                <TopBar title={'Balance'}/>
                <SideBar history={this.props.history} page={'Balance'}/>
                <div className="main balance">
                    <div>
                        {this.state.loading ?
                            <ReactLoading type={'spin'} color={'#B388FF'} height={'180px'} width={'180px'}/>
                            :
                            <h1 style={{color: this.state.balance < 0 ? '#FF5252' : '#69F0AE'}}>${this.state.balance.toFixed(2)}</h1>
                        }
                        <p>Your balance</p>
                    </div>
                    <div>
                        <h2><input type="number" className="payment" value={this.state.charge} onChange={this.handleInput} name="charge"/> Pay with a card</h2>
                        <CardInput
                            stripePublicKey={'pk_test_gv0XVmjynqqObQnR7KHy57Go'}
                            handleResult={this.makePayment}
                            handlePress={this.startLoading}
                            min={50.00}
                            current={this.state.charge}
                        />
                    </div>
                    {credits.length > 0 ?
                        <table>
                            <thead>
                                <tr key={0}>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {credits}
                            </tbody>
                        </table>
                        :
                        <p>No recent credit changes</p>
                    }
                </div>
            </div>
        );
    }

    refreshData = () => {
        fetch(`${prefix}/api/user?token=${this.state.token}`).then(res => res.json()).then(data => {
            if(data.user){
                fetch(`/api/logs?userToken=${this.state.token}`).then(res => res.json()).then(logData => {
                    let logPrice = 0;

                    for(let log of logData.logs){
                        for(let ride of log.rides){
                            logPrice += ride;
                        }
                    }

                    let balance = data.user.balance - logPrice;
                    this.setState({balance, charge: (balance < 0 ? -1 : 1)*balance.toFixed(2), loading: false});
                });

                fetch(`${prefix}/api/user/getCredits?loggedIn=true&token=${this.state.token}`).then(res => res.json()).then(creditData => {
                    this.state.credits = creditData.credits;
                });
            }
        });
    }

    startLoading = () => {
        this.setState({loading: true});
    }

    makePayment = stripeToken => {
        if(this.state.charge > 0 && stripeToken.token){
            fetch(prefix + '/api/payment', {
                method: 'POST',
                body: JSON.stringify({
                    stripeToken: stripeToken.token.id,
                    token: this.state.token,
                    charge: this.state.charge
                }),
                headers: {"Content-Type": "application/json"}
            }).then(res => res.json()).then(data => {
                this.setState({loading: false});

                this.refreshData();
            });
        }else{
            this.setState({loading: false});
        }
    }

    handleInput = e => {
        let name = e.target.name;
        let val = e.target.value;

        this.setState({[name]: val});
    }

}

class Log extends Component {

    constructor(props){
        super(props);

        this.state = {entry: props.entry};
    }

    componentDidMount(){

    }

    render(){
        let entry = this.state.entry;
        let date = new Date(entry.date);
        let dateStr = `${date.getMonth() + 1}/${date.getDate() + 1}/${date.getFullYear()}`;

        return (
            <tr key={entry._id}>
                <td>{dateStr}</td>
                <td style={{color: entry.amount > 0 ? '#00C853' : '#FF5252'}}>{entry.amount > 0 ? '+' : '-'}${Math.abs(parseFloat(entry.amount)).toFixed(2)}</td>
                <td>{entry.description}</td>
            </tr>
        );
    }

}
