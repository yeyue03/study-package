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
          path: '/demo/common',
          childrens: [
            {
              key: '01-01-01',
              name: '列表页',
              path: '/demo/common/table',
            },
            {
              key: '01-01-02',
              name: '详情页',
              path: '/demo/common/detail',
            }
          ]
        },
        {
          key: '01-02',
          name: '测试二',
          path: '/demo/common',
          childrens: [
            {
              key: '01-02-01',
              name: '列表页二',
              path: '/demo/common/table',
            },
            {
              key: '01-02-02',
              name: '详情页二',
              path: '/demo/common/detail',
            }
          ]
        }
      ]
    },
    {
      key: '02',
      name: '菜单二',
      path: '/demo',
      childrens: [
        {
          key: '02-01',
          name: '菜单二sub',
          path: '/demo/common',
          childrens: [
            {
              key: '02-01-01',
              name: '无1',
              path: '/demo/common/table',
            },
            {
              key: '02-01-02',
              name: '无2',
              path: '/demo/common/detail',
            }
          ]
        }
      ]
    }
  ],
})