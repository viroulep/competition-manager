import React, { Component } from 'react';
import { Col, Row, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Calendar } from 'fullcalendar';
import 'fullcalendar-scheduler';

import { RouteWithValidWcif, withWcif } from '../../wcif-context';
import { t } from '../../i18n'
import { getActivitiesForRound, venueWcifFromId, roomWcifFromId } from '../../utils/wcif';
import { activityToFcEvent } from '../../utils/calendar';

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

const NoEventMessage = () => (<p>{t("groups.missing_event")}</p>);

class GroupsForEventRaw extends Component {

  render() {
    let { match, wcif } = this.props;
    let eventId = match.params.eventId;
    let eventWcif = _.find(wcif.events, { id: eventId });
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
    let roundId = match.params.roundId;
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
  // TODO: probably implement componentshouldrender, to prevent re-rendering on event add/rm/mv
  // TODO: look at "editable" "resourceEditable", etc
  // TODO: addresource
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
    this.enableCalendar();
  }

  componentDidUpdate() {
    this.enableCalendar();
  }

  enableCalendar = () => {
    let { wcif, roundActivities } = this.props;
    let byVenue = _.groupBy(roundActivities, "venueId");
    let selectedId = this.state.selectedVenueId === null ? Object.keys(byVenue)[0] : this.state.selectedVenueId;
    let activities = byVenue[selectedId];
    if (activities === undefined || activities.length === 0) {
      return;
    }
    let venueWcif = venueWcifFromId(wcif, selectedId);
    let activitiesDate = new Date(activities[0].activity.startTime);
    let month = activitiesDate.getMonth() + 1;
    let day = activitiesDate.getDate();
    let monthstr = month > 9 ? `${month}` : `0${month}`;
    let daystr = day > 9 ? `${day}` : `0${day}`;
    let calendarEl = document.getElementById('calendar');
    let resources = _.map(activities, function(o) {
      let a = o.activity;
      let roomId = o.roomId;
      let room = roomWcifFromId(wcif.schedule, roomId);
      let resource = {
        id: a.id,
        title: `${a.name} (${room.name})`,
      };
      return resource;
    });
    let events = _.map(activities, function(o) {
      let a = o.activity;
      let eventsForActivity = [{
        ...a,
        resourceId: a.id,
        editable: false,
      }];
      a.childActivities.forEach(function(child) {
        // TODO: check it's a group
        eventsForActivity.push({
          ...child,
          resourceId: a.id,
          name: child.name.replace(a.name, ""),
        });
      });
      return eventsForActivity;
    });
    events = _.flattenDeep(events);
    let theMoment = new Calendar(null);
    let calendar = new Calendar(calendarEl, {
      defaultView: 'timelineDay',
      defaultDate: `${activitiesDate.getFullYear()}-${monthstr}-${daystr}`,
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
          duration: { days: 1 },
          // views that are more than a day will NOT do this behavior by default
          // so, we need to explicitly enable it
          groupByResource: true
            //// uncomment this line to group by day FIRST with resources underneath
            //groupByDateAndResource: true
        }
      },
      // uncomment this line to hide the all-day slot
      allDaySlot: false,
      resources: resources,
      events: events,
      minTime: "07:00:00",
      maxTime: "13:00:00",
      slotDuration: "00:15:00",
      snapDuration: "00:05:00",
      eventDataTransform: (eventData) => activityToFcEvent(eventData, venueWcif.timezone),
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
    console.log("RENDER");
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
      </div>
    );
    // add/remove a group
  }
}


  export const GroupsPanel = withWcif(GroupsPanelFindANewName);
  export const GroupsNav = withWcif(GroupsNavRaw);
  export const GroupsForEvent = withWcif(GroupsForEventRaw);
  export const GroupsForRound = withWcif(GroupsForRoundRaw);
