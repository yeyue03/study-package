// test.ts

import { MockMethod } from 'vite-plugin-mock';
const getRandom = () => {
  return Math.floor(Math.random() * 100)
}

export default [
  {
    url: '/user/menu',
    method: 'GET',
    response: () => {
      return {
        code: 0,
        data: {
          name: '这是mocka',
        },
      };
    },
  },
  {
    url: '/device/myList', // 设备列表
    method: 'get',
    response: () => {
      return [
        {
          id: 1,
          ip: '10.24.175.52',
          port: '8080',
          type: 'type',
          serialNo: 'NSSED001',
          defineName: '自定义设备名称自定义设备名称',
          url: '/test',
          alarmType: '电话', // 报警类型
          isTemperature: true, // 是否有温度
          temperatureStart: 5,
          temperatureEnd: 70,
          isHumidity: true, // 是否有湿度
          humidityStart: 10,
          humidityEnd: 60,
          isBeam: true, // 是否有光照
          beamStart: 12,
          beanEnd: 72,
          isLink: true, // 是否链接
        },
        {
          id: 2,
          ip: '10.24.175.52',
          port: '8080',
          type: 'type',
          serialNo: 'sdfdf02',
          defineName: '设备名称',
          url: '/test',
          alarmType: '邮件', // 报警类型
          isTemperature: true, // 是否有温度
          temperatureStart: 5,
          temperatureEnd: 68,
          isHumidity: true, // 是否有湿度
          humidityStart: 15,
          humidityEnd: 65,
          isBeam: true, // 是否有光照
          beamStart: 10,
          beanEnd: 72,
          isLink: false, // 是否链接
        },
        {
          id: 3,
          ip: '10.24.175.52',
          port: '8080',
          type: 'type',
          serialNo: 'sdfdf02',
          defineName: '无光照设备',
          url: '/test',
          alarmType: '邮件', // 报警类型
          isTemperature: true, // 是否有温度
          temperatureStart: 5,
          temperatureEnd: 68,
          isHumidity: true, // 是否有湿度
          humidityStart: 15,
          humidityEnd: 65,
          isBeam: false, // 是否有光照
          beamStart: 10,
          beanEnd: 72,
          isLink: true, // 是否链接
        }
      ];
    },
  },
  {
    url: '/deviceData/lineChart', // 实际曲线数据,
    method: 'GET',
    response: () => {
      return [{
        "panelType": "temperature",
        "date": "2023-06-04 20:12",
        "value": 8,
        "realValue": 10,
        "bandMax": 11,
        "bandMin": 5
      }, {
        "panelType": "humidity",
        "date": "2023-06-04 20:12",
        "value": 17,
        "realValue": 15,
        "bandMax": 21,
        "bandMin": 12
      }, {
        "panelType": "beam",
        "date": "2023-06-04 20:12",
        "value": 28,
        "realValue": 25,
        "bandMax": 30,
        "bandMin": 23
      }, {
        "panelType": "temperature",
        "date": "2023-06-04 20:13",
        "value": 21,
        "realValue": 23,
        "bandMax": 24,
        "bandMin": 18
      }, {
        "panelType": "humidity",
        "date": "2023-06-04 20:13",
        "value": 32,
        "realValue": 30,
        "bandMax": 36,
        "bandMin": 27
      }, {
        "panelType": "beam",
        "date": "2023-06-04 20:13",
        "value": 15,
        "realValue": 25,
        "bandMax": 17,
        "bandMin": 10
      }, {
        "panelType": "temperature",
        "date": "2023-06-04 20:28",
        "value": 21,
        "realValue": 28,
        "bandMax": 26,
        "bandMin": 17
      }, {
        "panelType": "humidity",
        "date": "2023-06-04 20:28",
        "value": 32,
        "realValue": 25,
        "bandMax": 34,
        "bandMin": 27
      }, {
        "panelType": "beam",
        "date": "2023-06-04 20:28",
        "value": 15,
        "realValue": 20,
        "bandMax": 19,
        "bandMin": 13
      }, {
        "panelType": "temperature",
        "date": "2023-06-04 20:43",
        "value": 21,
        "realValue": 24,
        "bandMax": 26,
        "bandMin": 17
      }, {
        "panelType": "humidity",
        "date": "2023-06-04 20:43",
        "value": 32,
        "realValue": 20,
        "bandMax": 34,
        "bandMin": 27
      }, {
        "panelType": "beam",
        "date": "2023-06-04 20:43",
        "value": 15,
        "realValue": 15,
        "bandMax": 19,
        "bandMin": 13
      }, {
        "panelType": "temperature",
        "date": "2023-06-04 20:58",
        "value": 21,
        "realValue": 18,
        "bandMax": 26,
        "bandMin": 17
      }, {
        "panelType": "humidity",
        "date": "2023-06-04 20:58",
        "value": 32,
        "realValue": 25,
        "bandMax": 34,
        "bandMin": 27
      }, {
        "panelType": "beam",
        "date": "2023-06-04 20:58",
        "value": 15,
        "realValue": 20,
        "bandMax": 19,
        "bandMin": 13
      }]
    }
  },
  {
    url: '/plan/getByDeviceId', // plan详情数据
    method: 'GET',
    response: () => {
      return {
        id: 1,
        isRun: false,
        standardType: 'temperature',
        settings: `[{"id":"lagkRiUwl8NGvpwwMSqNY","icon":"icon-yuyueguanli","date":"2023-06-04 20:12","btnType":"reservation"},{"id":"936WnIX2LpaCUoq6TA-hn","btnType":"value","temperature":{"id":"TXfiXuxTO0v4i2ZJO0VOB","icon":"icon-wendu","duration":1,"startValue":8,"endValue":21,"powerSize":"2","valueType":"range","index":"01","btnType":"value","panelType":"temperature","isShowBand":true,"isShowMaxBandInput":false,"bandMax":3,"isShowMinBandInput":false,"bandMin":-3,"isShowTimeInput":false},"humidity":{"id":"IHMAIuFwmv_PP5cfF007u","icon":"icon-shidu","duration":1,"startValue":17,"endValue":32,"powerSize":"2","valueType":"range","index":"01","btnType":"value","panelType":"humidity","isShowBand":true,"isShowMaxBandInput":false,"bandMax":4,"isShowMinBandInput":false,"bandMin":-5},"beam":{"id":"pUMg0ihZIb_n8Z_iUg9It","icon":"icon-guangzhao","duration":1,"startValue":28,"endValue":15,"powerSize":"2","valueType":"range","index":"01","btnType":"value","panelType":"beam","isShowBand":true,"isShowMaxBandInput":false,"bandMax":2,"isShowMinBandInput":false,"bandMin":-5},"powerSize":"2","duration":1},{"id":"QtoyvPAlxeywMavJHcZ3B","icon":"icon-jiantou10","loop":3,"isRightLoop":false,"btnType":"loop","timestamp":1685880704894},{"id":"w4gYDXIpVUl7sqgQAhuk4","btnType":"value","temperature":{"id":"pxiGjA3lkv57qhDDDTmKA","icon":"icon-wendu","duration":15,"startValue":21,"endValue":21,"powerSize":"","valueType":"constant","index":"02","btnType":"value","panelType":"temperature","isShowBand":true,"isShowMaxBandInput":false,"bandMax":5,"isShowMinBandInput":false,"bandMin":-4,"isShowTimeInput":false,"isShowEndValInput":false},"humidity":{"id":"pwoZ6NBAWcjX60q0FXIb8","icon":"icon-shidu","duration":15,"startValue":32,"endValue":32,"powerSize":"","valueType":"constant","index":"02","btnType":"value","panelType":"humidity","isShowBand":true,"isShowMaxBandInput":false,"bandMax":2,"isShowMinBandInput":false,"bandMin":-5,"isShowEndValInput":false},"beam":{"id":"3P64gOuaFLzY5za8vU5-T","icon":"icon-guangzhao","duration":15,"startValue":15,"endValue":15,"powerSize":"","valueType":"constant","index":"02","btnType":"value","panelType":"beam","isShowBand":true,"isShowMaxBandInput":false,"bandMax":4,"isShowMinBandInput":false,"bandMin":-2,"isShowEndValInput":false},"powerSize":"","duration":15},{"id":"a5PnDV2PD5gA0Ph1u84hq","icon":"icon-jiantou16","loop":3,"isRightLoop":true,"btnType":"loop","timestamp":1685880704894,"isshowLoopInput":false}]`
      }
    }
  }
] as MockMethod[];
