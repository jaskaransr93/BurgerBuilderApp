import React from 'react'
import classes from './Order.css';

const Order = (props) => {
    const ingredients = [];

    for (let ingredient in props.ingredients) {
        ingredients.push({
            name: ingredient,
            value: props.ingredients[ingredient]
        });
    }

    const ingredientEl = ingredients.map(ig => {
    return <span
                style={{
                    textTransform: 'capitalize',
                    display: 'inline-block',
                    margin: '0 8px',
                    border: '1px solid #ccc',
                    padding: '5px'
                }}
             key={ig.name}>{ig.name} ({ig.value})</span>
    })

    return (
        <div  className={classes.Order}>
            {ingredientEl}
          <p>Price: <strong>$ {props.price.toFixed(2)}</strong></p>    
        </div>
    )
}

export default Order;
