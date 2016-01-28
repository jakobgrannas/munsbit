import React from 'react';
import Relay from 'react-relay';

class Recipe extends React.Component {
    _handleUrlChange = (e) => {
        this.props.relay.setVariables({
            url: e.target.value ? e.target.value : ''
        });
    }

    render () {
        let {title} = this.props.recipe || '';
        let {url} = this.props.relay.variables;

        console.log(url);

        return (
            <div>
                <p>{title}</p>
                <input type="text" value={url} onChange={this._handleUrlChange} />
            </div>
        );
    }
}

export default Relay.createContainer(Recipe, {
    initialVariables: {
        url: ''
    },
    fragments: {
        recipe: () => Relay.QL`
            fragment on Recipe {
                id,
                title
            }
        `
    }
});
