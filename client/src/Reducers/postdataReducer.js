import * as types from '../Actions/_actionTypes';  
import initialState from './_initialState';  

export default function postdataReducer(state = initialState.postdata, action) {  
  switch(action.type) {
    case types.POST_RESULT:
     state = action.data;
     return state;
    default: 
      return state;
  }
}