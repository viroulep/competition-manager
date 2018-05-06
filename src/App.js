import React, { Component } from 'react';
import fontawesome from '@fortawesome/fontawesome'
import allIcons from '@fortawesome/fontawesome-free-solid'
import allIconsRegular from '@fortawesome/fontawesome-free-regular'

import { MainNav } from './navs/MainNav';
import { UserProfile } from './views/User';
import { Registrations } from './views/Registrations';
import { ImportWcif } from './views/ImportWcif';
import { WcifUpdater } from './apis/WcifAPI';
import { withWcif, WcifContext, RouteWithValidWcif } from './wcif-context';
import { CompetitionInfo } from './views/CompetitionInfo';
import { CompetitionSchedule } from './views/schedule/CompetitionSchedule';
import { GroupsNav } from './views/groups/Groups';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import { IntlProvider } from 'react-intl';
import { localesData } from './i18n'
import { initElementsIds } from './utils/wcif';

// npm rebuild node-sass
import './scss/App.scss';
import 'fullcalendar/dist/fullcalendar.min.css';
import 'fullcalendar-scheduler/dist/scheduler.min.css';

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

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      locale: "en",
      wcif: props.wcif,
      wcifUpdater: new WcifUpdater(this),
    };
    if (props.wcif) {
      initElementsIds(props.wcif.schedule.venues);
    }
  }

  render() {
    //https://github.com/kolodny/immutability-helper
    //look into filereader
    //look into this: https://github.com/reactjs/redux/blob/master/docs/introduction/Examples.md
    //dragula
    //fullcalendar v4 alpha
    //demos:https://github.com/fullcalendar/fullcalendar/blob/jquery-removal/demos/locales.html
    return (
      <IntlProvider locale={this.state.locale}
                    key={this.state.locale}
                    defaultLocale="en"
                    messages={localesData[this.state.locale]}
      >
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
              <RouteWithValidWcif exact path='/schedule' component={CompetitionSchedule}/>
              <RouteWithValidWcif path='/groups' component={GroupsNav}/>
              <Route component={NotFound}/>
            </Switch>
          </WcifContext.Provider>
        </div>
      </IntlProvider>
    );
  }
}

export default RoutedApp;
