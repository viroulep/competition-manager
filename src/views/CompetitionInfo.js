import React, { Component } from 'react';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import { withWcif } from '../wcif-context';
import { t, l } from '../i18n'


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
            { t("competition.information.date") }
          </Col>
          <Col xs={9} className="text-left">
            <p>
              { t("competition.information.datespan", { startDate: l(startDate), endDate: l(endDate)}) }
            </p>
          </Col>
          <Col xs={3}>
            { t("competition.information.organizers") }
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
