import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { withWcif } from '../../wcif-context';


class CompetitionScheduleRaw extends Component {

  render() {
    //let { wcif } = this.props;
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
