import React, { Component } from 'react'
import withRouter from '../../hoc/withRouter';

class DemoDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>DemoDetail -- {this.props.location.search}</div>
    )
  }
}

export default withRouter(DemoDetail);
