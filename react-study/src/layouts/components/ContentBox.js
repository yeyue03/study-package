import DemoHome from '../../views/demo/Home';
import DemoList from '../../views/demo/List';
import DemoDetail from '../../views/demo/Detail';

import { Layout } from 'antd';
import { Route, Routes } from 'react-router-dom';
const { Content } = Layout;

const ContentBox = () => {
  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
      }}
    >
      <Routes>
        <Route path="/" element={<DemoHome />}></Route>
        <Route path="/demo/list" element={<DemoList aa="33" />}></Route>
        <Route path="/demo/detail" element={<DemoDetail />}></Route>
      </Routes>
    </Content>
  )
}

export default ContentBox;
