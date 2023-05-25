// 操作按钮数组内参数类型
export interface OptionsItem {
  icon: string,
  controlType?: string,
  valueType?: string,
  name?: string,
  btnType?: string
}

// 设置（坐标轴）页面对象内的子数组对象参数类型
export interface ControlChildObj {
  id: number;
  icon: string;
  duration: number;
  startValue: number | string;
  endValue: number | string;
  valueType: string;
  index: number;
  isShowTimeInput?: boolean
}

// 设置（坐标轴）页面对象内的对象参数类型
export interface ControlObj {
  temperature: ControlChildObj[];
  humidity: ControlChildObj[];
}

// 折线图数据组内参数类似
export interface LineChartDataObj {
  type: string;
  time: number;
  value: number | string;
}