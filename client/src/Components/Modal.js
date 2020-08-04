/*Implementation of boostrap modal window
When calling parse what you want to show inside the model window as children*/

import React from 'react';
import {connect} from 'react-redux';
import { Modal } from 'react-bootstrap';

class ModalWindow extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show: false,
        };
    }

    show(){
        this.setState({show: true});
    }

    hide(){
        this.setState({ show: false });
    }

    render(){
        return(
            <Modal 
             show={this.state.show} 
             onHide={this.hide.bind(this)} 
             centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                {this.props.children}
            </Modal>
        )
    }
}

export default connect(null, null, null, { forwardRef: true })(ModalWindow);