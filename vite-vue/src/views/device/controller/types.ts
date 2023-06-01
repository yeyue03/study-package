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
  btnType: string; // 按钮类型 value-温度湿度 reservation-预约 loop-循环（温度湿度不用改参数） 没有则为温度、湿度
  duration?: number; // 时长(分钟)
  startValue?: number; // 开始值
  endValue?: number; // 结束值
  valueType?: string; // 数值类型 constant-为起始值想同（横线） range-起始值不同（斜线）
  index: number;
  date?: string; // 预约时间/日期 对应btnType: reservation
  loop?: number; // 循环次数 对应btnType: loop
  timestamp?: number; // 时间戳 统一循环的左box、右box想同
  isRightLoop?: boolean;
  isShowTimeInput?: boolean;
  isshowLoopInput?: boolean;
  loopChilds?: []
  loopItemIndex?: number;
}

// 设置（坐标轴）页面对象内的对象参数类型
export interface ControlObj {
  temperature: ControlChildObj[]; // 温度数组
  humidity: ControlChildObj[]; // 湿度数组
}

// 折线图数据组内参数类似
export interface LineChartDataObj {
  type: string;
  time: number | string;
  value: number | string;
}

// 拖拽盒子参数
export interface DraggingObj {
  id?: number;
  controlType?: string;
  index?: number;
  btnType?: string;
  loopItemIndex?: number;
  timestamp?: number;
}