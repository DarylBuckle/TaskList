import * as Moment from 'moment';
import qs from 'query-string';
import 'moment/locale/en-gb';

class CommonFunctions {
    /**
     * Takes location.search and formats to object containing all query string parameters
     * @bgColor string - location.search property
     * @returns object - object containing all query string parameters
     */
    static queryString(search){
        return qs.parse(search);
    }

    /**
     * changes an object into a querystring
     * @params object containing properties
     */
    static formatURIParams(params){
        var getparams = [];
        if (params != null){
          for (var property in params) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(params[property]);
            getparams.push(encodedKey + "=" + encodedValue);
          }
        }
        getparams = getparams.join("&");
        if (getparams!==""){
            getparams = "?"+getparams;
        }
        return getparams;
    }

    /**
     * alters a query string param
     * @oldparams this.props.location.search
     * @newparam_name parameter whose value is to be changed
     * @newparam_value value of the new parameter
     */
    static changeQueryString(oldparams,newparam_name,newparam_value){
        var new_params = oldparams;
        var newparam_name_noequals = newparam_name;
        newparam_name = encodeURI(newparam_name)+"=";

        if (new_params.toLowerCase().includes("?"+newparam_name.toLowerCase()) || new_params.toLowerCase().includes("&"+newparam_name.toLowerCase())){
            var regex = new RegExp("([?|&]" + newparam_name.toLowerCase() + ")[^&]+");
            if (newparam_value==null){
                new_params = new_params.toLowerCase().replace(regex,"");

                if (new_params!=="" && new_params.includes("&") && new_params.includes("?")===false){
                    new_params = new_params.replace("&","?");
                }
            }
            if (regex.test(new_params.toLowerCase())===true){
                new_params = new_params.toLowerCase().replace(regex,'$1'+encodeURIComponent(newparam_value));
            }
            else{
                var regex2 = new RegExp("([?|&]" + newparam_name_noequals.toLowerCase() + ")[^&]+");
                new_params = new_params.toLowerCase().replace(regex2,"$1="+encodeURIComponent(newparam_value));
            }
        }
        else if (newparam_value!=null){
            if (new_params!==""){
                new_params = new_params + "&"+newparam_name.toLowerCase()+encodeURIComponent(newparam_value);
            }
            else{
                new_params = "?"+newparam_name.toLowerCase()+encodeURIComponent(newparam_value);
            }
        }    

        return new_params;
    }

    /**
     * Used to populate an object with the arguments of a function, and later can be compared to an async result to prevent multiple loading of the same function
     * @func_ a function
     * @args arguments
     */
    static setupFunctionParams(func,args){
        var result = {};

        var fnStr = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
        var argnames = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
        if (argnames === null)
            argnames = [];
        
        for (var i=0;i<argnames.length;i++){
            var value = null;
            if (args.length>i){
                value = args[i];
            }
            result[argnames[i]]=value;
        }

        return result;
    }

    /**
     * Determines whether two objects are equal to one another (shallow only - first level of properties are compared)
     * @obj1 an object
     * @obj2 a different object
     */
    static areObjectsEqual(obj1,obj2){
        for(var k in obj1) {
            if (obj1[k]!==obj2[k]){
                return false;
            }
        }
        for(var j in obj2) {
            if (obj1[j]!==obj2[j]){
                return false;
            }
        }
        return true;
    }


    /**
     * Converts a datetime string in ISO format to local date 
     * @ISOstr date time is ISO string format
     * @dateonly boolean for whether to exclude the time
     */
    static ISODateTimeStrToLocalStr(ISOstr){
        if (ISOstr==null || ISOstr===""){
            return "";
        }

        //check year
        var date = new Date(ISOstr);
        if (date.getFullYear()<=1901){
            return "";
        }

        var dateformat = "DD MMM YYYY HH:mm";
        var moment = Moment.utc(ISOstr);
        var result = moment.local().format(dateformat);
        
        return result;
    }
}

export default CommonFunctions;