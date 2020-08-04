/*
generic api calls
*/

import * as types from './_actionTypes';
import CommonFunctions from '../Common/CommonFunctions';
import DataApi from '../Data/DataApi';

var loadListA = {};

export function loadList(use,resource,params) {
    loadListA = CommonFunctions.setupFunctionParams(loadList,arguments);
    var loadListB = CommonFunctions.setupFunctionParams(loadList,arguments);

    var getparams = {};
    if (params != null){
        Object.assign(getparams,params);
    }

    return function (dispatch) {
        return DataApi
            .Get(resource,getparams)
            .then(response => {
                if (loadListA.mainListID === loadListB.mainListID && CommonFunctions.areObjectsEqual(loadListA,loadListB) === false){
                    //this function has been called again since - this is an old request which should be ignored.
                    return;
                }

                if (response!=null && Array.isArray(response)){
                    dispatch({type: types.LIST_LOAD_COMPLETED, data:{use:use,response:response}});
                    return;
                }
                throw response;
            })
            .catch(error => {
                console.log(error);
                window.alert("Load failed. See the console for more information. Reload this page to refresh the list.")
            });
    };
}

export function clearList(use){
    return ({type: types.LIST_LOAD_COMPLETED, data:{use:use,response:null}});
}

export function doPost(use,resource,body) {
    return function (dispatch) {
        return DataApi
            .Post(resource,body)
            .then(response => {
                dispatch({type: types.POST_RESULT, data:{use:use,response:response}});
            })
            .catch(error => {
                console.log(error);
                dispatch({type: types.POST_RESULT, data:{use:use,response:error}});
            });
    };
}

export function clearPostData(){
    return ({type: types.POST_RESULT, data:null});
}