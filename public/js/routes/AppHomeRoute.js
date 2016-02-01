import Relay from 'react-relay';

export default class extends Relay.Route {
    static routeName = 'AppHomeRoute';
    static queries = {
        viewer: (Component, variables) => Relay.QL`
                query ViewerQuery {
                    viewer {
                        ${Component.getFragment('viewer')}
                    }
                }
            `
    };
}
