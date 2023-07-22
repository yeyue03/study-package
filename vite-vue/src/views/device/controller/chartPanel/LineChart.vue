<template>
  <div class="chart-box" ref="chartRef"></div>
</template>

<script lang="ts">
  import { ref, reactive, defineComponent, onMounted, toRefs, watch, inject } from 'vue';
  import { Chart } from '@antv/g2';
  import { LineChartDataObj } from '../types';
  import dayjs from 'dayjs';
  import { useI18n } from '@/hooks/web/useI18n';

  export default defineComponent({
    name: 'LineChart',
    props: {
      chartData: {
        type: Object,
        default: () => {
          return [];
        },
      },
      pageName: {
        type: String,
        default: () => {
          return '';
        },
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { chartData, pageName } = toRefs(props);
      const defaultFormat = 'YYYY-MM-DD HH:mm';
      const defaultFormatHour = 'HH:mm';
      const needPanelRowList: any = inject('changePanelRowList', ['temperature', 'humidity', 'beam']); // 该设备含有的面板类似 温度、湿度、光照

      const chartRef = ref();
      const newChart = ref(); // 图标
      const viewObj: any = reactive({}); // 子表对象集

      watch(chartData, () => {
        drawChart();
      });

      const injectDeviceObj: any = inject('changeDeviceObj', {});

      // 重绘
      const resetChart = () => {
        if (newChart.value) {
          newChart.value.clear();
          newChart.value.destroy();
          newChart.value = null;
          drawChart();
        }
      };
      // 设备变更后，销毁chart 实例，需要时重新创建，防止子表数量与温度、湿度、光照数量不匹配
      watch(injectDeviceObj, () => {
        resetChart();
      });

      // 绘制图表
      const drawChart = () => {
        if (newChart.value) {
          setViewChartData();
          newChart.value.render();
        } else {
          let chartHight = document.body.clientHeight - 200; // 计算chart图高度
          if (pageName.value == 'Protocol') {
            chartHight -= 60; // 减去搜索框高度
          }
          chartHight = chartHight < 500 ? 750 : chartHight + 250;

          newChart.value = new Chart({
            container: chartRef.value,
            autoFit: true,
            height: chartHight,
            defaultInteractions: [],
          });

          const chart = newChart.value;
          chart.removeInteraction('tooltip');

          setViewOption(chart);
          chart.render();
        }
      };

      const addYValList: number[] = [1, 0.5, 0.33]; // chart多表时y轴结束范围
      const panelTypeStrObj: any = {
        temperature: t('device.chart.temperature'),
        humidity: t('device.chart.humidity'),
        beam: t('device.chart.beam'),
      };
      const panelTypeSymboObj: any = {
        temperature: '℃',
        humidity: '%rh',
        beam: 'lx',
      };

      // 图表数据赋值
      const setViewChartData = () => {
        for (const panelType of needPanelRowList.value) {
          const _arr = chartData.value.filter((item: LineChartDataObj) => item.panelType == panelType);
          viewObj[panelType].changeData(_arr);
        }
      };

      // 图表配置
      const setViewOption = (chart: any) => {
        const viewLen = needPanelRowList.value.length;
        let endY = addYValList[viewLen - 1];

        let _index = 1;
        for (const panelType of needPanelRowList.value) {
          viewObj[panelType] = chart.createView({
            region: {
              start: {
                x: 0,
                y: endY * (_index - 1),
              },
              end: {
                x: 1,
                y: _index == 3 ? 1 : endY * _index,
              },
            },
            padding: [20, 60, 60, 60],
            limitInPlot: true, // 是否对超出坐标系范围的 Geometry 进行剪切
          });

          _index++;

          viewObj[panelType].scale('timestamp', {
            range: [0, 1],
          });

          // 设置提示框
          viewObj[panelType].tooltip({
            shared: true,
            showCrosshairs: true,
            itemTpl: `<li class="g2-tooltip-list-item">
            <span class="g2-tooltip-marker" style="background-color: {color};"></span>
            <span class="g2-tooltip-name">{name}</span>:<span class="g2-tooltip-value">{value} ${panelTypeSymboObj[panelType]}</span>
          </li>`,
          });
          viewObj[panelType].animate(false);
          viewObj[panelType].interaction('tooltip');
          viewObj[panelType].interaction('sibling-tooltip');

          const valueColor: string = pageName.value == 'Protocol' ? '#f00' : '#0f0';
          viewObj[panelType].line().position('timestamp*value').shape('line').size(1).color(valueColor);

          if (pageName.value == 'Protocol') {
            // 实际
            viewObj[panelType].line().position('timestamp*setVal').shape('line').size(1).color('#0f0');
          }

          viewObj[panelType]
            .line()
            .position('timestamp*bandMax')
            .shape('line')
            .size(1)
            .color('#f00')
            .style({
              lineDash: [8, 8],
            });

          viewObj[panelType]
            .line()
            .position('timestamp*bandMin')
            .shape('line')
            .size(1)
            .color('#f00')
            .style({
              lineDash: [8, 8],
            });

          viewObj[panelType].axis('value', {
            title: {
              text: `${panelTypeStrObj[panelType]} (${panelTypeSymboObj[panelType]})`,
              style: {
                fontSize: 15,
              },
            },
            label: {
              // autoHide: false, // 是否自动隐藏
              autoEllipsis: true, // 是否自动省略
            },
            grid: {
              line: {
                type: 'line',
                style: {
                  stroke: '#aaa',
                  lineDash: [4, 4],
                },
              },
            },
          });

          let _min = 0;
          let _max = 100;
          if (injectDeviceObj.value) {
            if (panelType == 'temperature') {
              _min = injectDeviceObj.value['temperatureStart'];
              _max = injectDeviceObj.value['temperatureEnd'];
            } else if (panelType == 'humidity') {
              _min = injectDeviceObj.value['humidityStart'];
              _max = injectDeviceObj.value['humidityEnd'];
            } else if (panelType == 'beam') {
              _min = injectDeviceObj.value['beamStart'];
              _max = injectDeviceObj.value['beanEnd'];
            }
          }

          const valueAlias: string = pageName.value == 'Protocol' ? t('device.chart.reality') : t('device.chart.prediction');
          viewObj[panelType].scale('value', {
            alias: valueAlias + panelTypeStrObj[panelType],
            sync: true,
            min: _min || 0,
            max: _max || 100,
            minLimit: _min || 0,
            maxLimit: _max || 100,
          });
          viewObj[panelType].scale('setVal', {
            alias: t('device.chart.set') + panelTypeStrObj[panelType],
            sync: true,
            min: _min || 0,
            max: _max || 100,
            minLimit: _min || 0,
            maxLimit: _max || 100,
          });
          viewObj[panelType].scale('bandMax', {
            alias: panelTypeStrObj[panelType] + t('device.chart.bandMax'),
            sync: true,
            min: _min || 0,
            max: _max || 100,
            minLimit: _min || 0,
            maxLimit: _max || 100,
          });
          viewObj[panelType].scale('bandMin', {
            alias: panelTypeStrObj[panelType] + t('device.chart.bandMin'),
            sync: true,
            min: _min || 0,
            max: _max || 100,
            minLimit: _min || 0,
            maxLimit: _max || 100,
          });

          viewObj[panelType].axis('setVal', false);
          viewObj[panelType].axis('bandMax', false);
          viewObj[panelType].axis('bandMin', false);
        }

        setViewChartData();
      };

      let isWithinADay = true; // 坐标起始值是否一天内
      let scaleObj: any = {};

      // 获取 x轴间隔
      const getXTicks = (scale: any) => {
        const { min, max, tickCount } = scale;
        let avg = Math.floor((max - min) / tickCount);

        if (isWithinADay || scaleObj.dateType == 'minute') {
          avg = Math.floor(avg / 60000) * 60000; // 按分取整，防止间隔不同
        } else if (scaleObj.dateType == 'hour') {
          avg = Math.floor(avg / 3600000) * 3600000; // 按小时取整
        } else if (scaleObj.dateType == 'day') {
          avg = Math.floor(avg / 86400000) * 86400000; // 按天取整
        }

        const ticks: number[] = [];
        for (let i: number = min; i <= max; i += avg) {
          ticks.push(i);
        }

        return ticks;
      };

      const getYTicks = (min: number, max: number, tickCount: number) => {
        tickCount = tickCount < 5 ? 5 : tickCount;
        const diffVal = Math.floor(max - min);
        tickCount = tickCount > diffVal ? diffVal : tickCount;
        
        let avg = Math.floor((max - min) / tickCount);
        avg = avg > 10 ? 10 : avg;

        const ticks: number[] = [];
        for (let i: number = min; i <= max; i += avg) {
          const lastNum: number = parseFloat(i.toFixed(1));
          ticks.push(lastNum);
          if (lastNum + avg > max) {
            ticks.push(max);
          }
        }
        
        return ticks;
      };

      // 放大、缩小改变chart的操作
      const changeChartSize = (_obj: any) => {
        isWithinADay = true;
        scaleObj = _obj;

        if (pageName.value == 'Protocol') {
          isWithinADay = _obj.maxTimestamp - _obj.minTimestamp < 86400000; // 坐标起始值是否一天内
          // resetChart();
        }
        const chart = newChart.value;

        if (_obj.minTimestamp < _obj.maxTimestamp) {
          let tickCount: number = Math.floor((_obj.width - 120) / 100);

          if (isWithinADay) {
            const rangeNum: number = pageName.value == 'Simulation' ? 50 : 45;
            tickCount = Math.floor((_obj.width - 120) / rangeNum);
          }

          const minRang = (_obj.maxTimestamp - _obj.minTimestamp) / 60000;
          tickCount = tickCount > minRang ? minRang : tickCount;

          let avg = Math.floor((_obj.maxTimestamp - _obj.minTimestamp) / tickCount);
          let subCount = 2;
          if (isWithinADay || _obj.dateType == 'minute') {
            avg = Math.floor(avg / 60000); // 按分取整
          } else if (_obj.dateType == 'hour') {
            avg = Math.floor(avg / 3600000); // 按小时取整
          } else if (_obj.dateType == 'day') {
            avg = Math.floor(avg / 86400000); // 按天取整
          }

          const remainder: number = avg % 10;
          subCount = !remainder ? 9 : remainder - 1;

          for (const panelType of needPanelRowList.value) {
            viewObj[panelType].axis('timestamp', {
              tickLine: {
                length: 6,
              },
              subTickLine: {
                length: 3,
                count: subCount,
                style: {
                  stroke: '#aaa',
                },
              },
            });

            viewObj[panelType].scale('timestamp', {
              range: [0, 1],
              min: _obj.minTimestamp,
              max: _obj.maxTimestamp,
              minLimit: _obj.minTimestamp,
              maxLimit: _obj.maxTimestamp,
              tickCount,
              // tickInterval: 60000,
              formatter: (val: string) => {
                const _format: string = isWithinADay ? defaultFormatHour : defaultFormat;
                return dayjs(Number(val)).format(_format);
              },
              tickMethod: getXTicks,
            });
          }
        }

        for (const panelType of needPanelRowList.value) {
          let _min = 0;
          let _max = 100;
          if (injectDeviceObj.value) {
            if (panelType == 'temperature') {
              _min = injectDeviceObj.value['temperatureStart'];
              _max = injectDeviceObj.value['temperatureEnd'];
            } else if (panelType == 'humidity') {
              _min = injectDeviceObj.value['humidityStart'];
              _max = injectDeviceObj.value['humidityEnd'];
            } else if (panelType == 'beam') {
              _min = injectDeviceObj.value['beamStart'];
              _max = injectDeviceObj.value['beanEnd'];
            }
          }

          const _ticks = getYTicks(_min, _max, _obj.tickCount);

          const valueAlias: string = pageName.value == 'Protocol' ? t('device.chart.reality') : t('device.chart.prediction');
          viewObj[panelType].scale('value', {
            alias: valueAlias + panelTypeStrObj[panelType],
            sync: true,
            min: _min || 0,
            max: _max || 100,
            minLimit: _min || 0,
            maxLimit: _max || 100,
            tickCount: _obj.tickCount < 5 ? 5 : _obj.tickCount, // 坐标轴上刻度点的个数
            formatter: (val: string) => {
              return parseFloat(val);
            },
            ticks: _ticks,
          });
        }

        chart.changeSize(_obj.width, _obj.height);
      };

      onMounted(() => {
        drawChart();
      });

      return {
        chartRef,
        changeChartSize,
      };
    },
  });
</script>

<style scoped>
  .chart-box {
    width: 100%;
  }
</style>
