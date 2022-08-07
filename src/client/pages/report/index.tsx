import React, { useEffect, useRef, useState } from "react";
import style from "./index.less";
import { render } from "react-dom";
import '../../assets/reset.css'
import * as XLSX from "xlsx";
import CheckBox from 'rc-checkbox';
import { resloveEventData } from "../../utils/data";

const color = require("../../theme/color.json")
const DEFAULT_EVENTS = ["_pageview", "_pageleave", "_web_stay", "_web_click", "__web_longpress", "_sign_up", "_sign_in", "_web_exposure"]
function readWorkbookFromLocalFile(file: any, callback?: any) {
  var reader = new FileReader();
  reader.onload = function (e: any) {
    var data = e.target.result;
    var workbook = XLSX.read(data, { type: 'binary' });
    const { Sheets: sheets } = workbook;
    let parseData = Object.keys(sheets).reduce((finalData, sheetName) => {
      let sheetData = XLSX.utils.sheet_to_json(sheets[sheetName]);
      finalData.push({ sheetName, sheetData })
      return finalData;
    }, []);
    console.log(parseData);

    // 缓存本地
    localStorage.setItem("beidouTestOriginData", JSON.stringify(parseData[0].sheetData))

    if (callback) callback(parseData[0].sheetData);
  };
  reader.readAsBinaryString(file);
}


export default function ReportPage() {
  const handlFileUpload = (e: any) => {
    readWorkbookFromLocalFile(e.target.files[0], setOriginTestData)
  }
  const fetchEvents = useRef([])
  const [originTestData, setOriginTestData] = useState([])
  const originTestEvents = originTestData.map(_ => _["Event"])
  const [cacheOriginTestEvents, setCacheOriginTestEvents] = useState([])
  const [eventStatistics, setEventStatistics] = useState({
    defaultEvents: {},
    customeEvents: {}
  })

  useEffect(() => {
    init()
  }, [])


  useEffect(() => {
    setInterval(() => { getEventData() }, 2000)
  }, [])

  function init() {
    getBeidouTestOriginData()
  }

  function getEventData() {
    setInterval(() => {
      fetch('cgi-bin/list', {
        method: 'get'
      }).then(function (response) {
        response.json().then(res => {
          const data = resloveEventData(res)
          if (data.length) {
            fetchEvents.current.push(...data)
            // 执行计算
            calculateNetEventToatl()
          }
        })
      })
    }, 2000)
  }


  /**
   * 1. 计算产生的事件总数
   *    a. 全埋点事件总数
   *    b. 自定义事件总数
   */

  function calculateNetEventToatl() {
    const _eventStatistics = JSON.parse(JSON.stringify(eventStatistics))
    const { defaultEvents, customeEvents } = _eventStatistics
    console.log(fetchEvents.current);
    
    fetchEvents.current.forEach(item => {
      if (item.event) {
        if (DEFAULT_EVENTS.includes(item.event)) {
          if (defaultEvents[item.event]) {
            defaultEvents[item.event].count++
          } else {
            defaultEvents[item.event] = {
              count: 1
            }
          }
        } else {
          if (customeEvents[item.event]) {
            customeEvents[item.event].count++
          } else {
            customeEvents[item.event] = {
              count: 1
            }
          }
        }

      }
    })

    setEventStatistics({
      customeEvents: _eventStatistics.customeEvents,
      defaultEvents: _eventStatistics.defaultEvents
    })
  }
  function getBeidouTestOriginData() {
    const data = localStorage.getItem("beidouTestOriginData")
    setOriginTestData(data ? JSON.parse(data) : [])

  }


  function handleOriginEventChange(e: any) {
    const { name, checked } = e.target
    console.log(name, checked);
    if (checked) {
      // 加入本地缓存
      setCacheOriginTestEvents([...cacheOriginTestEvents, name])
    } else {
      // 从本地缓存剔除
      const arr = [...cacheOriginTestEvents]
      const index = arr.findIndex(_ => _ === name)
      arr.splice(index, 1)
      setCacheOriginTestEvents(arr)
    }

  }
  return (
    <div className={style.container}>
      <h2>埋点 SDK 测试实时分析报告</h2> <input type={"file"} onChange={handlFileUpload} />
      <h3>预期事件</h3>
      <Card>
        <div>
          {
            originTestData.map((item, i) => <div key={i}><CheckBox onChange={handleOriginEventChange} name={item["Event"]} value={item["Event"]} /> <i>{item["Event"]}</i></div>)
          }
          <div>
            <Text text={"总数: "} />
            <Text text={originTestEvents.length} customeStyle={{ color: color["ansiGreen"] }} />

            <Text text={"选中: "} />
            <Text text={cacheOriginTestEvents.length} customeStyle={{ color: color["ansiGreen"] }} />
          </div>
        </div>
      </Card>
      <h3>事件统计</h3>
      <Card>
        <div>
          <div>
            <Text size="big" text={"事件总数"} />
          </div>
          <div>
            <Text text={"自定义事件: "} />
            <Text text={Object.keys(eventStatistics.customeEvents).length || "-"} customeStyle={{ color: color["ansiGreen"] }} />
            {
              Object.keys(eventStatistics.customeEvents).map(key => {
                return <p className={style.subText}><span style={{ color: "rgba(150, 150, 150, .8)" }}>{key}</span>: <i>{eventStatistics.customeEvents[key].count}</i></p>
              })
            }

          </div>
          <div>
            <Text text={"全埋点事件: "} />
            <Text text={Object.keys(eventStatistics.defaultEvents).length || "-"} customeStyle={{ color: color["ansiGreen"] }} />
            {
              Object.keys(eventStatistics.defaultEvents).map(key => {
                return <p className={style.subText}><span style={{ color: "rgba(150, 150, 150, .8)" }}>{key}</span>: <i>{eventStatistics.defaultEvents[key].count}</i></p>
              })
            }
          </div>
        </div>
      </Card>

      <Card>
        <div>
          <div>
            <Text size="big" text={"数据质量"} />
          </div>
          <div>
            <Text text={"成功总数: "} />
            <Text text={"93"} customeStyle={{ color: color["ansiGreen"] }} />
          </div>
          <div>
            <Text text={"失败总数: "} />
            <Text text={"93"} customeStyle={{ color: color["ansiBrightRed"] }} />
          </div>
        </div>
      </Card>

      <Card>
        <div>
          <div>
            <Text size="big" text={"测试结果"} />
          </div>
          <div>
            <Text text={"预期事件: "} />
            <Text text={"93"} customeStyle={{ color: color["ansiGreen"] }} />
          </div>
          <div>
            <Text text={"实际事件: "} />
            <Text text={"93"} customeStyle={{ color: color["ansiBrightRed"] }} />
          </div>
          <div>
            <Text text={"测试耗时: "} />
            <Text text={"1m56s"} customeStyle={{ color: color["ansiGreen"] }} />
          </div>
        </div>
      </Card>


      <h3>事件结果</h3>
      <Card>
        <div>
          <div>
            <Text size="big" text={"错误事件"} />
          </div>
          <div>
            <Text text={"总数: "} />
            <Text text={"93"} customeStyle={{ color: color["ansiBrightRed"] }} />
          </div>
          <div>
            <Text text={"描述: "} />
            <Text text={"93"} customeStyle={{ color: color["ansiGreen"] }} />
          </div>
          <div>
            <Text text={"名称: "} />
            <Text text={"93"} customeStyle={{ color: color["ansiBrightRed"] }} />
          </div>
          <div>
            <Text text={"状态: "} />
          </div>
          <div> <Text text={"原因"} /></div>
          <div> <Text text={"属性"} /></div>
          <div>  <Text text={"旅程"} /></div>
        </div>
      </Card>



    </div>
  );
}

const Card: React.FC<any> = ({ children }) => {
  return <div className={style.card}>{children}</div>;
};

const Text: React.FC<any> = ({ text, size = "small", customeStyle = {} }) => {
  return (
    <div className={[style.textContainer, style[size]].join(" ")} style={customeStyle}>
      <p>{text}</p>
    </div>
  );
};

render(<ReportPage />, document.getElementById("root"));
