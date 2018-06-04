import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';


import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { composeWithDevTools } from 'remote-redux-devtools';

import reducer from './js/components/reducers';



let store = createStore (reducer, composeWithDevTools(applyMiddleware(thunk)));

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
)


AppRegistry.registerComponent('bizon', () => RNRedux);





//AppRegistry.registerComponent('tproj1', () => App);
