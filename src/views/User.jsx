import React, { Component } from 'react';
import _ from 'lodash';
import { Col, Row } from 'react-bootstrap';
import { withWcif } from '../wcif-context';

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


class UserRaw extends Component {
  render() {
    let { match, wcif } = this.props;
    let personWcif = findPersonInWcif(wcif, match.params.userId);
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

export const UserProfile = withWcif(UserRaw);


const EventsList = ({ events }) => {
  return (
    <span>{events.join(", ")}</span>
  );
}
