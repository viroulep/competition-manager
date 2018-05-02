import React, { Component } from 'react';
import _ from 'lodash';
import { Col, Row, Table } from 'react-bootstrap';

function findPersonInWcif(wcif, userId) {
  let titi = _.find(wcif.persons, function(p) {
    return p.wcaUserId === userId;
  });
  return titi;
}

const RegistrationInfo = ({ registration }) => {
  return (
    <Col xs={12}>
      Your registration is {registration.status}, you're registered for <EventsList events={registration.eventIds} />.
    </Col>
  );
}


export class UserView extends Component {
  render() {
    let { userId, wcif } = this.props;
    let personWcif = findPersonInWcif(wcif, userId);
    return (
      <Row>
        <Col xs={12}>
          Hey there { personWcif.name }!
        </Col>
        {personWcif.registration && (
          <RegistrationInfo registration={personWcif.registration} />
        )}
      </Row>
    );
  }
}

export class RegistrationsView extends Component {
  handleRowClick = userId => {
    let { setter } = this.props;
    setter({
      activePage: "user-profile",
      selected: { userId: userId },
    });
  }

  render() {
    let { wcif } = this.props;
    let registeredPersons = _.filter(wcif.persons, function (p) {
      return p.registration;
    });
    return (
      <div>
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Country</th>
              <th>Events</th>
            </tr>
          </thead>
          <tbody>
            {registeredPersons.map((person, index) => {
              return (
                <tr key={index} onClick={() =>  { this.handleRowClick(person.wcaUserId); }}>
                  <td>{index}</td>
                  <td>{person.name}</td>
                  <td>{person.countryIso2}</td>
                  <td><EventsList events={person.registration.eventIds} /></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

const EventsList = ({ events }) => {
  return (
    <span>{events.join(", ")}</span>
  );
}
