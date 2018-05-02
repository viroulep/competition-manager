import React, { Component } from 'react';
import { Row, Col, Button, Alert } from 'react-bootstrap';

export class ImportWcif extends Component {
  componentWillMount() {
    this.setState({
      currentFile: null,
      error: null,
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
    let { loader } = this.props;
    if (!loader(this.state.currentFile)) {
      this.setState({ error: "File is empty." });
    }
  }

  render() {
    let disclaimer, error = null;
    if (this.props.wcif) {
      disclaimer = (<Col xs={12}>
        <Alert bsStyle="warning">
          A WCIF is already loaded, importing a WCIF will erase all changes.
        </Alert>
      </Col>);
    }
    if (this.state.error) {
      error = (
        <Col xs={12}>
          <Alert bsStyle="danger">{this.state.error}</Alert>
        </Col>
      );
    }
    return (
      <Row>
        {disclaimer}
        {error}
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
    let didit = action();
    if (!didit) {
      this.setState({ isLoading: false });
    }
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
