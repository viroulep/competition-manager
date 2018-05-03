import React, { Component } from 'react';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import { withWcif } from '../../wcif-context';

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class CompetitionScheduleRaw extends Component {

  render() {
    let { wcif } = this.props;
    return (
      <div>
        <h1>Schedule</h1>
        <Row>
          <Col xs={12}>
            <div id="calendar" />
          </Col>
        </Row>
      </div>
    );
  }
}

export const CompetitionSchedule = withWcif(CompetitionScheduleRaw);