import React, { useState } from 'react';
import  { connect } from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actionCreators from '../../../store/actions/index';
import { checkValidity } from '../../../shared/utility'

const ContactData = (props) => {
    const [orderForm, setOrderForm] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Name'
            },
            value: '',
            validation: {
                required: true,
                minLength: 2,
                maxLength: 10
            },
            valid: false,
            touched: false,
            errorMessages: []
        },
        street: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Street'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false,
            errorMessages: []
        },
        zipCode: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'ZIP code'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false,
            errorMessages: []
        },
        country: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Country'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false,
            errorMessages: []
        },
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Your e-mail'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false,
            errorMessages: []
        },
        deliveryMethod: {
            elementType: 'select',
            elementConfig: {
                options: [
                    {value: 'fastest', displayValue: 'Fastest'},
                    {value: 'cheapest', displayValue: 'Cheapest'}
                ]
            },
            value: 'fastest',
            validation: {
                required: true
            },
            valid: true,
            touched: false,
            errorMessages: []
        }
    });

    const [formIsValid, setFormIsValid] = useState(false);


    const inputChangedHandler = (event, inputIdentifier) => {
        const updatedFormData = {...orderForm};
        const updatedFormElement = {
            ...updatedFormData[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true;
        let result = checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.valid = result.isValid;
        updatedFormElement.errorMessages = result.errorMessages;
        updatedFormData[inputIdentifier] = updatedFormElement;
        let formIsValid = true;
        for(let inputIdentifier in  updatedFormData) {
            formIsValid = updatedFormData[inputIdentifier].valid && formIsValid;
        }

        setOrderForm(updatedFormData);
        setFormIsValid(formIsValid);
    }

    const orderHanlder = (event) => {
        event.preventDefault();
        // this.setState({ loading: true });
        const formData = {};
        for (let formElement in orderForm) {
            formData[formElement] = orderForm[formElement].value;
        }
        const order = {
            ingredients: props.ings,
            price: props.price,
            orderData: formData,
            userId: props.userId
        };
        props.onOrderBurger(order, props.token);
    }

        const formElementArray = [];
        for (let key in orderForm) {
            formElementArray.push({
                id: key,
                config: orderForm[key]
            });
        }
        let form = <form onSubmit={orderHanlder}>
            {formElementArray.map(formElement => (
                <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig} 
                    value={formElement.config.value}
                    inValid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    errorMessages={formElement.config.errorMessages}
                    changed={(event) => inputChangedHandler(event, formElement.id)}
                    />
            ))}
            <Button btnType="Success" type="submit" disabled={!formIsValid}>Order</Button>
        </form>;
        if (props.loading) {
            form = <Spinner />
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact</h4> 
                {form}
            </div>
        )
    
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actionCreators.purchaseBurger(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
