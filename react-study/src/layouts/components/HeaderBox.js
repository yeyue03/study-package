import { Layout, Menu } from 'antd';
import { connect } from 'react-redux';
const { Header } = Layout;

const items1 = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const HeaderBox = () => {
  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      <Menu mode="horizontal" defaultSelectedKeys={['2']} items={items1} />
    </Header>
  )
}

// 把state里的数据映射到props里，可以通过Props使用
const mapStateToProps = (state) => {
  return {
    userinfo: state.userinfo
  }
}

export default connect(mapStateToProps)(HeaderBox);
