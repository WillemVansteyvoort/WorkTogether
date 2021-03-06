import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PieChart from 'react-minimal-pie-chart';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import { Progress } from 'react-sweet-progress';
const Timestamp = require('react-timestamp');
import "react-sweet-progress/lib/style.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PopPop from 'react-poppop';
import { Checkbox } from 'pretty-checkbox-react';
import Popup from 'reactjs-popup'

const check = (
    <svg viewBox="0 0 20 20">
        <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style={{ stroke: 'white', fill: 'white' }}></path>
    </svg>
);

import Switch from "react-switch";
import Notification from "../notification";
import Board from 'react-trello-for-timeline'
import {Accordion, AccordionItem, AccordionItemBody, AccordionItemTitle} from "react-accessible-accordion";
import LocalizedStrings from 'localized-strings';
import en from '../lang/en.json';
import nl from '../lang/nl.json';

let strings = new LocalizedStrings({en,nl});
export default class ProjectTasks extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            show: false,
            users: [],
            lists: [],
            tasks: [],
            shortTasks: [],
            timer: 0,
            startTimer: false,
            startTimerId: 0,
            timerList: 0,
            timerTask: 0,

            //new task
            showTask: false,
            task_list: 0,
            task_title: '',
            task_desc: '',
            task_user: 0,
            task_end: '',

            //new list
            list_name: "",

            //edit task
            showEdit: false,
            edit_id: 0,
            edit_i: 0,
            edit_j: 0,
            edit_list: 0,
            edit_title: '',
            edit_desc: '',
            edit_user: '',
            edit_end: '',

            //edit a list
            showEditList: false,
            editList_name: '',
            editList_id: 0,
            editList_i: 0,

            //errors
            error_date: '',

        };
        this.getLists = this.getLists.bind(this);
        this.asDone = this.asDone.bind(this);
        this.initTimer = this.initTimer.bind(this);
        this.timer = this.timer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.makeTask = this.makeTask.bind(this);
        this.makeList = this.makeList.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.editTask = this.editTask.bind(this);
        this.editList = this.editList.bind(this);
        this.deleteList = this.deleteList.bind(this);
    }

    getUsers() {
        axios.post('/api/project/tasks/users', {
            project: window.Laravel.data.project,
        }).then(response => {
            this.setState({
                users: response.data,
            });

        });
    }

    getLists() {
        axios.post('/api/project/tasks/lists', {
            project: window.Laravel.data.project,
        }).then(response => {
            this.setState({
                lists: response.data.lists,
                tasks: response.data.tasks,
                shortTasks: this.state.tasks.filter(function (task) {
                    return task.end_date !== null && (new Date(task.end_date) >= new Date());
                }),
                loading: false,

            });

        });
    }

    initTimer(i, j, id) {
        this.setState({
            startTimer: true,
            startTimerId: id,
            timerList: i,
            timerTask: j,
            timer:   this.state.lists[this.state.timerList].tasks[this.state.timerTask].timer
        })
    }

    timer() {
        if(this.state.startTimer) {
            if((window.Laravel.data.role !== 0 && !window.Laravel.data.end)) {
                let lists = this.state.lists;
                lists[this.state.timerList].tasks[this.state.timerTask].timer += 1;
                this.setState({
                    lists: lists,
                    timer:  (this.state.timer + 1)
                });
            } else {
            }

        }
    }

    stopTimer(taskId, i, j) {
        this.setState({startTimer: false})
        axios.post('/api/project/tasks/timer', {
            project: window.Laravel.data.project,
            task_id: taskId,
            startTimer: false,
            timer: this.state.timer,
        }).then(response => {
            this.setState({
            });

        });
    }

    asDone(taskId, i, j, user_id) {
        if(window.Laravel.data.role !== 0 && !window.Laravel.data.end) {
            if(this.state.lists[i].tasks[j].status) {
                if(confirm("You sure you want to do this?")) {
                    axios.post('/api/project/tasks/done', {
                        project: window.Laravel.data.project,
                        task_id: taskId
                    }).then(response => {
                        let lists = this.state.lists;
                        lists[i].tasks[j].status = 0;
                        this.setState({
                            lists: lists
                        });
                    });
                }
            } else {
                if(window.Laravel.user.id === user_id || user_id === 0) {
                    axios.post('/api/project/tasks/done', {
                        project: window.Laravel.data.project,
                        task_id: taskId
                    }).then(response => {
                        let lists = this.state.lists;
                        lists[i].tasks[j].status = 1;
                        this.setState({
                            lists: lists
                        });
                    });
                } else {
                    alert("This task is not for you");
                }

            }
        } else {
            alert("You have not the permission to do this action");
        }
    }
    makeList(e) {
        e.preventDefault();
        axios.post('/api/project/tasks/list/create', {
            project: window.Laravel.data.project,
            list_name: this.state.list_name,
        }).then(response => {
            this.setState({
                show: false,
                lists: response.data,
            })
        });
    }

    editList(e) {
        e.preventDefault();
        axios.post('/api/project/tasks/list/edit', {
            list_id: this.state.editList_id,
            list_name: this.state.editList_name,
        }).then(response => {
            this.state.lists[this.state.editList_i].name = this.state.editList_name;
            this.setState({
                showEditList: false
            })
        });
    }

    deleteList(e) {
        e.preventDefault();
        axios.post('/api/project/tasks/list/delete', {
            list_id: this.state.editList_id,
        }).then(response => {
            let lists = this.state.lists;
            lists.splice(this.state.editList_i, 1);

            this.setState({
                showEditList: false,
                lists: lists
            })
        });
    }

    makeTask(e) {
        e.preventDefault();
        if(new Date(this.state.task_end) <= new Date()) {
            this.setState({error_date: "Date must be greater than current date"})
        } else {
            axios.post('/api/project/tasks/create', {
                project: window.Laravel.data.project,
                task_title: this.state.task_title,
                task_desc: this.state.task_desc,
                task_list: this.state.task_list,
                task_user: this.state.task_user,
                task_end: this.state.task_end,
            }).then(response => {
                this.setState({
                    showTask: false,
                    lists: response.data,
                })
            });
        }

    }

    deleteTask(taskId, i, j) {
        if(confirm("Are you sure you want to delete this task?")) {
            axios.post('/api/project/tasks/delete', {
                taskId: taskId
            }).then(response => {
                let lists = this.state.lists;
                lists[i].tasks.splice(j, 1);


                this.setState({
                    lists: lists
                });
            });
        }
    }

    editTask(e) {
        e.preventDefault();
        this.setState({showEdit: false})
        axios.post('/api/project/tasks/edit', {
            edit_id: this.state.edit_id,
            edit_list: this.state.edit_list,
            edit_title: this.state.edit_title,
            edit_desc: this.state.edit_desc,
            edit_user: this.state.edit_user,
            edit_end: this.state.edit_end,
        }).then(response => {

            this.setState({
                lists: response.data.lists,
                edit_id: '',
                edit_list: '',
                edit_title: '',
                edit_desc: '',
                edit_user: '',
                edit_end: '',
            });

        });
    }

    componentWillMount() {
        strings.setLanguage(window.Laravel.lang);
        this.getLists();
        this.getUsers();
    }

    componentDidMount() {
            this.interval =  setInterval(() => this.timer(), 1000);
    }

    toggleShow(show) {
        this.setState({show});
    }

    toggleShowEdit(showEdit) {
        this.setState({showEdit});
    }

    toggleShowTask(showTask) {
        this.setState({showTask});
    }

    toggleShowEditList(showEditList) {
        this.setState({showEditList});
    }

    tasks() {

        return (
            <div className="project-tasks">
                <div className="row">
                    <div className="twelve columns">
                        {this.state.tasks.length > 0 ? <h5>{strings.getString("Shortly tasks")}</h5> : ""}
                        {this.state.lists.map((list, i)=> (
                            <span key={i}>
                                        {list.tasks.map((task, j)=> (
                                            <span key={j}>
                                                {task.end_date != null && new Date(task.end_date )> new Date() ?
                                                    <article className="project-tasks-item" key={j}>
                                                        <span onClick={e => this.asDone(task.id, i, j, task.user_id)}><Checkbox shape="round" color="success"  svg={check} checked={task.status}  className="checkbox" style="width: 40px; height: 40px"></Checkbox></span>
                                                        <span  className="title">{task.title}</span>
                                                        <span className="tag tag-second">{task.user_id !== 0 ? task.user.name : strings.getString("Anyone")}</span>
                                                        <div className="float-right actions">
                                                            {task.end_date !== null ? <span className="end"><Timestamp time={task.end_date} precision={2} utc={false} autoUpdate={60}   /></span> : ""}
                                                            <span className="time">{task.timer}"</span>
                                                            {this.state.startTimer ? <a onClick={e => this.stopTimer(task.id, i, j)}><i className="fas fa-pause"> </i></a> : <a onClick={e => this.initTimer(i, j, task.id)}><i className="fas fa-play"> </i></a>}
                                                        </div>
                                                        <div className="clear"> </div>
                                                    </article>
                                                    : ""}
                                            </span>
                                        ))}
                                    </span>
                        ))}
                        <h5>{strings.getString("All lists")}</h5>
                        <Accordion>
                            {this.state.lists.map((list, i)=> (
                                <AccordionItem key={i}>
                                    <AccordionItemTitle>
                                        <i className="far fa-minus-square"> </i> {list.name}
                                        <i className="fas fa-edit float-right project-tasks-deleteList" onClick={event => this.setState({editList_name: list.name, editList_id: list.id, showEditList: true, editList_i: i})}> </i>
                                    </AccordionItemTitle>
                                    <AccordionItemBody>
                                        {list.tasks.map((task, j)=> (
                                            <article className="project-tasks-item" key={j}>
                                                <span onClick={e => this.asDone(task.id, i, j, task.user_id)}><Checkbox shape="round" color="success"  svg={check} checked={task.status}  className="checkbox" style="width: 40px; height: 40px"></Checkbox></span>
                                                <span  className="title">{task.title}</span>
                                                <span className="tag tag-second">{task.user_id !== 0 ? task.user.name : strings.getString("Anyone")}</span>
                                                <div className="float-left">
                                                </div>
                                                <div className="float-right actions">
                                                    {task.end_date !== null ? <span className="end">{new Date(task.end_date) > new Date() ? <Timestamp time={task.end_date} precision={2} utc={false} autoUpdate={60}   /> : <span id="red">Too late</span>}</span> : ""}
                                                    <span className="time">{task.timer}"</span>
                                                    {this.state.startTimer && this.state.startTimerId === task.id  ? <a onClick={e => this.stopTimer(task.id, i, j)}><i className="fas fa-pause"> </i></a> : <a onClick={e => this.initTimer(i, j, task.id)}><i className="fas fa-play"> </i></a>}
                                                    {!window.Laravel.data.ended &&  window.Laravel.data.role !== 0 && (task.user_id === window.Laravel.user.id || window.Laravel.data.role === 2 ||  window.Laravel.data.role === 3 || task.user_id === 0 )?
                                                        <span>
                                                    <i className="fas fa-edit" onClick={event => this.setState({showEdit: true, edit_id: task.id, edit_title: task.title, edit_desc: task.desc, edit_user: task.user_id, edit_end: task.end_date, edit_i: i, edit_j: j})}> </i>
                                                    <i className="fas fa-trash-alt" onClick={event => this.deleteTask(task.id, i, j)}> </i>
                                                        </span>
                                                        : ""}
                                                </div>
                                                <div className="clear"> </div>
                                            </article>
                                        ))}
                                        {list.tasks.length > 0 ? "" : <div className="alert alert-red center-text">{strings.getString("no tasks found")}</div>}
                                        <button className="no-button button button-primary" onClick={event => this.setState({showTask: true, task_list: list.id})}><i className="fas fa-plus"> </i> Add task</button>
                                    </AccordionItemBody>
                                </AccordionItem>
                            ))}

                        </Accordion>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const {showTask} = this.state;
        const {show} = this.state;
        const {showEdit} = this.state;
        const {showEditList} = this.state;

        return (

            <span>
                 <Popup trigger={<button className="project-header-plus no-button no-padding ">
                     <i className="fas fa-question"> </i>
                 </button>} position="top left">
                {close => (
                    <div className="popup-sidebar">
                        <h2>Tasks</h2>
                        <p>With the add-on tasks you can create tasks for a project member. You can assign one to a single member or to everyone.</p>
                        <h5>Make a list</h5>
                        <p>Before you can create tasks, you have to make a task list. You can do this very easily by clicking on the "plus" icon next to the "help" icon.</p>
                        <p className="center-text"><img src="/images/help/icons.JPG" width="150px" /></p>
                        <h5>Make a task</h5>
                        <p>Choose the list where you want to make a task and click on it. Now you will see a list of the current tasks in that list or nothing.</p>
                        <img src="/images/help/taskList.JPG" width="100%"/>
                        <p>At the bottom you click on the button "Add task". Then a popup will appear where you must enter the data for the task: Name, description and the end date.</p>
                        <h5>Completed task</h5>
                        <p>If you want to see a task as completed, click on the bullet to the far left of the task. To set a task "not as done", do the same.</p>
                        <h5>Timer</h5>
                        <p>When you are working on a task you can let a timer run. You can do this by clicking on the "play" icon at the far right of the task. When you're done working on the task, click on the "pause" icon.</p>
                        <p className="center-text"><img src="/images/help/taskTimer.JPG" className="text-center center" width="150px"/></p>
                        <h5>Modify a task</h5>
                        <p>The owner of a task, the leaders or the responsables can modify tasks. You can do this by clicking on the "pencil" icon on the right. If you want to delete a task, click on the "trash" icon on the right. </p>

                        <p><b>See more on the <a href="/docs">documentation</a> page.</b></p>
                    </div>
                )}
                 </Popup>

                 {!window.Laravel.data.ended &&  window.Laravel.data.role !== 0  ?
                <button className="project-header-plus no-button test" onClick={() => this.toggleShow(true)}>
                    <i className="fas fa-plus"> </i>
                </button>
                     : ""}
                <main className="project-main">
                    {this.state.loading ?
                        <div className="project-loading">
                            <div className="loader">Loading...</div>
                        </div>
                        : "" }
                    {((this.state.lists.length === 0) && !this.state.loading)  ?
                        <div className="project-loading">
                            <i className="fas fa-tasks"> </i>
                            <h4>{strings.getString("Nothing to worry!")}</h4>
                        </div>
                        : this.tasks()}
                </main>

                <PopPop
                    open={show}
                    closeOnEsc={true}
                    onClose={() => this.toggleShow(false)}
                    closeOnOverlay={true}>
                    <div className="popup">
                        <div className="popup-titleBar">
                            {strings.getString("Make a new list")}
                            <button className="popup-btn--close"  onClick={() => this.toggleShow(false)}>✕</button>
                        </div>
                        <div className="popup-content">
                            <form onSubmit={event => this.makeList(event)}>
                                <div className="twelve columns">
                                <label>{strings.getString("Name")}</label>
                                <input value={this.state.list_name} onChange={event => this.setState({list_name: event.target.value})} type="text" required={true} />

                            </div>
                            <button className="button-primary button no-button float-right"><i className="fas fa-plus"> </i> {strings.getString("Make list")}</button>
                            </form>
                            </div>
                    </div>
                </PopPop>

                 <PopPop
                     open={showTask}
                     closeOnEsc={true}
                     onClose={() => this.toggleShowTask(false)}
                     closeOnOverlay={true}>
                    <div className="popup">
                        <div className="popup-titleBar">
                            {strings.getString("Make a new task")}
                            <button className="popup-btn--close"  onClick={() => this.toggleShowTask(false)}>✕</button>
                        </div>
                        <div className="popup-content">
                            <form onSubmit={event => this.makeTask(event)}>
                                <div className="twelve columns">
                                <label>{strings.getString("Name")}</label>
                                <input value={this.state.task_title} onChange={event => this.setState({task_title: event.target.value})} type="text" required={true} />
                                <label>{strings.getString("Description")}</label>
                                <textarea value={this.state.task_desc} onChange={event => this.setState({task_desc: event.target.value})}> </textarea>
                                <div className="row">
                                    <div className="six columns">
                                        <label>{strings.getString("Task for")}</label>
                                        <select onChange={event => this.setState({task_user: event.target.value})}>
                                            <option value="0">{strings.getString("Anyone")}</option>
                                            {this.state.users.map((user, j)=> (
                                                <option key={user.id} value={user.id}>{user.name} {user.lastname}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="six columns">
                                        <label>{strings.getString("End date")}</label>
                                        <div id="red">{this.state.error_date}</div>
                                        <input type="datetime-local"  className="u-full-width" value={this.state.task_end} onChange={event => this.setState({task_end: event.target.value})} />
                                    </div>
                                </div>
                            </div>
                            <button className="button-primary button no-button float-right"><i className="fas fa-plus"> </i> {strings.getString("Make task")}</button>
                            </form>
                            </div>
                    </div>
                </PopPop>

                <PopPop
                    open={showEdit}
                    closeOnEsc={true}
                    onClose={() => this.toggleShowEdit(false)}
                    closeOnOverlay={true}>
                    <div className="popup">
                        <div className="popup-titleBar">
                            {strings.getString("Edit a new task")}
                            <button className="popup-btn--close"  onClick={() => this.toggleShowEdit(false)}>✕</button>
                        </div>
                        <div className="popup-content">
                            <form onSubmit={event => this.editTask(event)}>
                                  <div className="twelve columns">
                                <label>{strings.getString("Name")}</label>
                                <input value={this.state.edit_title} onChange={event => this.setState({edit_title: event.target.value})} type="text" required={true} />
                                <label>{strings.getString("Description")}</label>
                                <textarea value={this.state.edit_desc} onChange={event => this.setState({edit_desc: event.target.value})}> </textarea>
                                <div className="row">
                                    <div className="six columns">
                                        <label>{strings.getString("Task for")}</label>
                                        <select onChange={event => this.setState({edit_user: event.target.value})}>
                                            <option value="0" onChange={event => this.setState({edit_user: 0})}>{strings.getString("Anyone")}</option>
                                            {this.state.users.map((user, j)=> (
                                                <option key={user.id} value={user.id}>{user.name} {user.lastname}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="six columns">
                                        <label>{strings.getString("End date")}</label>
                                        <input type="datetime-local" className="u-full-width" value={this.state.edit_end} onChange={event => this.setState({edit_end: event.target.value})} />
                                    </div>
                                </div>
                            </div>
                            <button className="button-primary button no-button float-right"><i className="fas fa-edit"></i> {strings.getString("Edit task")}</button>
                            </form>
                            </div>
                    </div>
                </PopPop>

                <PopPop
                    open={showEditList}
                    closeOnEsc={true}
                    onClose={() => this.toggleShowEditList(false)}
                    closeOnOverlay={true}>
                   <div className="popup">
                        <div className="popup-titleBar">
                           {strings.getString("Edit a list")}
                            <button className="popup-btn--close"  onClick={() => this.toggleShowEditList(false)}>✕</button>
                        </div>
                        <div className="popup-content">
                            <form onSubmit={event => this.editList(event)}>
                                <div className="twelve columns">
                                <label>{strings.getString("Name")}</label>
                                <input value={this.state.editList_name} onChange={event => this.setState({editList_name: event.target.value})} type="text" required={true} />

                            </div>
                            <button className="button-primary button no-button float-left" type="submit"><i className="fas fa-edit"></i> {strings.getString("Edit list")}</button>
                                <button className="button-red button no-button float-right" onClick={event => this.deleteList(event)}><i className="fas fa-trash-alt"></i> {strings.getString("Delete list")}</button>

                            </form>
                            </div>
                    </div>
                </PopPop>
            </span>
        );
    }
}

if (document.getElementById('project-tasks')) {
    ReactDOM.render(<ProjectTasks />, document.getElementById('project-tasks'));
}
