/* This class renders and saves all forms
    Required props;
        use: a unique identifier for the list (the list will be updated afterwards)
        resource: the endpoint of the web api
        params: an object with properties which will be sent as uri params to the web api
        data: if null then taken as a new object, if not null an update to the specified object
        formfields: an array fields
            - id: the field name
            - type: field type (text/memo/select)
            - defaultValue: defaultValue for new fields
            - label: label text for the field
            - placeholder: placeholder for the field
            - options: (select only) the lookup options (value and label properties)
*/

import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form } from 'react-bootstrap';
import * as apiActions from '../../Actions/apiActions';
import Select from 'react-select';

class FormBuilder extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value:null,
            originalValue: null,
            haschanged: false,
            issaving: false
        };
    }

    componentDidMount(){
        var currvalue = {};
        var haschanged = false;

        if (this.props.data == null){
            //We are adding a new record.
            //Populate currrvalue based on formfield defaultValues
            for(var i1 = 0; i1 < this.props.formfields.length; i1++){
                var field = this.props.formfields[i1];
                if (field.defaultValue != null){
                    currvalue[field.id] = field.defaultValue;
                }
            }

            //allow new record submission without changing anything
            haschanged = true;
        }
        else{
            //Updating an existing record, use current values
            Object.assign(currvalue,this.props.data);
        }

        this.setState({value: currvalue, originalValue: this.props.data, haschanged: haschanged});
    }

    componentDidUpdate(prevProps){
        if (this.state.issaving && prevProps.postdata == null && this.props.postdata != null && this.props.postdata.use === this.props.use){
            //post response has came back
            this.setState({issaving: false});

            if (this.props.postdata.response != null && this.props.postdata.response.id > 0){
                //post succesful
                //close screen
                //list will be updated by the listdata reducer using the post result
                if (this.props.onClose != null){
                    this.props.onClose();
                }
            }
            else{
                //save failed
                //extract error message and display alert
                var failmsg = "Unable to save data.";
                if (this.props.postdata.response.Message != null){
                    //400 Bad Request Message
                    failmsg += " " + this.props.postdata.response.Message;
                }
                else if (typeof this.props.postdata.response === "string"){
                    failmsg += " " + this.props.postdata.response;
                }
                else{
                    console.log(this.props.postdata.response);
                    failmsg += " Check the console for more details";
                }
                window.alert(failmsg);
            }

            //clean up postdata reducer as we are done with it.
            this.props.apiActions.clearPostData();
        }
    }

    onChangeText(target,e){
        this.onChange(target,e.target.value);
    }

    onChangeSelect(target,sel){
        this.onChange(target,sel == null ? null : sel.value);
    }

    onChange(target,newvalue){
        //a field value has been changed - modify the field in this.state.value

        var valuemod = {};
        Object.assign(valuemod,this.state.value);
        valuemod[target] = newvalue;
        this.setState({value:valuemod,haschanged:true});
    }

    onCancel(){
        this.setState({value: this.state.originalValue, haschanged: false});
        if (this.props.onClose != null){
            this.props.onClose();
        } 
    }

    onSubmit(event){
        //posts to the api

        var objectToSubmit = this.state.value;
        this.setState({issaving:true});
        this.props.apiActions.doPost(this.props.use, this.props.resource, objectToSubmit);

        event.preventDefault();
        return false;
    }

    render(){
        return(
            <Form onSubmit={this.onSubmit.bind(this)} disabled={this.state.issaving}>
                {this.props.formfields.map(this.renderField.bind(this))}
  
                <div className="form-btns">
                    <Button variant="primary" type="submit" disabled={!this.state.haschanged || this.state.issaving}>
                        {this.state.issaving ? "Saving" : this.props.data == null ? "Add" : "Update"}
                    </Button>
                    <Button variant="secondary" onClick={this.onCancel.bind(this)}>
                        {"Cancel"}
                    </Button>
                </div>
            </Form>
        )
    }

    renderField(field){
        var control = <div>{"Unknown Field Type"}</div>;
        var value = this.state.value == null ? null : this.state.value[field.id];
        var disabled = this.state.issaving === true ? true : field.disabled === true;

        switch (field.type){
            case "text":
                control = <Form.Control {...field} type="text" value={value == null ? "" : value} disabled={disabled} onChange={this.onChangeText.bind(this,field.id)}/>;
                break;
            case "memo":
                control = <Form.Control {...field} as="textarea" value={value == null ? "" : value} disabled={disabled} onChange={this.onChangeText.bind(this,field.id)}/>;
                break;
            case "select":
                var valuemod = null;
                if (value != null){
                    for (var i1 = 0; i1 < field.options.length; i1++){
                        if (field.options[i1].value === value){
                            valuemod = field.options[i1];
                            break;
                        }
                    }
                }
                control = <Select {...field} value={valuemod} options={field.options} isDisabled={disabled} onChange={this.onChangeSelect.bind(this,field.id)} />;
                break;
            default:
                control = <div>{"Unknown Field Type"}</div>;
                break;
        }
        
        return (
            <Form.Group key={"formfield_"+field.id} style={field.group_style}>
                {field.label != null ? <Form.Label>{field.label}</Form.Label> : null}
                {control}
            </Form.Group>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        apiActions: bindActionCreators(apiActions,dispatch)
    };
}

const mapStateToProps = (state) => ({
    postdata: state.postdata
});

export default connect(mapStateToProps, mapDispatchToProps)(FormBuilder);