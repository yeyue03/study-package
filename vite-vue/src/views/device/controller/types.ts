// 设备信息参数类型
export type DeviceList = DeviceInfoObj[];

export interface DeviceInfoObj {
  id: number;
  ip: string;
  type: '类型', // 类型
  serialNo: string; // 序列号
  defineName: string; // 自定义设备名称
  url: string; // 图片地址
  alarmType: string; // 报警类型
  isTemperature: boolean; // 是否有温度
  temperatureStart: number;
  temperatureEnd: number;
  isHumidity: boolean; // 是否有湿度
  humidityStart: number;
  humidityEnd: number;
  isBeam: boolean; // 是否有光照
  beamStart: number;
  beanEnd: number;
  isLink: boolean; // 是否链接
}

// 操作按钮数组内参数类型
export interface OptionsItem {
  icon: string;
  btnType: string;
  name?: string;
  panelType?: string;
  valueType?: string;
}

// 设置页数据参数类型
export type SettingsArr = SettingsArrItem[];

export interface SettingsArrItem {
  id: string;
  icon: string;
  btnType: string; // 按钮类型 value-温度湿度 reservation-预约 loop-循环
  panelType?: string; // temperature-温度 humidity-湿度 beam-光照
  duration?: number; // 时长(分钟)
  date?: string; // 预约时间/日期 对应btnType: reservation
  loop?: number; // 循环次数 对应btnType: loop
  startValue?: number; // 开始值
  endValue?: number; // 结束值
  valueType?: string; // 数值类型 constant-恒定值（横线） range-变值（斜线）
  powerSize?: string; // 功率 1、2
  bandMax?: number; // 上方差
  bandMin?: number; // 下方差
  serialNumber?: string; // box序号(显示在左上角)
  timestamp?: number; // 时间戳 统一循环的左box、右box想同
  isRightLoop?: boolean;
  isShowTimeInput?: boolean;
  isshowLoopInput?: boolean;
  temperature?: SettingsArrItem;
  humidity?: SettingsArrItem;
  beam?: SettingsArrItem;
}

// 温度湿度光照所在对象参数类型
export interface THBParentObj {
  id: string;
  btnType: string;
  powerSize: string;
  duration: number;
  temperature?: SettingsArrItem;
  humidity?: SettingsArrItem;
  beam?: SettingsArrItem;
}

// 折线图数据组内参数类似
export type LineChartData = LineChartDataObj[];

export interface LineChartDataObj {
  deviceId?: number; // 把组装好的数据返给后台时用
  panelType: string;
  date: string;
  value: number;
  realValue?: number;
  bandMax: number;
  bandMin: number;
}

// 拖拽盒子参数
export interface DraggingObj {
  id?: number | string;
  index?: number;
  btnType?: string;
  timestamp?: number;
}

// 实际折线图搜索参数类型
export interface QueryChartObj {
  dateArr: string[];
  dateType: string;
}