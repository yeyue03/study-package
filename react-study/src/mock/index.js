import Mock from 'mockjs';

// 模拟延迟 即几秒后返回数据
Mock.setup({
  timeout: 100
})

Mock.mock('/api/system/login/ignore/getLoginInfo', () => {
  return Mock.mock({
    code: 200,
    message: "操作成功",
    data: {
      "id": 119,
      "username": "hezhen",
      "languageRecord": "zh-CN",
      "zoneCode": null,
      "changePasswordFlag": 1,
      "accountType": 0,
      "nickName": "何真",
      "saleAreaFlag": true,
      "saleAreaCodes": [70102, 70101]
    }
  })
})

Mock.mock('/api/mock/user/getMenu', () => {
  return Mock.mock({
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
                meta: {
                  name: '列表页',
                  headKey: '01',
                  parentKey: '01-01'
                }
              },
              {
                key: '01-01-02',
                name: '详情页',
                path: '/demo/detail',
                meta: {
                  name: '详情页',
                  headKey: '01',
                  parentKey: '01-01'
                }
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
                path: '/demo/table',
              },
              {
                key: '01-02-02',
                name: '详情页二',
                path: '/demo/detail',
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
                path: '/demo/table',
              },
              {
                key: '02-01-02',
                name: '无2',
                path: '/demo/detail',
              }
            ]
          }
        ]
      }
    ],
  })
})