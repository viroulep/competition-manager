import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const WcifContext = React.createContext({
  wcif: null,
  wcifUpdater: () => {},
});

// This function takes a component...
export function withWcif(Component) {
  // ...and returns another component...
  return function ComponentWithWcif(props) {
    // ... and renders the wrapped component with the wcif theme!
    // Notice that we pass through any additional props as well
    return (
      <WcifContext.Consumer>
        {({ wcif, wcifUpdater }) => <Component {...props} wcif={wcif} wcifUpdater={wcifUpdater} />}
      </WcifContext.Consumer>
    );
  };
}

export const RouteWithValidWcif = withWcif(({ wcif, component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    wcif
      ? <Component {...props} />
      : <Redirect to='/import' />
  )} />
));
