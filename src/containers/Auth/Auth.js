import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import { checkValidity } from '../../shared/utility';
import * as actions from '../../store/actions/index';

const Auth = props => {
    const [controls, setControls] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Your Email'
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
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6

            },
            valid: false,
            touched: false,
            errorMessages: []
        }
    });

    const [isSignUp, setIsSignUp] = useState(true);
    const { buildingBurger, authRedirectPath, onSetAuthRedirectPath} = props;
    useEffect(() => {
        if (!buildingBurger && authRedirectPath !== "/") {
            onSetAuthRedirectPath()
        }
    }, [buildingBurger,authRedirectPath, onSetAuthRedirectPath])


    const inputChangedHandler = (event, controlName) => {
        let result = checkValidity(event.target.value, controls[controlName].validation);
        const updatedControls = {
            ...controls,
            [controlName]: {
                ...controls[controlName],
                value: event.target.value,
                valid: result.isValid,
                errorMessages: result.errorMessages,
                touched: true
            }
        }
        setControls(updatedControls);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(controls.email.value, controls.password.value, isSignUp);
    }

    const switchAuthMode = () => {
        setIsSignUp(!isSignUp);
    }

    const formElementArray = [];
    for (let key in controls) {
        formElementArray.push({
            id: key,
            config: controls[key]
        });
    }
    let form = <form onSubmit={submitHandler}>
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
        <Button btnType="Success" type="submit">Submit</Button>
        <Button type="button" clicked={switchAuthMode} btnType="Danger">Switch to {isSignUp ? "SIGNIN" : "SIGNUP"}</Button>
    </form>;

    if (props.loading) {
        form = <Spinner />
    }

    let errorMessage = null;

    if (props.error) {
        errorMessage = <p>{props.error.message}</p>
    }

    let authRedirect = null;
    if (props.isAuthenticated) {
        authRedirect = <Redirect to={props.authRedirectPath} />
    }

    return (
        <div className={classes.Auth}>
            {authRedirect}
            {errorMessage}
            {form}
        </div>
    )

}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
