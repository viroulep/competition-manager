import React, { Component } from 'react';
import { NavItem, Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import FileSaver from 'file-saver';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { withWcif } from '../wcif-context';

function exportWcif(wcif) {
  var blob = new Blob([JSON.stringify(wcif)], {type: "text/plain;charset=utf-8"});
  FileSaver.saveAs(blob, "wcif.json");
}

class MainNavRaw extends Component {

  render() {
    let { wcif } = this.props;
    return (
      <Nav
        bsStyle="tabs"
        justified
      >
        <NavDropdown id="mainnav-competition" title="Competition">
          <IndexLinkContainer to="/">
            <MenuItem><FontAwesomeIcon icon='info' /> Information</MenuItem>
          </IndexLinkContainer>
          <MenuItem eventKey="competition.events"><FontAwesomeIcon icon='cubes' /> Events</MenuItem>
          <LinkContainer to="/schedule">
            <MenuItem><FontAwesomeIcon icon={['far', 'calendar']} /> Schedule</MenuItem>
          </LinkContainer>
          <LinkContainer to="/registrations">
            <MenuItem><FontAwesomeIcon icon='list-ol' /> Registrations</MenuItem>
          </LinkContainer>
        </NavDropdown>
        <LinkContainer to="/teams">
          <NavItem>
            Teams
          </NavItem>
        </LinkContainer>
        <LinkContainer to="/competition">
          <NavItem>
            Infos
          </NavItem>
        </LinkContainer>
        <NavItem eventKey="groups">
          Groups
        </NavItem>
        <NavItem eventKey="staff-schedule">
          Staff schedule
        </NavItem>
        <NavDropdown eventKey="wcif" id="mainnav-wcif" title="WCIF">
          <LinkContainer to="/import">
            <MenuItem>Import a WCIF</MenuItem>
          </LinkContainer>
          <MenuItem onClick={e => { exportWcif(wcif) }}>Export the current WCIF</MenuItem>
        </NavDropdown>
      </Nav>
    );
  }
}

export const MainNav = withWcif(MainNavRaw);
