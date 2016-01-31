import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import ScrapeRecipe from './components/ScrapeRecipe';
import AppHomeRoute from './routes/AppHomeRoute';

/*Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:8787')
);*/

ReactDOM.render(
    <Relay.RootContainer
        Component={ScrapeRecipe}
        route={new AppHomeRoute()}
    />,
    document.getElementById('root')
);
