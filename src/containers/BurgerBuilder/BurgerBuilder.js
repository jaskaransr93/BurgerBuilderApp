import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

export const BurgerBuilder = (props) => {
    const [purchasing, setPurchasing] = useState(false);
    const dispatch = useDispatch();

    const ings = useSelector((state) => {
        return state.burgerBuilder.ingredients
    });

    const totalPrice = useSelector((state) => {
        return state.burgerBuilder.totalPrice
    });

    const error = useSelector((state) => {
        return state.burgerBuilder.error
    }); 

    const loading = useSelector((state) => {
        return state.burgerBuilder.loading
    }); 

    const isAuthenticated = useSelector((state) => {
        return state.auth.token !== null
    }); 


    const onIngredientAdded = (ingredientName) => dispatch(actions.addIngredient(ingredientName));
    const onIngredientRemoved = (ingredientName) => dispatch(actions.removeIngredient(ingredientName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    useEffect(()=> {
        onInitIngredients();
    }, [onInitIngredients])

    const updatePurchase = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map((ig) => {
                return ingredients[ig];
            })
            .reduce((sum, el) => sum += el, 0);

        return sum > 0;
    }

    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
        
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push({
            pathname: '/checkout',
        });
    }

    
        const disabledInfo = {
            ...ings
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;


        let burger = error ? <p>Ingredients cant be loaded</p> : <Spinner />;
        if (ings) {
            burger = (
                <Aux>
                    <Burger ingredients={ings} /> 
                    <BuildControls
                        ordered={purchaseHandler}
                        purchasable={updatePurchase(ings)}
                        price={totalPrice}
                        disabled={disabledInfo}
                        isAuth={isAuthenticated}
                        ingredientAdded={(ingName) => onIngredientAdded(ingName)}
                        ingredientRemoved={(ingName) => onIngredientRemoved(ingName)} />
                </Aux>
            );
            orderSummary = <OrderSummary
            price={totalPrice}
            purchaseCanceled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler}
            ingredients={ings} />;
        }

        if (loading) {
            orderSummary = <Spinner />
        }


        return (
            <Aux>
                <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    
}


export default withErrorHandler(BurgerBuilder, axios);