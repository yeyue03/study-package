import { Layout } from 'antd';
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
      Content
    </Content>
  )
}

export default ContentBox;
