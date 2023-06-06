export interface DeviceEditParams {
  id: number;
  defineName: string;
  alarmType: string;
}

export interface PlanDetalParams {
  deviceId: number;
}

export interface PlanAddParams {
  standardType: string;
  deviceId: number;
  settings: string;
  startTime: string;
  isRun: boolean;
}

export interface PlanDataAddParams {
  deviceId?: number; // 把组装好的数据返给后台时用
  panelType: string;
  date: string;
  value: number;
  realValue?: number;
  bandMax: number;
  bandMin: number;
}

export interface PlanDisableParams {
  id: number;
}

export interface PlanEnableParams {
  id: number;
}

export interface PlanTemplateAddParams {
  deviceId: number;
  name: string;
  settings: string;
  standardType: string;
}

export interface PlanTemplateEditParams {
  deviceId: number;
  name: string;
  settings: string;
  standardType: string;
}

export interface PlanTemplateListParams {
  deviceId: number;
}

export interface RealChartDataParams {
  deviceId: number;
  startTime: string;
  endTime: string;
  type: string;
}
