/* This class loads and renders all lists
    Required props;
        use: a unique identifier for the list
        resource: the endpoint of the web api
        params: an object with properties which will be sent as uri params to the web api
        columns: an array of columns to show
            - Header: the column title
            - accessor: a function to render the cell value
*/

import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as apiActions from '../Actions/apiActions';
import Loading from './Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class List extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loaded: false
        };
    }

    componentDidMount(){
        this.reset();
    }

    componentDidUpdate(prevProps,prevState){
        if (prevProps.use !== this.props.use){
            this.props.apiActions.clearList(prevProps.use);
            this.reset();
        }
        else if (this.state.loaded === false && this.props.listdata[this.props.use] != null){
            this.setState({loaded:true});
        }
    }

    reset(){
        var hasloaded = false;
        this.setState({loaded:hasloaded});
        this.getData();
    }

    getData(){
        this.props.apiActions.loadList(
            this.props.use,
            this.props.resource,
            this.props.params,
        );
    }

    
    render() {
        var data = this.props.listdata[this.props.use];
        var cols = this.props.columns == null ? [] : this.props.columns;
        var extracols = [];
        if (this.props.canedit){
            extracols.push({
                Header: "",
                style:{border:"none"}
            });
        }

        if (this.state.loaded === false || data == null){
            return <Loading style={{marginTop:"150px"}}/>;
        }

        if (data == null || data.length === 0){
            return (
                <div className="no-data">
                    {this.props.noData != null ? this.props.noData() :
                        "No rows found"
                    }
                </div>
            )
        }

        return (
            <div className={"table-container"}>
                <table>
                    <thead>
                        <tr>
                            {cols.concat(extracols).map((col) => { return <th key={"tablerowheader_"+col.Header} title={col.Header} className={"oneline"} scope="col" style={col.style}>{col.Header}</th> })}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(this.renderRow.bind(this,cols))}
                    </tbody>
                </table>
            </div>
        );
    }


    renderRow(cols,obj){
        var rowdata = [];

        for(var i1 = 0; i1 < cols.length; i1++){
            var value = cols[i1].accessor(obj);
            rowdata.push(
                <td key={"tablerow_"+obj.id+"_"+i1} className={"oneline"} style={cols[i1].style}>
                    {value}
                </td>
            );
        }

        if (this.props.canedit === true){
            rowdata.push(
                <td key={"tablerow_"+obj.id+"_E"} className="edit-link">
                    <div>
                        <FontAwesomeIcon icon={["far","edit"]} />
                        {"EDIT"}
                    </div>
                </td>
            );
        }

        return <tr key={"tablerow_"+obj.id} onClick={this.props.rowClick != null ? this.props.rowClick.bind(this, obj) : null}>{rowdata}</tr>
    }
}

function mapDispatchToProps(dispatch) {
    return {
        apiActions: bindActionCreators(apiActions,dispatch)
    };
}

const mapStateToProps = (state) => ({
    listdata: state.listdata
});

export default connect(mapStateToProps, mapDispatchToProps)(List);