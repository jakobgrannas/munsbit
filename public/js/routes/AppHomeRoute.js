import Relay from 'react-relay';

export default class extends Relay.Route {
    static routeName = 'AppHomeRoute';
    static paramDefinitions = {
        url: {required: false},
    };
    static queries = {
        recipe: (Component, variables) => {
            console.log(variables);
            return Relay.QL`
                query RecipeQuery {
                    recipe(url: $url) {
                        ${Component.getFragment('recipe')}
                    }
                }
            `
        }
    };
}
