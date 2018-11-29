import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import PopPop from 'react-poppop';
import ReactPasswordStrength from '@rodrigowpl/react-password-strength';
import { ProgressBar } from 'reprogressbars';
import Switch from "react-switch";
export default class PopupNewUser extends Component {


    constructor(props) {
        super(props)
        this.state = {
            show: false,
            users: [],
            created: false,
            leader: 1,
            name: '',
            description: '',





        };
        //bind
        this.getUsers = this.getUsers.bind(this);
        this.makeGroup = this.makeGroup.bind(this);
    }


    getUsers() {
        axios.get('/api/company/users').then((
            response
            ) =>
                this.setState({
                    users: response.data,})
        );
    }

    makeGroup() {
        axios.post('/api/group/new', {
            leader: this.state.leader,
            name: this.state.name,
            description: this.state.description,
        }).then(response => {
            this.setState({
                isLoading: false,
                created: true,
                leader: 1,
                name: '',
                description: '',
            });
        });
    }

    componentWillMount() {
        this.getUsers();
    }

    componentDidMount() {
        // this.interval =  setInterval(() => this.getUsers(), 30000);
    }

    componentWillUnmount() {
        // clearInterval(this.interval);
    }



    //popup
    toggleShow(show) {
        this.setState({show});
    }

    render() {
        const {show} = this.state;
        return (
            <div>
                <button onClick={() => this.toggleShow(true)} className="button-primary button no-button"><i className="fas fa-plus"> </i> New group</button>
                <PopPop
                    open={show}
                    closeOnEsc={true}
                    onClose={() => this.toggleShow(false)}
                    closeOnOverlay={true}>
                    <div className="popup">
                        <div className="popup-titleBar">
                            Make a new group
                            <button className="popup-btn--close"  onClick={() => this.toggleShow(false)}>✕</button>
                        </div>
                        <div className="popup-content">
                            {this.state.created ?<div className="alert alert-green center-text">The group is succesfully created</div> : ""}
                            <div className="row">
                                    <div className="six columns">
                                        <label>Group name</label>
                                        <input type="text" value={this.state.name}  onChange={e => this.setState({ name: e.target.value })}  />
                                    </div>
                                    <div className="six columns">
                                        <label>Group leader</label>
                                        <select  onChange={e => this.setState({ leader: e.target.value })} >
                                            {this.state.users.map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <label>Group description</label>
                                <textarea  onChange={e => this.setState({ description: e.target.value })} >{this.state.description}</textarea>
                                <button className="button-primary button no-button" onClick={this.makeGroup}>Make group</button>
                        </div>
                    </div>
                </PopPop>
            </div>
        );
    }
}

if (document.getElementById('popup-newUser')) {
    ReactDOM.render(<PopupNewUser />, document.getElementById('popup-newUser'));
}