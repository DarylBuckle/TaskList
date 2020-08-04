import {createStore, applyMiddleware} from 'redux';
import appReducer from '../Reducers/_rootReducer'
import thunk from 'redux-thunk';

export default function configureStore() {
  return createStore(
    appReducer,
    applyMiddleware(thunk)
  );
}