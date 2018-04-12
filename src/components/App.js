import React from 'react';
import firebase from 'firebase';
import base from '../utils/base';
import DayLogger from './DayLogger';
import HabitCreator from './HabitCreator';
import HistoryTracker from './HistoryTracker';

class App extends React.Component{
  /**********************************************************
  State Management
  alternative syntax to
  constructor(){ 
    super(); 
    this.state = { ... }
  }
  */
  state = { 
    user: '',
    displayName: '',
    habits: {},
    history: {}
  };

  /**********************************************************
  Save / sync with firebase
  */
  componentDidMount(){
    // const user = localStorage.getItem('user');
    firebase.auth().onAuthStateChanged( userData => {
      if(userData.uid){
        this.userAuth(userData);
      } else {
        localStorage.removeItem('user');
        this.props.history.push('/');
      }
    });
  }

  userAuth = async userData => {
    const user = userData.uid;
    const displayName = userData.displayName;
    localStorage.setItem('user', user);
    this.setState({user, displayName});

    this.habitRef = base.syncState(`${this.state.user}/habits`, {
      context: this,
      state: 'habits'
    });

    this.histRef = base.syncState(`${this.state.user}/history`, {
      context: this,
      state: 'history'
    }); 
  }

  componentWillUnmount(){
    if(this.habitRef){ base.removeBinding(this.habitRef) }
    if(this.histRef){ base.removeBinding(this.histRef) }
  }

  /**********************************************************
  Store user in session storage
  */

  logOut = async () => {
    await firebase.auth().signout();

    // localStorage.clear();
    localStorage.removeItem('user');
    this.props.history.push('/login');
  }

  /**********************************************************
  Updating Items:
  copy state
  update copy
  push copy to state
  */
  changeHabit = (key, newVal) => {
    const updatedHabits = {...this.state.habits};
    updatedHabits[key] = newVal;
    this.setState({habits: updatedHabits});
  }

  removeHabit = (key) => {
    const updatedHabits = {...this.state.habits};
    updatedHabits[key] = null; // set to null instead of delete due to firebase
    this.setState({habits: updatedHabits});
  }

  logHistory = (date, habitKey, didDoIt) => {
    const updatedHistory = {...this.state.history};
    updatedHistory[date] = updatedHistory[date] || {};
    updatedHistory[date][habitKey] = didDoIt || false;
    this.setState({history: updatedHistory});
  }

  render(){
    return (
      <React.Fragment>
      <nav className='nav'>
        <button onClick={this.logOut}>Log Out {this.state.displayName}</button>
      </nav>
        <DayLogger
        habits={this.state.habits}
        history={this.state.history} 
        logHistory={this.logHistory} 
        />
        
        {/* 
        <HistoryTracker 
        habits={this.state.habits}
        history={this.state.history}
         />
         */}
        <HabitCreator
        habits={this.state.habits}
        changeHabit = {this.changeHabit}
        removeHabit = {this.removeHabit}
        />

      </React.Fragment>
      )
    }
  }

  export default App;