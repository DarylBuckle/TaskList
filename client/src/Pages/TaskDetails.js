import React from "react";
import FormBuilder from "../Components/Form/FormBuilder";
import Status from '../Components/Status';

class TaskDetails extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){ 
        return(
            <FormBuilder
                {...this.props}
                formfields={[
                    {
                        id: "name",
                        label: "Task Name",
                        placeholder: "e.g \" Review test plan\"",
                        type: "text",
                        maxLength: 100,
                        required: true,
                        autoFocus: true
                    },
                    {
                        id: "description",
                        label: "Description",
                        placeholder: "Enter a description which accurately describes the task (max. 1,000 characters)",
                        type: "memo",
                        maxLength: 1000,
                        rows: 5,
                        required: true
                    },
                    {
                        id: "status_id",
                        label: "Status",
                        type: "select",
                        defaultValue:0,
                        required: true,
                        isSearchable: false,
                        openMenuOnFocus: true,
                        options:[
                            {
                                value: 0,
                                label: <Status id={0} />
                            },
                            {
                                value: 1,
                                label: <Status id={1} />
                            },
                            {
                                value: 2,
                                label: <Status id={2} />
                            }
                        ],
                        group_style: {width: "200px"}
                    },
                ]}
            />
        );
    }
}

export default TaskDetails;