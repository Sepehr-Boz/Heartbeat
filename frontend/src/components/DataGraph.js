import React, { useState } from "react";
import { AgCharts } from "ag-charts-react";
import {
  LegendModule,
  AreaSeriesModule,
  CategoryAxisModule,
  TimeAxisModule,
  ModuleRegistry,
  NumberAxisModule,
} from "ag-charts-community";

import "./css/DataGraph.css";


ModuleRegistry.registerModules([
  AreaSeriesModule,
  CategoryAxisModule,
  TimeAxisModule,
  LegendModule,
  NumberAxisModule,
]);


/**
 * has the following props:
 * - *string* title
 * - *array[object]* data
 * - *int* minData
 * - *int* maxData
 * - *date* minTime
 * - *date* maxTime
 * - *func* timeFormatter - used to format Date strings on the x axis, should
 *    take in value and return a string
 * 
 * - the data object consists of an array of
 * objects that each hold key-value pairs for time and steps
 * 
 */
function DataGraph(props){
  const [options, setOptions] = useState({
    title: {
      text: props.title,
      textAlign: 'left',
      fontSize: 14,
      fontWeight: 600
    },
    data: props.data,
    series: [{
        type: "area",
        xKey: "time",
        xName: "Time",
        yKey: props.category,
        yName: props.category,
        stroke: "#2D6EFF",
        strokeWidth: 3,
        fill: "#B8C5FF",
        fillOpacity: 0.25,
        marker: {
            itemStyler: ({ datum: {time, steps}}) => {
              return time == props.data[props.data.length-1].time
              ? {shape: 'circle', fill: {
                type: 'gradient',
                colorStops: [
                  {color: 'rgba(45, 110, 255, 0)', stop: 0},
                  {color: 'rgba(45, 110, 255, 0.5)', stop: 0.62},
                  {color: 'rgba(45, 110, 255, 1)', stop: 0.75},
                  {color: 'rgba(45, 110, 255, 1)', stop: 1},
                ]
              }, size: 30}
              : {size: 0}
            },
        }
    }],
    axes: {
      x: {
        type: 'time',
        min: props.minTime,
        max: props.maxTime, 
        label: {
          formatter: ({value}) => {
            return props.timeFormatter(value);
          },
          color: '#828282',
          fontWeight: 300,
          fontSize: 10
        },
        interval: {
          maxSpacing: 25
        },
        line: {
          enabled: false
        }
      },
      y: {
        type: 'number',
        interval: {
          maxSpacing: 50, // ensures that theres always ~5 labels on the axis
        },
        min: props.minData,
        max: props.maxData,
        label: {
          // turns every 1000s labels into xK for shorter labels
          formatter: ({value}) => {
            return value >= 1000
            ? (value / 1000).toString() + "K"
            : value
          },
          color: '#828282',
          fontWeight: 300,
          fontSize: 10
        },
        line: {
          enabled: false
        },
        gridLine: {
          style: [
            {stroke: '#E6E6E6', strokeWidth: 1}
          ],
        },
        position: 'left',
      }
    },
    padding: {
      top: 10,
      bottom: 10,
      left: 15,
      right: 15
    },
    background: {
      fill: '#FFFFFF'
    }
  });

  return (
  <div className="data-graph-container">
    <AgCharts options={options} />
  </div>
  );
}


/**
 * props are:
 * - *string* title
 * - *string* category for what statistic is tracked
 * - *array[object]* data
 * - *int* maxData
 */
function DailyDataGraph(props){
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  return (
    <DataGraph
      title={props.title}
      category={props.category}
      data={props.data}
      minTime={start}
      maxTime={end}
      minData={0}
      maxData={props.maxData}
      timeFormatter={(value) => {
        let hour = value.getHours();
        return hour < 10
        ? `0${hour}H`
        : `${hour}H`;
      }}

    />
  );
}


/* example usage of DailyDataGraph

const start = new Date('Sat Feb 07 2026 00:00:00 GMT+0000');
const [data, setData] = useState([
  {time: start, steps: 0},
  {time: new Date('Sat Feb 07 2026 09:00:00 GMT+0000'), steps: 0},
  {time: new Date('Sat Feb 07 2026 10:00:00 GMT+0000'), steps: 50},
  {time: new Date('Sat Feb 07 2026 10:30:00 GMT+0000'), steps: 500},
  {time: new Date('Sat Feb 07 2026 12:00:00 GMT+0000'), steps: 500},
  {time: new Date('Sat Feb 07 2026 13:00:00 GMT+0000'), steps: 1050},
  {time: new Date('Sat Feb 07 2026 18:00:00 GMT+0000'), steps: 2500},
  {time: new Date('Sat Feb 07 2026 19:00:00 GMT+0000'), steps: 7000},
  {time: new Date('Sat Feb 07 2026 19:30:00 GMT+0000'), steps: 8950},
  {time: new Date('Sat Feb 07 2026 22:00:00 GMT+0000'), steps: 9500},
])
const end = new Date(data[data.length-1].time);

const [test, setTest] = useState(
  <DailyDataGraph
    title="Steps Today"
    category="steps"
    data={data}
    maxData={10_000}
  />
);

*/



export {
  DataGraph,
  DailyDataGraph
};