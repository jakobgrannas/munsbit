import React from 'react';
import Relay from 'react-relay';
import ScrapeUrlBar from './ScrapeUrlBar';
import Recipe from './Recipe';
import ImportRecipeMutation from '../mutations/importRecipe';

class ScrapeRecipe extends React.Component {
    _handleUrlChange = (url) => {
		Relay.Store.update(
			new ImportRecipeMutation({
				url: url,
			})
		);
        /*this.props.relay.setVariables({
            url: url
        });*/
    };

    render () {
        let {recipe: recipe = null} = this.props.viewer;

        return (
			<div>
            	<ScrapeUrlBar handleChange={this._handleUrlChange} />
				<Recipe recipe={recipe} />
			</div>
        );
    }
}

export default Relay.createContainer(ScrapeRecipe, {
    initialVariables: {
        url: ''
    },
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
				recipe(url: $url) {
					${Recipe.getFragment('recipe')}
				}
            }
        `
    }
});
