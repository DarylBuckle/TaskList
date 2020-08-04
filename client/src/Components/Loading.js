/* Renders css loader - pulse bubble*/

import React from 'react';

class Loading extends React.Component{
    render(){
        return(
            <div className="spinner-box" style={this.props.style}>
                <div className="pulse-container">  
                    <div className="pulse-bubble pulse-bubble-1"></div>
                    <div className="pulse-bubble pulse-bubble-2"></div>
                    <div className="pulse-bubble pulse-bubble-3"></div>
                </div>
            </div>
        )
    }
}

export default Loading;