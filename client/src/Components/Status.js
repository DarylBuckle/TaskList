/* Renders the status icon and status text*/

import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Status extends React.Component{
    render(){
        var statuscontent = "Unknown Status";
        switch(this.props.id){
            case 0: //not started
                statuscontent = <div><FontAwesomeIcon icon={"circle"} style={{fontSize:"8px"}} size="xs" color={"rgb(125, 166, 206)"}/>{"Not started"}</div>;
                break;
            case 1: //in progress
                statuscontent = <div><FontAwesomeIcon icon={"forward"} size="xs" color={"rgb(10, 97, 255)"}/>{"In progress"}</div>;
                break;
            case 2: //complete
                statuscontent = <div><FontAwesomeIcon icon={"check"} size="xs" color={"rgb(37, 155, 53)"}/>{"Complete"}</div>;
                break;
            default:
                statuscontent = "Unknown Status";
                break;
        }

        return(
            <div className="status-icon">
                {statuscontent}
            </div>
        )
    }
}

export default Status;