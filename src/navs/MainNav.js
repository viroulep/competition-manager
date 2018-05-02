import React, { Component } from 'react';
import { NavItem, Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import FileSaver from 'file-saver';

function exportWcif(wcif) {
  var blob = new Blob([JSON.stringify(wcif)], {type: "text/plain;charset=utf-8"});
  FileSaver.saveAs(blob, "wcif.json");
}

export class MainNav extends Component {

  render() {
    let { activePage, setter, wcif } = this.props;
    let handlePageChange = function(key) {
      if (key === "wcif.export") {
        exportWcif(wcif);
      } else {
        setter({ activePage: key });
      }
    };
    return (
      <Nav
        bsStyle="tabs"
        justified
        activeKey={activePage}
        onSelect={handlePageChange}
      >
        <NavDropdown eventKey="competition" id="mainnav-competition" title="Competition">
          <MenuItem eventKey="competition.info">Information</MenuItem>
          <MenuItem eventKey="competition.events">Events</MenuItem>
          <MenuItem eventKey="competition.schedule">Schedule</MenuItem>
          <MenuItem eventKey="competition.registrations">Registrations</MenuItem>
        </NavDropdown>
        <NavItem eventKey="staff-teams">
          Staff teams
        </NavItem>
        <NavItem eventKey="groups">
          Groups
        </NavItem>
        <NavItem eventKey="staff-schedule">
          Staff schedule
        </NavItem>
        <NavDropdown eventKey="wcif" id="mainnav-wcif" title="WCIF">
          <MenuItem eventKey="wcif.import">Import a WCIF</MenuItem>
          <MenuItem eventKey="wcif.export">Export the current WCIF</MenuItem>
        </NavDropdown>
      </Nav>
    );
  }
}
