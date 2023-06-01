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
          url: '/test',
          alarmType: 'phone', // 报警类型
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
          url: '/test',
          alarmType: 'email', // 报警类型
          isTemperature: true, // 是否有温度
          temperatureStart: 5,
          temperatureEnd: 68,
          isHumidity: true, // 是否有湿度
          humidityStart: 15,
          humidityEnd: 65,
          isBeam: true, // 是否有光照
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
  }
] as MockMethod[];
