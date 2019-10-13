import React, { Component } from 'react';
import { SideBar, TopBar } from '../Nav';
import CardInput from '../CardInput';
import './Balance.css';

export default class Balance extends Component {

    constructor(props){
        super(props);

        this.state = {balance: 0, token: localStorage.getItem('token')};
    }

    componentDidMount(){
        this.refreshData();
    }

    render(){
        return (
            <div className="App">
                <TopBar title={'Balance'}/>
                <SideBar history={this.props.history} page={'Balance'}/>
                <div className="main balance">
                    <div>
                        <h1 style={{color: this.state.balance < 0 ? '#FF5252' : '#69F0AE'}}>${this.state.balance.toFixed(2)}</h1>
                        <p>Your balance</p>
                    </div>
                    { this.state.balance < 0 ?
                        <div>
                            <h2>Pay with a card</h2>
                            <CardInput stripePublicKey={'pk_test_gv0XVmjynqqObQnR7KHy57Go'} handleResult={this.makePayment}/>
                        </div>
                        :
                        <div>
                            <h2>You're all good with payments</h2>
                        </div>
                    }
                </div>
            </div>
        );
    }

    refreshData = () => {
        fetch(`/api/user?token=${this.state.token}`).then(res => res.json()).then(data => {
            if(data.user){
                fetch(`/api/logs?userToken=${this.state.token}`).then(res => res.json()).then(logData => {
                    let logPrice = 0;

                    for(let log of logData.logs){
                        for(let ride of log.rides){
                            logPrice += ride;
                        }
                    }

                    let balance = data.user.balance - logPrice;
                    this.setState({balance});
                });
            }
        });
    }

    makePayment = stripeToken => {
        fetch('/api/payment', {
            method: 'POST',
            body: JSON.stringify({
                stripeToken: stripeToken.token.id,
                token: this.state.token,
                charge: -this.state.balance
            }),
            headers: {"Content-Type": "application/json"}
        }).then(res => res.json()).then(data => {
            this.refreshData();
        });
    }

}
