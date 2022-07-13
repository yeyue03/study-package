import React, { Component } from "react";

class Clock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date()
    }
  }
  
  render() {
    return (
      <div>
        <span>时间：{this.state.date.toLocaleTimeString()}</span>
      </div>
    )
  }

  componentDidMount() {
    this.timeerID = setInterval(() => {
      this.setState({
        date: new Date()
      })
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timeerID);
  }
}

export default Clock;