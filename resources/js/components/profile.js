import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import { Progress } from 'react-sweet-progress';
const Timestamp = require('react-timestamp');
import {ProgressBar} from "reprogressbars";
import PulseLoader from "./company/company";
import {Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody,} from 'react-accessible-accordion';
import LocalizedStrings from 'localized-strings';
import en from './lang/en.json';
import nl from './lang/nl.json';

let strings = new LocalizedStrings({en,nl});
export default class Profile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: window.Profile.user[0].name + " " + window.Profile.user[0].lastname,
            avatar: window.Profile.user[0].avatar,
            overlay: false,
            activities: window.Profile.user[0].activities,
            groups:  window.Profile.user[0].groups,
            //activities
            currentPage: 1,
            activitiesPerPage: 6,
            perPage: 7
        };
        this.handleClick = this.handleClick.bind(this);

    }

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    componentWillMount() {
        strings.setLanguage(window.Laravel.lang);

    }

    render() {
        const { activities, currentPage, activitiesPerPage } = this.state;

        // Logic for displaying current todos
        const indexOfLastTodo = currentPage * activitiesPerPage;
        const indexOfFirstTodo = indexOfLastTodo - activitiesPerPage;
        const currentTodos = activities.slice(indexOfFirstTodo, indexOfLastTodo);

        const renderActivities = currentTodos.map((activity, i) => {
            return (
                <div key={i} className="dashboard-activities-item">
                    <div className="user-profile-activity">
                        {activity.type === 0 ? <span>Has created the project <a>{activity.project.name}</a></span> :""}
                        {activity.type === 2 ? <span>Has created a new note in <a>{activity.project.name}</a></span> :""}
                        {activity.type === 3 ? <span>Has created a new thread in <a>{activity.project.name}</a></span> :""}
                        {activity.type === 4 ? <span>Has replied on a thread in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 5 ? <span>Has created a new task list in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 6 ? <span>Has created a new tak in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 7 ? <span>Has verified a task as done in <a>{activity.project.name}</a></span> :""}
                        {activity.type === 8 ? <span>Has reopened a task  in <a>{activity.project.name}</a></span> :""}
                        {activity.type === 9 ? <span>Has edited a task in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 10 ? <span>Has deleted a task in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 11 ? <span>Has deleted a note in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 12 ? <span>Has deleted a thread  in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 13 ? <span>Has edited a thread  in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 14 ? <span>Has edited a reply in <a>{activity.project.name}</a></span> :""}
                        {activity.type === 15 ? <span>Has deleted a reply  in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 16 ? <span>Has created a new card on the board  in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 17 ? <span>Has deleted a card from the board in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 18 ? <span>Has edited a card from the board in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 19 ? <span>Has created a new poll in <a>{activity.project.name}</a></span> :""}
                        {activity.type === 20 ? <span>Has voted on a poll in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 21 ? <span>Has deleted his vote on a poll  in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 22 ? <span>Has edited a poll in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 23 ? <span>Has deleted a poll  in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 24 ? <span>Has created a new log in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 25 ? <span>Has deleted a log  in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 26 ? <span>Has created a new crisis-item in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 27 ? <span>Has deleted a crisis-item  in  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 28 ? <span>Has modified a crisis-item in <a>{activity.project.name}</a></span> :""}
                        {activity.type === 29 ? <span>Has solved a crisis-item in <a>{activity.project.name}</a></span> :""}
                        {activity.type === 31 ? <span>Has added {activity.content} to  <a>{activity.project.name}</a></span> :""}
                        {activity.type === 32 ? <span>Has deleted {activity.content} in <a>{activity.project.name}</a></span> :""}
                        {activity.type === 33 ? <span>Has modified the roll of {activity.content} in <a>{activity.project.name}</a></span> :""}
                        {activity.type === 34 ? <span>Has edited the project <a>{activity.project.name}</a></span> :""}
                        {activity.type === 35 ? <span>Has closed the project <a>{activity.project.name}</a></span> :""}
                        {activity.type === 36 ? <span>Has reopened the project <a>{activity.project.name}</a></span> :""}

                    </div>
                </div>
            )
        });


        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(activities.length / activitiesPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <div className="pagination"  key={number} id={number} onClick={this.handleClick}>
                    {number}
                </div>
            );
        });
        return (
            <div className="user-profile">
                <div className="row">
                    <div className="four columns">
                        <div className="user-profile-left">
                            <img src={this.state.avatar} />
                            <h5>{strings.getString("Last seen")}</h5>
                            <span className="tag tag-primary"> <Timestamp className="seen" time={new Date(window.Profile.user[0].last_activity)} precision={3} utc={true} autoUpdate={60}  /></span>
                            <h5>{strings.getString("In company since")}</h5>
                            <span className="tag tag-primary"> <Timestamp className="seen" time={new Date(window.Profile.user[0].created_at)} precision={1} utc={true} autoUpdate={60}  /></span>

                            <div className="user-profile-socialmedia">
                                {window.Profile.user[0].twitter ?  <a href={"https://www.twitter.com/" + window.Profile.user[0].twitter}><i className="fab fa-twitter float-left"> </i></a> : ""}
                                {window.Profile.user[0].facebook ?  <a><i className="fab fa-facebook float-left"> </i></a> : ""}

                            </div>
                            </div>
                    </div>
                    <div className="eight columns">
                        <div className="user-profile-info">
                            <h4><i className="fas fa-circle online"> </i>{this.state.name}</h4>
                            <blockquote><p>{window.Profile.user[0].biografy ? window.Profile.user[0].biografy : strings.getString("This user don't have a description of his own")}</p></blockquote>
                            <div className="user-profile-groups">
                                {this.state.groups.map((group, i)=> (
                                    <span className="tag tag-second" key={i}>{group.name}</span>
                                ))}
                            </div>
                            <Tabs
                                className="tabs"
                                defaultTab="two"
                            >
                                <TabList>
                                    <Tab tabFor="one" className="projects-tab"><i className="fas fa-eye"> </i> {strings.getString("Last activities")} </Tab>
                                    <Tab tabFor="two" className="projects-tab"><i className="fas fa-user"></i> {strings.getString("About")}</Tab>
                                </TabList>
                                <TabPanel tabId="one">
                                    {renderActivities}
                                    {renderPageNumbers}
                                    {this.state.activities.length === 0 ? "No activities no show" : ""}
                                </TabPanel>
                                <TabPanel tabId="two">
                                    <h5>{strings.getString("Contact information")}</h5>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <th>{strings.getString("Phone")}:</th>
                                            <td></td>
                                            <td>{window.Profile.user[0].phone ? window.Profile.user[0].phone : <i>No number</i>}</td>
                                        </tr>
                                        <tr>
                                            <th>Email</th>
                                            <td></td>
                                            <td>{window.Profile.user[0].email ? <a href={"mailto:" + window.Profile.user[0].email}>{window.Profile.user[0].email}</a> : <i>No email</i>}</td>
                                        </tr>
                                        <tr>
                                            <th>{strings.getString("Address")}:</th>
                                            <td></td>
                                            <td>{window.Profile.user[0].street ?  window.Profile.user[0].street + ", " + window.Profile.user[0].city.zipcode + " " + window.Profile.user[0].city.name + " " + window.Profile.user[0].city.country.name : <i>No address</i>}</td>
                                        </tr>
                                        <tr>
                                            <th>Website:</th>
                                            <td></td>
                                            <td>{window.Profile.user[0].website ? <a href={"mailto:" + window.Profile.user[0].website}>{window.Profile.user[0].website}</a> : <i>No website</i>}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <h5>{strings.getString("Basic information")}</h5>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <th>{strings.getString("Birthdate")}:</th>
                                            <td></td>
                                            <td>{window.Profile.user[0].birthdate ? window.Profile.user[0].birthdate : <i>No birthdate</i>}</td>
                                        </tr>
                                        <tr>
                                            <th>{strings.getString("Username")}:</th>
                                            <td></td>
                                            <td>{window.Profile.user[0].username ?window.Profile.user[0].username.toLowerCase() : <i>No username</i>}</td>
                                        </tr>
                                        <tr>
                                            <th>Website:</th>
                                            <td></td>
                                            <td>{window.Profile.user[0].website ? <a href={"mailto:" + window.Profile.user[0].website}>{window.Profile.user[0].website}</a> : <i>No website</i>}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById('user-profile')) {
    ReactDOM.render(<Profile />, document.getElementById('user-profile'));
}
