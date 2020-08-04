/* eslint-disable no-throw-literal */
/*
this class handles all interactions with the api via either the Get, Post, Delete methods
Uses Fetch
*/

import CommonFunctions from '../Common/CommonFunctions';

class DataApi {
  static apiRoot(){
    return window.apiurl != null ? window.apiurl : "/api";
  }

  static Get(endpoint,params) {
    var uriparams = CommonFunctions.formatURIParams(params);

    var url = this.apiRoot();

    const request = new Request(url+'/'+endpoint+uriparams, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
      }),
      mode: "cors"
    });

    return fetch(request).then(response => {
        if (response.status === 502 || response.status === 504){
          throw "Request timed out"; 
        }
        if (response.status === 500){
          throw "Error in API"; 
        }
        if (response.ok===true || response.status===400){
          if (response.status === 203){
            return {
              status:203,
              url:response.url,
              message:"Access denied - Authentication is required"
            }
          }
          return response.json();
        }
        var responsemsg = "Get failed for "+endpoint+" - "+response.status + " - "+ response.statusText;
        console.log(responsemsg);
        return responsemsg;       
      }).catch(error => {
        console.log(error);
        return error;
      });

  }

  static Post(endpoint,payload) {
    var url = this.apiRoot();

    const request = new Request(url+'/'+endpoint, {
      method: 'POST',
      mode: "cors",
      headers: new Headers({
        'Content-Type': 'application/json',
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
      }),
      body: JSON.stringify(payload)
    });

    return fetch(request).then(response => {
        if (response.status === 502 || response.status === 504){
          throw "Request timed out"; 
        }
        if (response.status === 500){
          throw "Error in API"; 
        }
        if (response.ok===true){
          if (response.status === 203){
            return {
              status:203,
              url:response.url,
              message:"Access denied - Authentication is required"
            }
          }
          return response.json();
        }
        var responsemsg = "Post failed for "+endpoint+" - "+response.status + " - "+ response.statusText;
        console.log(responsemsg);
        return responsemsg;       
      }).catch(error => {
        console.log(error);
        return error;
      });
  }

  static Delete(endpoint) {

    var url = this.apiRoot();

    const request = new Request(url+'/'+endpoint, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
      }),
    });


    return fetch(request).then(response => {
        if (response.status === 502 || response.status === 504){
          throw "Request timed out"; 
        }
        if (response.status === 500){
          throw "Error in API"; 
        }
        if (response.ok===true || response.status===400){ //400 bad request will have a message
          if (response.status === 203){
            return {
              status:203,
              url:response.url,
              message:"Access denied - Authentication is required"
            }
          }
          return response.json();
        }
        var responsemsg = "Delete failed for "+endpoint+" - "+response.status + " - "+ response.statusText;
        console.log(responsemsg);
        return responsemsg;       
      }).catch(error => {
        console.log(error);
        return error;
      });
  }

}

export default DataApi;