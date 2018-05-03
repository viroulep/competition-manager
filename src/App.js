import React, { Component } from 'react';
import fontawesome from '@fortawesome/fontawesome'
import allIcons from '@fortawesome/fontawesome-free-solid'
import allIconsRegular from '@fortawesome/fontawesome-free-regular'

import './App.css';
import { MainNav } from './navs/MainNav';
import { UserProfile } from './views/User';
import { Registrations } from './views/Registrations';
import { ImportWcif } from './views/ImportWcif';
import { WcifUpdater } from './apis/WcifAPI';
import { withWcif, WcifContext } from './wcif-context';
import { CompetitionInfo } from './views/CompetitionInfo';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

fontawesome.library.add(allIcons, allIconsRegular)

const RoutedApp = ({ wcif, basename }) => {
  return (
    <BrowserRouter basename={basename}>
      <App wcif={wcif} />
    </BrowserRouter>
  );
}
const NotFound = withWcif(({ wcif }) => (
  <div>
    <h1>Sorry but there is no matching page.</h1>
    {!wcif &&
      <Redirect to="/import" />
    }
  </div>
));

const RouteWithValidWcif = withWcif(({ wcif, component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    wcif
      ? <Component {...props} />
      : <Redirect to='/import' />
  )} />
));

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      wcif: props.wcif,
      wcifUpdater: new WcifUpdater(this),
    };
  }

  render() {
    //https://github.com/kolodny/immutability-helper
    //look into filereader
    //look into this: https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md
    return (
      <div className="App">
        <WcifContext.Provider value={{ wcif: this.state.wcif, wcifUpdater: this.state.wcifUpdater }}>
          <header>
            <MainNav />
          </header>
          <Switch>
            <RouteWithValidWcif exact path="/" component={CompetitionInfo} />
            <Route exact path='/import' component={ImportWcif}/>
            <RouteWithValidWcif exact path='/users/:userId' component={UserProfile}/>
            <RouteWithValidWcif exact path='/registrations' component={Registrations}/>
            <Route component={NotFound}/>
          </Switch>
        </WcifContext.Provider>
      </div>
    );
  }
}

export default RoutedApp;
