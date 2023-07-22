export interface DeviceEditParams {
  id: number;
  defineName: string;
  alarmType: string;
}

export interface DeviceRealValueParams {
  deviceId: number;
}

export interface PlanDetalParams {
  deviceId: number;
}

export interface PlanAddParams {
  deviceId: number;
  settings: string;
  startTime: string;
  isRun: boolean;
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
