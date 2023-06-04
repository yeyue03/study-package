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
      return [
        {
          id: Math.random(),
          date: '2023-06-01 10:00',
          temperature: getRandom(),
          humidity: getRandom(),
          setTemperature: getRandom(),
          setHumidity: getRandom()
        },
        {
          id: Math.random(),
          date: '2023-06-02 10:00',
          temperature: getRandom(),
          humidity: getRandom(),
          setTemperature: getRandom(),
          setHumidity: getRandom()
        },
        {
          id: Math.random(),
          date: '2023-06-03 10:00',
          temperature: getRandom(),
          humidity: getRandom(),
          setTemperature: getRandom(),
          setHumidity: getRandom()
        },
        {
          id: Math.random(),
          date: '2023-06-04 10:00',
          temperature: getRandom(),
          humidity: getRandom(),
          setTemperature: getRandom(),
          setHumidity: getRandom()
        },
        {
          id: Math.random(),
          date: '2023-06-05 10:00',
          temperature: getRandom(),
          humidity: getRandom(),
          setTemperature: getRandom(),
          setHumidity: getRandom()
        },
      ]
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
        settings: `[{"id":"lagkRiUwl8NGvpwwMSqNY","icon":"icon-yuyueguanli","date":"2023-06-04 20:12","btnType":"reservation"},{"id":"936WnIX2LpaCUoq6TA-hn","btnType":"value","temperature":{"id":"TXfiXuxTO0v4i2ZJO0VOB","icon":"icon-wendu","duration":1,"startValue":10,"endValue":20,"powerSize":"1","valueType":"range","index":"01","btnType":"value","panelType":"temperature","isShowBand":true,"isShowMaxBandInput":false,"bandMax":3,"isShowMinBandInput":false,"bandMin":-3},"humidity":{"id":"IHMAIuFwmv_PP5cfF007u","icon":"icon-shidu","duration":1,"startValue":10,"endValue":20,"powerSize":"1","valueType":"range","index":"01","btnType":"value","panelType":"humidity","isShowBand":true,"isShowMaxBandInput":false,"bandMax":4,"isShowMinBandInput":false,"bandMin":-4},"beam":{"id":"pUMg0ihZIb_n8Z_iUg9It","icon":"icon-guangzhao","duration":1,"startValue":10,"endValue":20,"powerSize":"1","valueType":"range","index":"01","btnType":"value","panelType":"beam","isShowBand":true,"isShowMaxBandInput":false,"bandMax":2,"isShowMinBandInput":false,"bandMin":-5}},{"id":"QtoyvPAlxeywMavJHcZ3B","icon":"icon-jiantou10","loop":3,"isRightLoop":false,"btnType":"loop","timestamp":1685880704894},{"id":"w4gYDXIpVUl7sqgQAhuk4","btnType":"value","temperature":{"id":"pxiGjA3lkv57qhDDDTmKA","icon":"icon-wendu","duration":10,"startValue":10,"endValue":10,"powerSize":"","valueType":"constant","index":"02","btnType":"value","panelType":"temperature","isShowBand":true,"isShowMaxBandInput":false,"bandMax":5,"isShowMinBandInput":false,"bandMin":-4},"humidity":{"id":"pwoZ6NBAWcjX60q0FXIb8","icon":"icon-shidu","duration":1,"startValue":10,"endValue":10,"powerSize":"","valueType":"constant","index":"02","btnType":"value","panelType":"humidity","isShowBand":true,"isShowMaxBandInput":false,"bandMax":2,"isShowMinBandInput":false,"bandMin":-5},"beam":{"id":"3P64gOuaFLzY5za8vU5-T","icon":"icon-guangzhao","duration":1,"startValue":10,"endValue":10,"powerSize":"","valueType":"constant","index":"02","btnType":"value","panelType":"beam","isShowBand":true,"isShowMaxBandInput":false,"bandMax":4,"isShowMinBandInput":false,"bandMin":-2}},{"id":"a5PnDV2PD5gA0Ph1u84hq","icon":"icon-jiantou16","loop":3,"isRightLoop":true,"btnType":"loop","timestamp":1685880704894,"isshowLoopInput":false}]`
      }
    }
  }
] as MockMethod[];
