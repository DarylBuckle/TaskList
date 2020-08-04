//Render the left-hand side menu

import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const menubuttons = [
    {
        key: "tasks",
        name: "Tasks",
        basepath: "/tasks",
        path: "/tasks",
        icon: "tasks"
    }
]

class AppMenu extends React.Component{   
    renderIcon(obj){
        var selected = this.props.location.pathname.toLowerCase() === obj.basepath;
        var extrastyle = {};
        if (obj.name.length > 8){
            extrastyle.fontSize = "9px";
        }

        return(
            <Link key={"appmenu-"+obj.key} to={obj.path} onClick={this.onLinkClick.bind(this)}>
                <div className={selected ? "menu-option selected" : "menu-option"} style={extrastyle}>
                    <div>
                        <FontAwesomeIcon icon={obj.icon} size="2x"/>
                    </div>
                    {obj.name}
                </div>
            </Link>
        )
    }

    onLinkClick(){
        for(var i1 = 0; i1 < menubuttons.length; i1++){
            if (menubuttons[i1].basepath === this.props.location.pathname.toLowerCase()){
                menubuttons[i1].path = this.props.location.pathname + this.props.location.search;
            }
        }
    }

    render(){
        return(
            <aside className="sidebar">
                {menubuttons.map(this.renderIcon.bind(this))}
            </aside>
        );
    }
}

export default withRouter(AppMenu);