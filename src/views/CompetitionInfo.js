import React, { Component } from 'react';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import { withWcif } from '../wcif-context';

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class CompetitionInfoRaw extends Component {

  render() {
    let { wcif } = this.props;
    let startDate = new Date(wcif.schedule.startDate);
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + wcif.schedule.numberOfDays - 1);
    let organizers = _.filter(wcif.persons, function (person) {
      return _.includes(person.roles, "organizer");
    });
    return (
      <div>
        <h1>{wcif.name}</h1>
        <Row>
          <Col xs={3}>
            Date:
          </Col>
          <Col xs={9} className="text-left">
            <p>
              From {startDate.toLocaleDateString('en', dateOptions)} to {endDate.toLocaleDateString('en', dateOptions)}.
            </p>
          </Col>
          <Col xs={3}>
            Organizers:
          </Col>
          <Col xs={9} className="text-left">
            {organizers.map((organizer, index) => {
              let comma = (index === organizers.length - 1) ? "" : ", ";
              return <span key={index}>{organizer.name}{comma}</span>;
            })}
          </Col>
        </Row>
      </div>
    );
  }
}

export const CompetitionInfo = withWcif(CompetitionInfoRaw);
