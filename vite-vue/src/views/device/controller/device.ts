import dayjs from "dayjs";
import { SettingsArrItem } from "./types";

// 组装折线图需要的数据
export const getChartDataSource = (settingsArr: any, needPanelRowList: any) => {
  const defaultFormat = "YYYY-MM-DD HH:mm";
  const _setArr = settingsArr.value;

  if (!_setArr || !_setArr.length) {
    return;
  }

  let dataArr: any = [];
  let startTimeStamp = new Date().getTime() + 60000;
  let duration = 0;

  let loopIndex: number = 0; // 循环box左侧 index
  let loopNum: number = 0; // 循环次数

  const returnArr = (parentObj: any, timestamp: number, valKey: string) => {
    const _date = dayjs(timestamp).format(defaultFormat);
    let resArr: any = [];

    for (const panelType of needPanelRowList.value) {
      const _val = parentObj[panelType][valKey];
      resArr.push({
        panelType,
        date: _date,
        value: _val,
        bandMax: _val + parentObj[panelType]["bandMax"],
        bandMin: _val + parentObj[panelType]["bandMin"],
      });
    }

    return resArr;
  };

  for (let i = 0; i < _setArr.length; i++) {
    const item: SettingsArrItem = _setArr[i];

    if (item.btnType == "value") {
      // startValue
      let durTimeStamp = startTimeStamp + duration * 60 * 1000;
      let resArr = returnArr(item, durTimeStamp, "startValue");
      dataArr.push(...resArr);

      // endValue
      duration += item.duration!;
      durTimeStamp = startTimeStamp + duration * 60 * 1000;
      
      resArr = returnArr(item, durTimeStamp, "endValue");
      dataArr.push(...resArr);
      
    } else if (item.btnType == "loop") {
      if (!item.isRightLoop) {
        loopIndex = i;
        loopNum = item.loop!;
      } else {
        loopNum--;
        if (loopNum > 0) {
          i = loopIndex;
        }
      }

    } else if (item.btnType == "reservation" && item.date) {
      startTimeStamp = new Date(item.date).getTime();
    }
  }

  console.log("=== 组装好的折线图数据: ", dataArr);
  return dataArr;
};