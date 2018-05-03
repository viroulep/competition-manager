import React, { Component } from 'react';
import _ from 'lodash';
import { Table } from 'react-bootstrap';
import { withWcif } from '../wcif-context';
import { Link } from 'react-router-dom'

class RegistrationsRaw extends Component {
  // TODO: regarder là https://github.com/drminnaar/react-redux-quotlify/blob/master/src/components/favoriteQuotes/FavoriteQuotes.js
  handleRowClick = userId => {

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
                <tr key={index}>
                  <td>{index}</td>
                  <td>
                    <Link to={`/users/${person.wcaUserId}`}>
                      {person.name}
                    </Link>
                  </td>
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

export const Registrations = withWcif(RegistrationsRaw);

const EventsList = ({ events }) => {
  return (
    <span>{events.join(", ")}</span>
  );
}
