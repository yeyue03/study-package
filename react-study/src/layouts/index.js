import { Layout } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.css';

import HeaderBox from './components/HeaderBox';
import SliderBox from './components/SiderBox';
import ContentBox from './components/ContentBox';

import UserAPI from '@/api/user';
import { setUserinfo, setMenu } from '@/store/actions/user';

class Layouts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userinfo: {},
      menuList: []
    }
  }

  componentDidMount() {
    this.getMenuFun();
  }

  getMenuFun() {
    UserAPI.GetMenu().then(res => {
      this.setState({
        menuList: res.data
      })

      this.props.setMenu(res.data)

    }).catch(err => {
      console.log("返回报错：", err);
    })
  }

  render() {
    return (
      <Layout className='layout-wrap'>
        <SliderBox></SliderBox>
        <Layout>
          <HeaderBox></HeaderBox>
          <Layout
            style={{
              padding: '20px',
            }}
          > 
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
    },
    setMenu(menuList) {
      dispatch(setMenu(menuList))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layouts);