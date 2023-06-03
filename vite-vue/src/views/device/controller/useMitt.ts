// import mitt from '/@/utils/mitt';
import mitt from '@/utils/mitt';
import type { PanelObj } from './types';
export interface ControlInterfacce {
  activeName: string | number;
}

const emitter = mitt();

// 监控温度、湿度面板值 star
export function setControlChange(obj: PanelObj) {
  emitter.emit('changeControlObj', obj);
}
export function listenerControlChange(callback: (obj: PanelObj) => void) {
  emitter.on('changeControlObj', callback);
}
export function removeControlListener() {
  emitter.clear();
}
// 监控温度、湿度面板值 end

// test
export function setChangePlan(obj: any) {
  emitter.emit('changePlan', obj);
}
export function listenerChangePlan(callback: (obj: any) => void) {
  emitter.on('changePlan', callback);
}
//

// 监控计划详情对象 star
export function setPlanDetailChange(obj: any) {
  emitter.emit('planDetail', obj);
}
export function listenerPlanDetailChange(callback: (obj: PanelObj) => void) {
  emitter.on('planDetail', callback);
}
export function removePlanDetailListener() {
  emitter.clear();
}
// 监控计划详情对象 end

// 监控放大、缩小、还原按钮点击 star
export function setScaleOption(type: string) {
  emitter.emit('scaleOption', type);
}
export function listenerScaleOption(callback: (type: string) => void) {
  emitter.on('scaleOption', callback);
}
export function removeScaleListener() {
  emitter.clear();
}
// 监控放大、缩小、还原按钮点击 end

// 监控标准类型变更 star
export function setStandardType(type: string) {
  emitter.emit('standardType', type);
}
export function listenerStandardType(callback: (type: string) => void) {
  emitter.on('standardType', callback);
}
export function removeStandardTypeListener() {
  emitter.clear();
}
// 监控标准类型变更 end

// 监控文档湿度刷新 star
export function setControlRefresh() {
  emitter.emit('controlRefresh');
}
export function listenerControlRefresh(callback: () => void) {
  emitter.on('controlRefresh', callback);
}
export function removeControlRefreshListener() {
  emitter.clear();
}
// 监控文档湿度刷新 end

// 监控计划替换为模板 star
export function setReplacePlan(settings: string) {
  emitter.emit('replacePlan', settings);
}
export function listenerReplacePlan(callback: (settings: string) => void) {
  emitter.on('replacePlan', callback);
}
export function removeReplacePlanListener() {
  emitter.clear();
}
// 监控计划替换为模板 end
