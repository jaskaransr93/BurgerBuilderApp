import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    loading: false,
    building: false
};

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 0.3
}

const addIngredient = (state, action) => {
    const updatedIngredients = updateObject(state.ingredients, {[action.ingredientName]: state.ingredients[action.ingredientName] + 1});
    const updatedState = {
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        building: true
    };
    return updateObject(state, updatedState);
}

const removeIngredient = (state, action) => {
    const updatedIng = updateObject(state.ingredients, {[action.ingredientName]: state.ingredients[action.ingredientName] - 1});
    const updated = {
        ingredients: updatedIng,
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
        building: true
    };
    return updateObject(state, updated);
}

const setIngredients = (state, action) => {
    return updateObject(state, {                 
        ingredients: action.ingredients,
        totalPrice: 4,
        error: false,
        loading: false,
        building: false
    });
}

const reducer = (state = initialState, action) => {

    switch(action.type) {
        case actionTypes.ADD_INGREDIENT:
            return addIngredient(state, action)
        case actionTypes.REMOVE_INGREDIENT:
            return removeIngredient(state, action);
        case actionTypes.FETCHING_INGREDIENTS:
            return updateObject(state, { loading: true });
        case actionTypes.SET_INGREDIENTS:
            return setIngredients(state, action)
        case actionTypes.FETCH_INGREDIENTS_FAILED: 
            return updateObject(state , { error: true, loading: false });
        default:
            return state;
    }
}

export default reducer;