import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import { setHeadNavKey } from '@/store/actions/user';
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

    const selectMenu = (e) => {
      this.props.setHeadNavKey(e.key);
    }

    return (
      <Header className="site-layout-background" style={{ padding: 0 }}>
        <Menu mode="horizontal" theme='dark' defaultSelectedKeys={defaultSelectedKeys} items={navList} onSelect={selectMenu} />
      </Header>
    )
  }
}

// 把state里的数据映射到props里，可以通过Props使用
const mapStateToProps = ({ user }) => {
  return {
    menuList: user.menuList,
    headNavKey: user.headNavKey
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setHeadNavKey(key) {
      dispatch(setHeadNavKey(key));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBox);
