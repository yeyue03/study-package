// test.ts

import { MockMethod } from 'vite-plugin-mock';
import dayjs from 'dayjs';
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
      let _arr: any = [];
      let timestamp = new Date().getTime() - 10 * 60 * 60 * 1000;
      for (let i=0; i<30; i++) {
        timestamp += 20 * 60 * 1000;
        const _date = dayjs(timestamp).format('YYYY-MM-DD HH:mm');
        let Tval = getRandom();
        let Hval = getRandom();
        let Bval = getRandom();

        _arr.push({
          "date": _date,
          "temperature": Tval,
          "setTemperature": Tval + 2,
          "temperatureMax": Tval + 5,
          "temperatureMin": Tval - 5,
          "humidity": Hval,
          "setHumidity": Hval + 1,
          "humidityMax": Hval + 3,
          "humidityMin": Hval - 4,
          "beam": Bval,
          "setBeam": Bval + 3,
          "beamMax": Bval + 5,
          "beamMin": Bval - 5,
        })
      }

      return _arr;
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
        settings: `[{"id":"uwIfcG5hk0pJ0fgMTWCWY","icon":"icon-yuyueguanli","date":"2023-06-06 11:13","btnType":"reservation"},{"id":"lJ7p0PFbAYu9TAEZu8DAj","btnType":"value","duration":1,"temperature":{"id":"C7bNv8By8pbVfhiq7ltty","icon":"icon-wendu","duration":1,"startValue":12,"endValue":23,"powerSize":"1","valueType":"range","serialNumber":"01","bandMax":2,"bandMin":-3,"panelType":"temperature","btnType":"value","isShowEndValInput":false,"isShowStartValInput":false,"isShowBand":true,"isShowMaxBandInput":false,"isShowMinBandInput":false,"isSpwt":true},"humidity":{"id":"s7_39xKmDHQl1rlDZ4MQ-","icon":"icon-shidu","duration":1,"startValue":14,"endValue":16,"powerSize":"1","valueType":"range","serialNumber":"01","bandMax":5,"bandMin":-3,"panelType":"humidity","btnType":"value","isShowStartValInput":false,"isShowEndValInput":false,"isShowBand":true,"isShowMaxBandInput":false,"isShowMinBandInput":false},"beam":{"id":"y7Q_zXjfvPxCVH1XweO4H","icon":"icon-guangzhao","duration":1,"startValue":17,"endValue":27,"powerSize":"1","valueType":"range","serialNumber":"01","bandMax":2,"bandMin":-2,"panelType":"beam","btnType":"value","isShowStartValInput":false,"isShowEndValInput":false,"isShowBand":true,"isShowMaxBandInput":false,"isShowMinBandInput":false},"powerSize":"1"},{"id":"S5l5AY_QqM4ux0JwoS5sL","icon":"icon-jiantou10","loop":3,"isRightLoop":false,"btnType":"loop","timestamp":1686021174118},{"id":"jWs1sukP6_kJSUjTuKek6","btnType":"value","duration":1,"temperature":{"id":"4lVyVkiHZ_kAXmRNXPnV1","icon":"icon-wendu","duration":1,"startValue":23,"endValue":18,"powerSize":"2","valueType":"range","serialNumber":"04","bandMax":2,"bandMin":-2,"panelType":"temperature","btnType":"value","isShowEndValInput":false,"isShowBand":true,"isShowMaxBandInput":false,"isShowMinBandInput":false,"isShowTimeInput":false},"humidity":{"id":"OoQ2xfObtfxXTnlbQEz4m","icon":"icon-shidu","duration":1,"startValue":16,"endValue":24,"powerSize":"2","valueType":"range","serialNumber":"04","bandMax":4,"bandMin":-1,"panelType":"humidity","btnType":"value","isShowEndValInput":false,"isShowBand":true,"isShowMaxBandInput":false,"isShowMinBandInput":false,"isSpwt":true},"beam":{"id":"oZCbBGRTmHXFBkxnlr-dZ","icon":"icon-guangzhao","duration":1,"startValue":27,"endValue":33,"powerSize":"2","valueType":"range","serialNumber":"04","bandMax":2,"bandMin":-4,"panelType":"beam","btnType":"value","isShowEndValInput":false,"isShowBand":true,"isShowMaxBandInput":false,"isShowMinBandInput":false},"powerSize":"2"},{"id":"nk3rSFD6offD1CpIkTXqr","icon":"icon-jiantou16","loop":3,"isRightLoop":true,"btnType":"loop","timestamp":1686021174118,"isshowLoopInput":false},{"id":"4AfA6BjYhqjyjPuwtdUM3","btnType":"value","duration":10,"temperature":{"id":"558DLRkM_fxLqFDZNllP4","icon":"icon-wendu","duration":10,"startValue":18,"endValue":18,"powerSize":"","valueType":"constant","serialNumber":"04","bandMax":3,"bandMin":-2,"panelType":"temperature","btnType":"value","isShowEndValInput":false,"isShowBand":true,"isShowMaxBandInput":false,"isShowMinBandInput":false},"humidity":{"id":"_z8rbEAzfnW6Hr6U8vU5Z","icon":"icon-shidu","duration":10,"startValue":24,"endValue":24,"powerSize":"","valueType":"constant","serialNumber":"04","bandMax":3,"bandMin":-2,"panelType":"humidity","btnType":"value","isShowBand":true,"isShowMaxBandInput":false,"isShowMinBandInput":false},"beam":{"id":"ZN3yjxBOpAzPxwv1idlDy","icon":"icon-guangzhao","duration":10,"startValue":33,"endValue":33,"powerSize":"","valueType":"constant","serialNumber":"04","bandMax":2,"bandMin":-3,"panelType":"beam","btnType":"value","isShowBand":true,"isShowMaxBandInput":false,"isShowMinBandInput":false,"isShowTimeInput":false},"powerSize":""}]`
      }
    }
  }
] as MockMethod[];
