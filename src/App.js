import React, { Component } from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import allIcons from '@fortawesome/fontawesome-free-solid'

import './App.css';
import { MainNav } from './navs/MainNav';
import { UserView, RegistrationsView } from './views/UserViews';
import { ImportWcif } from './views/WcifViews';
import { CompetitionInfoView } from './views/CompetitionViews';

fontawesome.library.add(allIcons)
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: "wcif",
      selected: {
        userId: null,
        group: null,
      },
      wcif: props.wcif,
    };
    if (props.wcif) {
      this.state.activePage = "competition.info";
    }
  }

  loadWcif = fileToLoad => {
    let fr = new FileReader();
    let component = this;
    fr.onload = function(e) {
      component.setState({
        wcif: JSON.parse(e.target.result),
        activePage: "competition.info",
      });
    };
    if (fileToLoad) {
      fr.readAsText(fileToLoad);
      return true;
    } else {
      return false;
    }
  }

  handleStateChange = state => {
    this.setState(state);
  }

  render() {
    //https://github.com/kolodny/immutability-helper
    //look into filereader
    let activeView = null;
    let activePage = this.state.activePage;
    switch (activePage) {
      case "wcif":
      case "wcif.import":
        activeView = <ImportWcif wcif={this.state.wcif} loader={this.loadWcif} />;
        break;
      case "user-profile":
        activeView = <UserView userId={this.state.selected.userId} wcif={this.state.wcif} />;
        activePage = "competition";
        break;
      case "competition.info":
        activeView = <CompetitionInfoView wcif={this.state.wcif} />;
        break;
      case "competition.registrations":
        activeView = <RegistrationsView wcif={this.state.wcif} setter={this.handleStateChange} />;
        break;
      default:
        activeView = <div>"coucou"</div>
        break;
    }
    return (
      <div className="App">
        <header>
          <MainNav wcif={this.state.wcif} activePage={activePage} setter={this.handleStateChange} />
        </header>
        {activeView}
      </div>
    );
  }
}

export default App;
