import { Layout, Menu } from 'antd';
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

export default HeaderBox;
