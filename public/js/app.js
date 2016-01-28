import 'babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Recipe from './components/Recipe';
import AppHomeRoute from './routes/AppHomeRoute';

ReactDOM.render(
    <Relay.RootContainer
        Component={Recipe}
        route={new AppHomeRoute(/*{url: "http://www.recept.nu/mitt-kok/roy-fares/saffransbullar-med-fordeg/"}*/)}
    />,
    document.getElementById('root')
);
