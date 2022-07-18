import { Breadcrumb, Layout } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.css';

import HeaderBox from './components/HeaderBox';
import SliderBox from './components/SiderBox';
import ContentBox from './components/ContentBox';

import UserAPI from '@/api/user';
import { setUserinfo } from '@/store/actions/user';

class Layouts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userinfo: {},
      menuList: []
    }
  }

  componentDidMount() {
    this.getLoginInfoFun();
  }

  getLoginInfoFun() {
    UserAPI.GetLoginInfo().then(res => {
      console.log("===== 返回：", res);
      this.setState({
        userinfo: res.data.accountInfoVO,
        menuList: res.data.resourceListVOS
      })

      this.props.setUserinfo(res.data.accountInfoVO)

    }).catch(err => {
      console.log("返回报错：", err);
    })
  }

  render() {
    return (
      <Layout>
        <SliderBox></SliderBox>
        <Layout>
          <HeaderBox></HeaderBox>
          <Layout
            style={{
              padding: '0 24px 24px',
            }}
          >
            <Breadcrumb
              style={{
                margin: '16px 0',
              }}
            >
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <ContentBox></ContentBox>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

// 把state里的数据映射到props里，可以通过Props使用
const mapStateToProps = (state) => {
  return {
    userinfo: state.userinfo
  }
}

// 把action里的方法绑定到props上，可以通过Props使用，用于修改store里的数据
const mapDispatchToProps = (dispatch) => {
  return {
    setUserinfo(userinfo) {
      dispatch(setUserinfo(userinfo));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layouts);