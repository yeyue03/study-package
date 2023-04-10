import Mock from "mockjs";

Mock.mock("/api/mock/user/getMenu", "post", {
  code: 200,
  message: "成功",
  data: [
    {
      key: "01",
      name: "演示",
      path: "/demo",
      childrens: [
        {
          key: "01-01",
          name: "常用页面",
          path: "/demo",
          childrens: [
            {
              key: "01-01-01",
              name: "列表页",
              path: "/demo/list",
              componentName: "DemoList",
              headKey: "01",
              parentKey: "01-01",
            },
            {
              key: "01-01-02",
              name: "详情页",
              path: "/demo/detail",
              componentName: "DemoDetail",
              headKey: "01",
              parentKey: "01-01",
            },
            {
              key: "01-01-03",
              name: "主页02",
              path: "/home/Home02",
              componentName: "Home02",
              headKey: "01",
              parentKey: "01-01",
            },
          ],
        },
        {
          key: "01-02",
          name: "演示",
          path: "/demo",
          childrens: [
            {
              key: "01-02-01",
              name: "表格页面",
              path: "/demo/table",
              componentName: "DemoTable",
              headKey: "01",
              parentKey: "01-02",
            },
            {
              key: "01-02-02",
              name: "按钮拖拽新增",
              path: "/demo/drag",
              componentName: "DemoDrag",
              headKey: "01",
              parentKey: "01-02",
            },
            {
              key: "01-02-03",
              name: "画布",
              path: "/demo/canvas",
              componentName: "DemoCanvas",
              headKey: "01",
              parentKey: "01-02",
            },
          ],
        },
      ],
    },
    {
      key: "02",
      name: "小程序",
      path: "/wx",
      childrens: [
        {
          key: "02-01",
          name: "通用组件",
          path: "/wx",
          childrens: [
            {
              key: "02-01-01",
              name: "首页",
              path: "/wx/home",
              componentName: "WxHome",
              headKey: "02",
              parentKey: "02-01",
            },
            {
              key: "02-01-02",
              name: "地图",
              path: "/wx/map",
              componentName: "WxMap",
              headKey: "02",
              parentKey: "02-01",
            },
          ],
        },
      ],
    },
    {
      key: "03",
      name: "系统设置",
      path: "/settings",
      childrens: [
        {
          key: "03-01",
          name: "系统管理",
          path: "/wx",
          childrens: [
            {
              key: "03-01-01",
              name: "字典",
              path: "/settings/dictionary",
              componentName: "WxHome",
              headKey: "03",
              parentKey: "03-01",
            },
          ],
        },
      ],
    },
    {
      key: "04",
      name: "项目",
      path: "/project",
      childrens: [
        {
          key: "04-01",
          name: "温度湿度",
          path: "/aaa",
          childrens: [
            {
              key: "04-01-01",
              name: "图表",
              path: "/project/charts",
              componentName: "ProjectCharts",
              headKey: "04",
              parentKey: "04-01",
            },
          ],
        },
      ],
    },
  ],
});
