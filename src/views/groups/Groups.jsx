import React, { Component } from 'react';
import { Col, Row, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { RouteWithValidWcif, withWcif } from '../../wcif-context';
import { t } from '../../i18n'
import { getActivitiesForRound, venueWcifFromId } from '../../utils/wcif';
import { Calendar } from 'fullcalendar';
import 'fullcalendar-scheduler';

class GroupsNavRaw extends Component {

  render() {
    let { match, wcif } = this.props;
    let events = wcif.events;
    return (
      <div>
        <Row>
          <Col>
            {events.map((e, index) => {
              return (<Link key={index} to={`${match.url}/${e.id}`}>{e.id}</Link>);
            })}
          </Col>
        </Row>
        <RouteWithValidWcif path={`${match.path}/:eventId`} component={GroupsForEvent}/>
      </div>
    );
  }
}

const NoEventMessage = () => (<p>Can't find this event for the competition.</p>);

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
            { eventWcif ? (
              <div>
                {eventWcif.rounds.map((r, index) => {
                  return (<Link key={index} to={`${match.url}/${r.id}`}>{r.id}</Link>);
                })}
                {eventWcif.rounds.length === 0 &&
                  <p>No round for this event, please edit the event to add round.</p>
                }
              </div>
            ) : (
              <NoEventMessage />
            )}
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
    // Array of { venueId, roomId, activities }
    let roundActivities = getActivitiesForRound(wcif, roundId);
    return (
      <div>
        <h1>Groups for {roundId}</h1>
        <Row>
          <Col>
            <GroupsPanel roundActivities={roundActivities} />
          </Col>
        </Row>
      </div>
    );
  }
}

class GroupsPanelFindANewName extends Component {
  componentWillMount() {
    this.setState({
      selectedVenueId: null,
    });
  }

  updateSelectedVenue = (newId) => {
    this.setState({
      selectedVenueId: newId,
    });
  }

  componentDidMount() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new Calendar(calendarEl, {
      defaultView: 'agendaDay',
      defaultDate: '2018-04-07',
      editable: true,
      selectable: true,
      eventLimit: true, // allow "more" link when too many events
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'agendaDay,agendaTwoDay,agendaWeek,month'
      },
      views: {
        agendaTwoDay: {
          type: 'agenda',
          duration: { days: 2 },
          // views that are more than a day will NOT do this behavior by default
          // so, we need to explicitly enable it
          groupByResource: true
            //// uncomment this line to group by day FIRST with resources underneath
            //groupByDateAndResource: true
        }
      },
        //// uncomment this line to hide the all-day slot
        //allDaySlot: false,
      resources: [
      { id: 'a', title: 'Room A' },
      { id: 'b', title: 'Room B', eventColor: 'green' },
      { id: 'c', title: 'Room C', eventColor: 'orange' },
        { id: 'd', title: 'Room D', eventColor: 'red' }
      ],
      events: [
      { id: '1', resourceId: 'a', start: '2018-04-06', end: '2018-04-08', title: 'event 1' },
      { id: '2', resourceId: 'a', start: '2018-04-07T09:00:00', end: '2018-04-07T14:00:00', title: 'event 2' },
      { id: '3', resourceId: 'b', start: '2018-04-07T12:00:00', end: '2018-04-08T06:00:00', title: 'event 3' },
        { id: '4', resourceId: 'c', start: '2018-04-07T07:30:00', end: '2018-04-07T09:30:00', title: 'event 4' },
        { id: '5', resourceId: 'd', start: '2018-04-07T10:00:00', end: '2018-04-07T15:00:00', title: 'event 5' }
      ],
      select: function(start, end, jsEvent, view, resource) {
        console.log(
            'select',
            start.format(),
            end.format(),
            resource ? resource.id : '(no resource)'
            );
      },
      dayClick: function(date, jsEvent, view, resource) {
        console.log(
            'dayClick',
            date.format(),
            resource ? resource.id : '(no resource)'
            );
      }
    });
    calendar.render();
  }

  render() {
    let { wcif, roundActivities } = this.props;
    let byVenue = _.groupBy(roundActivities, "venueId");
    let selectedId = this.state.selectedVenueId === null ? Object.keys(byVenue)[0] : this.state.selectedVenueId;
    let activities = byVenue[selectedId];
    return (
        <div>
        <FormGroup controlId="formControlsSelect">
        <ControlLabel>Select a venue (venue may have different timezone)</ControlLabel>
        <FormControl componentClass="select" placeholder="select" onChange={e => { this.updateSelectedVenue(e.target.value) }}>
        {Object.keys(byVenue).map((venueId) => {
                                                 let venueWcif = venueWcifFromId(wcif, venueId);
                                                 return (<option key={venueId} value={venueId}>{venueWcif.name}</option>);
                                               })}
        </FormControl>
        </FormGroup>
        <div id="calendar" />
        //a scheduler for each activity in the venue
        //actions to add nested activities
        //groups edition
        </div>
        );
  }
}


export const GroupsPanel = withWcif(GroupsPanelFindANewName);
export const GroupsNav = withWcif(GroupsNavRaw);
export const GroupsForEvent = withWcif(GroupsForEventRaw);
export const GroupsForRound = withWcif(GroupsForRoundRaw);
