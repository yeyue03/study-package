import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux';
const { Header } = Layout;

class HeaderBox extends Component {
  render() {
    const { menuList } = this.props;
    const navList = menuList.map(item => {
      return {
        key: item.key,
        label: item.name
      }
    })
    const defaultSelectedKeys = ['01'];

    return (
      <Header className="site-layout-background" style={{ padding: 0 }}>
        <Menu mode="horizontal" theme='dark' defaultSelectedKeys={defaultSelectedKeys} items={navList} />
      </Header>
    )
  }
}

// 把state里的数据映射到props里，可以通过Props使用
const mapStateToProps = ({user}) => {
  return {
    menuList: user.menuList
  }
}

export default connect(mapStateToProps)(HeaderBox);
