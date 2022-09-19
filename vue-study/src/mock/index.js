import Mock from 'mockjs';

Mock.mock('/api/mock/user/getMenu', 'post', {
  code: 200,
  message: '成功',
  data: [
    {
      key: '01',
      name: '演示',
      path: '/demo',
      childrens: [
        {
          key: '01-01',
          name: '常用页面',
          path: '/demo',
          childrens: [
            {
              key: '01-01-01',
              name: '列表页',
              path: '/demo/list',
              componentName: 'DemoList',
              navKey: '01',
              parentKey: '01-01',
            },
            {
              key: '01-01-02',
              name: '详情页',
              path: '/demo/detail',
              componentName: 'DemoDetail',
              navKey: '01',
              parentKey: '01-01',
            }
          ]
        },
        {
          key: '01-02',
          name: '测试二',
          path: '/demo',
          childrens: [
            {
              key: '01-02-01',
              name: '表格页面',
              path: '/demo/table',
              componentName: 'DemoTable',
              navKey: '01',
              parentKey: '01-02',
            },
          ]
        }
      ]
    },
    {
      key: '02',
      name: '小程序',
      path: '/wx',
      childrens: [
        {
          key: '02-01',
          name: '通用组件',
          path: '/wx',
          childrens: [
            {
              key: '02-01-01',
              name: '首页',
              path: '/wx/home',
              componentName: 'WxHome',
              navKey: '02',
              parentKey: '02-01',
            },
            {
              key: '02-01-02',
              name: '地图',
              path: '/wx/map',
              componentName: 'WxMap',
              navKey: '02',
              parentKey: '02-01',
            }
          ]
        }
      ]
    }
  ],
})