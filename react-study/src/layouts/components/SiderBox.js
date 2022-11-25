import React from 'react';
import {  Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
const { Sider } = Layout;

const SliderBox = (props) => {
  const location = useLocation();
  console.log("==== location", location);

  let { headNavKey, menuList } = props;
  let defaultOpenKeys = '01-01';
  let defaultSelectedKeys = '01-01-01';
  let menuDivList = null;
  let siderMenu = [];

  // 递归循环菜单数组
  const recursionMenu = (list, key, val) => {
    let _obj = {};
    for (const item of list) {
      if (item[key] === val) {
        _obj = item;

      } else if (item.childrens && item.childrens) {
        return recursionMenu(item.childrens, key, val);
      }
    }

    return _obj;
  }

  if (menuList && menuList.length > 0) {
    console.log("=== menuList", menuList);

    if (!defaultSelectedKeys) {
      const pathname = location.pathname;
      const obj = recursionMenu(menuList, 'path', pathname);
      headNavKey = obj.meta?.headKey;
      defaultOpenKeys = obj.meta?.parentKey;
      defaultSelectedKeys = obj.key;

      console.log("=== obj", obj);
    }

    for (const item of menuList) {
      if (item.key === headNavKey) {
        siderMenu = item.childrens;
        break;
      }
    }

    menuDivList = siderMenu.map(item => {
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
    const keyPath = e.keyPath;
    let routeObj = null;
    for (const item of siderMenu) {
      if (item.key === keyPath[1]) {

        for (const obj of item.childrens) {
          if (obj.key === keyPath[0]) {
            routeObj = obj;
            break;
          }
        }
        break;
      }
    }
    navigate({ pathname: routeObj.path, search: 'aa=25' });
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
        defaultSelectedKeys={[defaultSelectedKeys]}
        defaultOpenKeys={[defaultOpenKeys]}
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
    headNavKey: user.headNavKey,
    menuList: user.menuList,
  }
}

export default connect(mapStateToProps)(SliderBox);