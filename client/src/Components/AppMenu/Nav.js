/*Renders top nav bar and app logo*/

import React from 'react';

class Nav extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        };
    }

    render(){
        return(
            <div style={{width:"100%"}}>
                <div className="leftnav">
                    <div className="app-icon">
                        <div className="title1">Task</div>
                        <div className="title2">List</div>
                    </div>
                </div>
                <div className="rightnav">
                </div>
            </div>
        );
    }
}

export default Nav;