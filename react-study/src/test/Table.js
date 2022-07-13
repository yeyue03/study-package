import React, { Component } from 'react';

class Table extends Component {
  state = {
    name: '测试'
  }

  render() {
    const characters = this.props.characters;
    const changeName = (index) => {
      this.setState({
        name: 'aaa' + index
      })
    }

    const rows = characters.map((row, index) => {
      return (
        <tr key={index}>
          <td>{row.name}</td>
          <td>{row.job}</td>
          <td>
            <button onClick={() => changeName(index)}>点击</button>
          </td>
        </tr>
      )
    })

    return (
      <table>
        <thead>
          <tr>
            <th>{this.state.name}</th>
            <th>Job</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

export default Table;