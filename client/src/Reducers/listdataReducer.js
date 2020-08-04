import * as types from '../Actions/_actionTypes';  
import initialState from './_initialState';  

export default function listdataReducer(state = initialState.listdata, action) {  
  switch(action.type) {
    case types.LIST_LOAD_COMPLETED:
     var newstate = {};
     //Copy state so we don't mutate
     Object.assign(newstate,state);
     //Assign result of Get request to state
     newstate[action.data.use] = action.data.response;
     return newstate;
    case types.POST_RESULT:
      //handle result of post. if post use corresponds to a list of data, update the list of data
      var statemod = {};
      Object.assign(statemod,state);
      if (action.data != null && statemod[action.data.use] != null && action.data.response != null && action.data.response.id > 0){
        var itemindex = -1;
        for (var i1 = 0; i1 < statemod[action.data.use].length; i1++){
          if (statemod[action.data.use][i1].id === action.data.response.id){
            itemindex = i1;
            break;
          }
        }
        if (itemindex > -1){
          //edit existing row
          statemod[action.data.use][itemindex] = action.data.response;
        }
        else{
          //add new row
          statemod[action.data.use].push(action.data.response);
        }
      }
      return statemod;
    default: 
      return state;
  }
}