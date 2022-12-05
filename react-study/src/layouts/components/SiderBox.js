import React from 'react';
import {  Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { pushNavTab } from '../../store/actions/navTag';
const { Sider } = Layout;

const SliderBox = (props) => {
  const location = useLocation();

  let { headNavKey, menuList } = props;
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState('');

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
    console.log("=== selectedKeys", selectedKeys);

    if (!selectedKeys) {
      const pathname = location.pathname;
      const routeObj = recursionMenu(menuList, 'path', pathname);
      headNavKey = routeObj.meta?.headKey;
      setOpenKeys( [routeObj.meta?.parentKey] );
      setSelectedKeys(routeObj.key);

      props.pushNavTab({
        path: location.pathname,
        key: routeObj.key,
        ...routeObj.meta
      })
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

  // SubMenu 展开/关闭的回调
  const onOpenChange = arr => {
    setOpenKeys(arr);
  }

  // 选中菜单
  const selectMenu = (e) => {
    const keyPath = e.keyPath;
    setSelectedKeys(e.key);
    console.log("==");

    const routeObj = recursionMenu(menuList, 'key', keyPath[0]);
    props.pushNavTab({
      path: location.pathname,
      key: routeObj.key,
      ...routeObj.meta
    })
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
        selectedKeys={[selectedKeys]}
        openKeys={openKeys}
        style={{
          borderRight: 0,
        }}
        items={menuDivList}
        onSelect={selectMenu}
        onOpenChange={onOpenChange}
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

const mapDispatchToProps = (dispatch) => {
  return {
    pushNavTab(obj) {
      dispatch(pushNavTab(obj))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SliderBox);