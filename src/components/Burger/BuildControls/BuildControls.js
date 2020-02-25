import React from 'react'
import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' },
]

const buildControls = (props) => {

    const buildContronls = controls.map((control) => (
        <BuildControl 
            disabled={props.disabled[control.type]}
            key={control.label} 
            label={control.label} 
            added={() => props.ingredientAdded(control.type)}
            removed={() => props.ingredientRemoved(control.type)} />
    )) 
    

    return (
        <div className={classes.BuildControls}>
            <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
            {buildContronls}
            <button 
                disabled={!props.purchasable}
                className={classes.OrderButton}
                onClick={props.ordered}>
                    {props.isAuth ? "ORDER NOW" : "SIGN UP TO ORDER" }
            </button>
        </div>
    )
}

export default buildControls;