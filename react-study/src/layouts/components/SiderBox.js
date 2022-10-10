import React from 'react';
import {  Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const { Sider } = Layout;

const SliderBox = (props) => {
  const { menuList } = props;
  let menuDivList = null;
  if (menuList && menuList.length > 0) {
    menuDivList = menuList[0].childrens.map(item => {
      return {
        key: item.key,
        label: item.name,
        children: item.childrens.map(item => {
          return {
            key: item.key,
            label: item.name,
          }
        })
      }
    })
  }

  const navigate = useNavigate();

  const selectMenu = (e) => {
    const arr = menuList[0].childrens;
    let _obj = null;
    for (const item of arr[0].childrens) {
      if (item.key === e.key) {
        _obj = item;
      }
    }
    console.log("==== select _obj", _obj);
    navigate.push({ pathname: _obj.path, search: 'aa=25' });
  }

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      width={200} 
    >
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{
          borderRight: 0,
        }}
        items={menuDivList}
        onSelect={selectMenu}
      />
    </Sider>
  )
}

// 把state里的数据映射到props里，可以通过Props使用
const mapStateToProps = ({user}) => {
  return {
    menuList: user.menuList
  }
}

export default connect(mapStateToProps)(SliderBox);