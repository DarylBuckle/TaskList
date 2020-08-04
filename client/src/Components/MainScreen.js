/* Container for List.js. Renders the page title, buttons.
Passes props to List.js so MainScreen needs all of List's props*/

import React from 'react';
import List from './List';
import {connect} from 'react-redux';
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class MainScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        };
    }

    render(){
        var data = this.props.listdata[this.props.use];

        return(
            <div style={{position:"relative"}}>
                <div className="mainscreen">
                    <div className="list-header">
                        <div className="list-title">
                            {this.props.title}
                        </div>
                        <div className="list-title-count">
                            {data != null && data.length > 0 ? "(" + data.length + ")" : null}
                        </div>
                        <div className="list-controls">
                            {this.props.newcaption == null || this.props.newClick == null ? null :
                                <Button variant={"primary"} onClick={(e) => { this.props.newClick(e); } }>
                                    <FontAwesomeIcon icon={"plus"}/>
                                    {this.props.newcaption}
                                </Button>
                            }
                        </div>
                    </div>
                    <List {...this.props} use={this.props.use} location={this.props.location}/>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

const mapStateToProps = (state) => ({
    listdata: state.listdata
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);