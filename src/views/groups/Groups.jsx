import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { RouteWithValidWcif, withWcif } from '../../wcif-context';
import { t } from '../../i18n'

class GroupsNavRaw extends Component {

  render() {
    let { match, wcif } = this.props;
    let events = wcif.events;
    console.log(events);
    return (
      <div>
        <Row>
          <Col>
            Choose an event to display the groups
            {events.map((e, index) => {
              console.log(e);
              return (<Link key={index} to={`${match.url}/${e.id}`}>{e.id}</Link>);
            })}
          </Col>
        </Row>
        <RouteWithValidWcif path={`${match.path}/:eventId`} component={GroupsForEvent}/>
      </div>
    );
  }
}

class GroupsForEventRaw extends Component {

  render() {
    let { match, wcif } = this.props;
    let eventId = match.params.eventId;
    let eventWcif = _.find(wcif.events, { id: eventId });
    let eventActivities = null;
    return (
      <div>
        <Row>
          <Col>
            You chose {eventId}.
            {eventWcif.rounds.map((r, index) => {
              return (<Link key={index} to={`${match.url}/${r.id}`}>{r.id}</Link>);
            })}
          </Col>
        </Row>
        <RouteWithValidWcif path={`${match.path}/:roundId`} component={GroupsForRound}/>
      </div>
    );
  }
}

class GroupsForRoundRaw extends Component {

  render() {
    let { match, wcif } = this.props;
    let eventId = match.params.eventId;
    let roundId = match.params.roundId;
    let eventWcif = null;
    let eventActivities = null;
    return (
      <Row>
        <Col>
          You chose round {roundId} for {eventId}.
        </Col>
      </Row>
    );
  }
}
export const GroupsNav = withWcif(GroupsNavRaw);
export const GroupsForEvent = withWcif(GroupsForEventRaw);
export const GroupsForRound = withWcif(GroupsForRoundRaw);
