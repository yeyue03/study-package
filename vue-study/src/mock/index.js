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
              path: "/demo/dragBtn",
              componentName: "DemoDragBtn",
              headKey: "01",
              parentKey: "01-02",
            },
            {
              key: "01-02-03",
              name: "盒子拖拽排序",
              path: "/demo/dragBox",
              componentName: "DemoDragBox",
              headKey: "01",
              parentKey: "01-02",
            },
            {
              key: "01-02-04",
              name: "盒子放大缩小",
              path: "/demo/scale",
              componentName: "DemoScale",
              headKey: "01",
              parentKey: "01-02",
            },
          ],
        },
        {
          key: "01-03",
          name: "饿了么",
          path: "/demo",
          childrens: [
            {
              key: "01-03-01",
              name: "表格滚轮放底部",
              path: "/demo/elTableScroll",
              componentName: "ElTableScroll",
              headKey: "01",
              parentKey: "01-03",
            },
          ]
        },
        {
          key: "01-04",
          name: "Antd",
          path: "/demo",
          childrens: [
            {
              key: "01-04-01",
              name: "表格滚轮放底部",
              path: "/demo/antdTableScroll",
              componentName: "AntdTableScroll",
              headKey: "01",
              parentKey: "01-04",
            },
          ]
        }
      ],
    },
    {
      key: "02",
      name: "图表",
      path: "/chart",
      childrens: [
        {
          key: "02-01",
          name: "画布",
          childrens: [
            {
              key: "02-01-01",
              name: "坐标轴",
              path: "/chart/canvas",
              componentName: "DemoCanvas",
              headKey: "02",
              parentKey: "02-01",
            },
          ],
        },
        {
          key: "02-02",
          name: "AntV-G2",
          path: "/chart/g2",
          childrens: [
            {
              key: "02-02-01",
              name: "折线图",
              path: "/chart/g2/line",
              componentName: "G2Line",
              headKey: "02",
              parentKey: "02-02",
            },
            {
              key: "02-02-02",
              name: "镜像折线图",
              path: "/chart/g2/mirrorLine",
              componentName: "G2MirrorLine",
              headKey: "02",
              parentKey: "02-02",
            },
            {
              key: "02-02-03",
              name: "tooltip联动",
              path: "/chart/g2/tooltipLine",
              componentName: "G2TooltipLine",
              headKey: "02",
              parentKey: "02-02",
            },
            {
              key: "02-02-04",
              name: "缩放折线图",
              path: "/chart/g2/scaleLine",
              componentName: "G2ScaleLine",
              headKey: "02",
              parentKey: "02-02",
            },
          ],
        },
        {
          key: "02-03",
          name: "Echarts",
          path: "/chart/echarts",
          childrens: [
            {
              key: "02-03-01",
              name: "折线图",
              path: "/chart/echarts/line",
              componentName: "EchartsLine",
              headKey: "02",
              parentKey: "02-03",
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
