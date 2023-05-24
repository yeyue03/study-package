import mitt from '@/utils/mitt';
import type { ControlObj } from './types';
export interface ControlInterfacce {
  activeName: string | number;
}

const emitter = mitt();

// 监控温度、湿度面板值 star
export function setControlChange(obj: ControlObj) {
  emitter.emit('changeControlObj', obj);
}
export function listenerControlChange(callback: (obj: ControlObj) => void) {
  emitter.on('changeControlObj', callback);
}
export function removeControlListener() {
  emitter.clear();
}
// 监控温度、湿度面板值 end

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
