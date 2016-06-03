import React from 'react';
import Relay from 'react-relay';
import ScrapeUrlBar from './ScrapeUrlBar';
import Recipe from './Recipe';
import ImportRecipeMutation from '../mutations/importRecipe';

class ScrapeRecipe extends React.Component {
    _handleUrlChange = (url) => {
		Relay.Store.commitUpdate(
			new ImportRecipeMutation({
				url: url,
				user: this.props.viewer.user
			})
		);
    };

    render () {
        const {user} = this.props.viewer;
		const recipe = null;

        return (
			<div>
            	<ScrapeUrlBar handleChange={this._handleUrlChange} />
				<Recipe recipe={recipe} />
			</div>
        );
    }
}

export default Relay.createContainer(ScrapeRecipe, {
    /*initialVariables: {
        url: ''
    },*/
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
				user {
					id,
					userId
				}
            }
        ` //${ImportRecipeMutation.getFragment('recipe')}
    }
});
