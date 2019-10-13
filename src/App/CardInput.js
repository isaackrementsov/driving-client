import React, { Component } from 'react';
import { CardElement, injectStripe, StripeProvider, Elements } from 'react-stripe-elements';

const createOptions = () => {
    return {
        style: {
            base: {
                fontSize: '17px',
                color: '#424770',
                letterSpacing: '0.025em',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#c23d4b',
            },
        }
    }
}

class CardFormInternal extends Component {

    state = {
        errorMessage: '',
    };

    handleChange = ({error}) => {
        if (error) {
            this.setState({errorMessage: error.message});
        }
    };

    handleSubmit = (evt) => {
        evt.preventDefault();

        if (this.props.stripe) {
            this.props.stripe.createToken().then(this.props.handleResult);
        } else {
            console.log("Stripe.js hasn't loaded yet.");
        }
    };

    render() {
        return (
            <div className="CardDemo">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <label className="card-label">
                        Card details
                        <CardElement className="card-element"
                            onChange={this.handleChange}
                            {...createOptions()}
                        />
                    </label>
                    <div className="error" role="alert">
                        {this.state.errorMessage}
                    </div>
                    <button>Pay</button>
                </form>
            </div>
        );
    }

}

const CardForm = injectStripe(CardFormInternal);

export default class CardInput extends Component {
    render() {
        return (
            <StripeProvider apiKey={this.props.stripePublicKey}>
                <Elements>
                    <CardForm handleResult={this.props.handleResult}/>
                </Elements>
            </StripeProvider>
        );
    }
}
