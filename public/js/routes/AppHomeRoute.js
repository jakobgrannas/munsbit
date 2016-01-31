import Relay from 'react-relay';

export default class extends Relay.Route {
    static routeName = 'AppHomeRoute';
    static paramDefinitions = {
        userId: {required: false},
    };
	static params: {
	    userId: "0",
	};
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
