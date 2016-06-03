import React from 'react';
import Relay from 'react-relay';

class Recipe extends React.Component {
    render () {
        let {title, state, instructions} = this.props.recipe || '';

        console.log('Recipe obj', this.props.recipe);

        return (
            <div>
                <p>{title}</p>
				<span>{state}</span>
				<span>{instructions}</span>
            </div>
        );
    }
}

export default Relay.createContainer(Recipe, {
    fragments: {
        recipe: () => Relay.QL`
            fragment on Recipe {
				title,
				state,
				instructions
            }
        `
    }
});
