import React from 'react';
import CommonFunctions from '../Common/CommonFunctions';
import MainScreen from '../Components/MainScreen';
import Modal from '../Components/Modal';
import Status from '../Components/Status';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TaskDetails from './TaskDetails';

const key = "tasks";
const resource = "Task";

class TaskList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedData: null
        }
    }
    
    use(){
        //unique key for current list - listdata is an object that can contain multiple lists (arrays), this is the property that this list will be stored in
        return key + CommonFunctions.formatURIParams(this.params);
    }

    params(){
        return {
            //if include_completed!=false tasks that have been completed will be returned in the get request
            //hide complete by default
            include_completed: this.props.location.search.toLowerCase().includes("include_completed=true")
        };
    }

    noData(){
        //returned when get requests returns 0 rows.
        return(
            <div>
                {"You do not have any Tasks yet."}
                <br/>
                <Button variant={"primary"} style={{marginTop:"20px"}} onClick={this.newClick.bind(this)}>
                    <FontAwesomeIcon icon={"plus"}/>
                    {"Create a new Task"}
                </Button>
            </div>
        )
    }

    newClick(){
        this.setState({selectedData:null});
        this._details.show(); //calls show on the modal component which will render taskdetails
    }

    rowClick(rowData){
        this.setState({selectedData:rowData});
        this._details.show(); //calls show on the modal component which will render taskdetails
    }

    render(){
        var use = this.use();

        return(
            <div>
                {/* MainScreen will render the list*/}
                <MainScreen 
                    key={key}
                    use={use}
                    resource={resource} 
                    params={this.params()} 
                    location={this.props.location}
                    title={"Tasks"}
                    newcaption={"Add Task"}
                    noData={this.noData.bind(this)}
                    newClick={this.newClick.bind(this)}
                    canedit={true}
                    rowClick={this.rowClick.bind(this)}
                    columns={[
                        {
                            Header: "Task ID",
                            accessor: d => d.id
                        },
                        {
                            Header: "Task Name",
                            accessor: d => d.name,
                            style: {maxWidth: "150px"}
                        },
                        {
                            Header: "Description",
                            accessor: d => d.description,
                            style: {maxWidth: "400px"}
                        },
                        {
                            Header: "Date/time created",
                            accessor: d => CommonFunctions.ISODateTimeStrToLocalStr(d.date_created)
                        },
                        {
                            Header: "Status",
                            accessor: d => <Status id={d.status_id} />
                        },
                    ]}
                >
                </MainScreen>
                <Modal 
                    ref={instance => {this._details = instance}}
                    title={this.state.selectedData == null ? "Add Task" : "Edit Task"}
                >
                    <TaskDetails 
                        resource={resource} 
                        use={use} 
                        data={this.state.selectedData}
                        onClose={() => { this._details.hide(); this.setState({selectedData:null}); }}
                    />
                </Modal>
            </div>
        );
    }
}


export default TaskList;