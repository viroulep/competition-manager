import React, { Component } from 'react';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import { withWcif } from '../wcif-context';

class ImportWcifRaw extends Component {
  componentWillMount() {
    this.setState({
      currentFile: null,
      error: null,
      didit: false,
    });
  }

  handleFileChange = e => {
    if (e.target.files.length > 0) {
      this.setState({ currentFile: e.target.files[0] });
    } else {
      this.setState({ currentFile: null });
    }
  }

  loadWcif = () => {
    let { wcifUpdater } = this.props;
    let fr = new FileReader();
    let stateSetter = () => {
      this.setState({ didit: true });
    }
    fr.onload = function(e) {
      wcifUpdater.importWcif(JSON.parse(e.target.result), stateSetter);
    };
    if (this.state.currentFile) {
      fr.readAsText(this.state.currentFile);
    } else {
      this.setState({ error: "File is empty." });
    }
  }

  render() {
    return (
      <Row>
        <Col xs={12}>
          {this.props.wcif ? (
            <Alert bsStyle="warning">
              A WCIF is already loaded, importing a WCIF will erase all changes.
            </Alert>
          ) : (
            <Alert bsStyle="info">
              Please load a WCIF to start working on it.
            </Alert>
          )}
        </Col>
        {this.state.error &&
          <Col xs={12}>
            <Alert bsStyle="danger">{this.state.error}</Alert>
          </Col>
        }
        {this.state.didit &&
          <Redirect to="/"/>
        }
        <Col xs={3}>
          Select a file:
        </Col>
        <Col xs={9}>
          <input type="file" accept=".json" onChange={this.handleFileChange} />
        </Col>
        <Col xs={3}>
          <LoadingButton action={this.loadWcif} />
        </Col>
      </Row>
    );
  }
}

export const ImportWcif = withWcif(ImportWcifRaw);

class LoadingButton extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoading: false
    };
  }

  handleClick = () => {
    this.setState({ isLoading: true });
    const { action } = this.props;
    action();
    this.setState({ isLoading: false });
  }

  render() {
    const { isLoading } = this.state;

    return (
      <Button
        bsStyle="primary"
        disabled={isLoading}
        onClick={!isLoading ? this.handleClick : null}
      >
        {isLoading ? 'Loading...' : 'Loading state'}
      </Button>
    );
  }
}
