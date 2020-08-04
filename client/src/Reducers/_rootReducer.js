/*
Loads the reducers
*/

import {combineReducers} from 'redux';  
import listdata from './listdataReducer';
import postdata from './postdataReducer';

const appReducer = combineReducers({  
  // short hand property names
  listdata,
  postdata
})

const rootReducer = (state, action) => {
  return appReducer(state, action)
}

export default rootReducer;