/* eslint-disable no-extend-native */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './Store/configureStore';
import { Provider } from 'react-redux';
import { BrowserRouter as Router} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTasks, faPlus, faCheck, faForward, faCircle } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

library.add(faTasks, faPlus, faCheck, faForward, faCircle, faEdit);

export const store = configureStore(); 

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
, document.getElementById('root'));

//in IE, string does not contain include - add it.
if (!String.prototype.includes) {
    String.prototype.includes = function() {
        // eslint-disable-next-line strict
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
} 

serviceWorker.unregister();
