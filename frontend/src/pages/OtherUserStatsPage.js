import { useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import NavBar from "../components/NavBar";
import Divider from "../components/Divider";
import { AgCharts } from "ag-charts-react";
import {
  LegendModule,
  AreaSeriesModule,
  CategoryAxisModule,
  TimeAxisModule,
  ModuleRegistry,
  NumberAxisModule,
} from "ag-charts-community";
import { IsUserLoggedIn, IsAuthOutOfDate } from "../utls/UserChecks";
import { auth } from "../config/firebase";


import "./css/StatsPage.css";


ModuleRegistry.registerModules([
  AreaSeriesModule,
  CategoryAxisModule,
  TimeAxisModule,
  LegendModule,
  NumberAxisModule,
]);



// defines the line + area colours for each of the data categories
const stepsColors = {
  stroke : '#2D6EFF',
  fill: '#B8C5FF',
  markerGradient: [
    { color: "rgba(45,110,255,0)", stop: 0 },
    { color: "rgba(45,110,255,0.5)", stop: 0.62 },
    { color: "rgba(45,110,255,1)", stop: 0.75 },
    { color: "rgba(45,110,255,1)", stop: 1 }
  ],
}

const distanceColors = {
  stroke : '#56FF22',
  fill: '#BDFFA9',
  markerGradient: [
    { color: "rgba(86,255,34,0)", stop: 0 },
    { color: "rgba(86,255,34,0.5)", stop: 0.62 },
    { color: "rgba(86,255,34,1)", stop: 0.75 },
    { color: "rgba(86,255,34,1)", stop: 1 }
  ],
}

const caloriesColors = {
  stroke : '#FFCF22',
  fill: '#FFDE68',
  markerGradient: [
    { color: "rgba(255,207,34,0)", stop: 0 },
    { color: "rgba(255,207,34,0.5)", stop: 0.62 },
    { color: "rgba(255,207,34,1)", stop: 0.75 },
    { color: "rgba(255,207,34,1)", stop: 1 }
  ],
}

const heartrateColors = {
  stroke : '#FF2D31',
  fill: '#FF9A9C',
  markerGradient: [
    { color: "rgba(255,45,49,0)", stop: 0 },
    { color: "rgba(255,45,49,0.5)", stop: 0.62 },
    { color: "rgba(255,45,49,1)", stop: 0.75 },
    { color: "rgba(255,45,49,1)", stop: 1 }
  ],
}



/**
 * props are:
 * - *string* category - the data stat being viewed
 * - *bool* showDaily
 * - *bool* showWeekly
 * - *bool* showMonthly
 * - *bool* showYearly
 */
function OtherUserStatsPage({route}){
    const navigate = useNavigate();
    const location = useLocation();
    const category = location.state.category;

    const [showDaily, setShowDaily] = useState(true);
    const [showWeekly, setShowWeekly] = useState(true);
    const [showMonthly, setShowMonthly] = useState(true);
    const [showYearly, setShowYearly] = useState(true);


    const [dailyOptions, setDailyOptions] = useState({});
    const [weeklyOptions, setWeeklyOptions] = useState({});
    const [monthlyOptions, setMonthlyOptions] = useState({});
    const [yearlyOptions, setYearlyOptions] = useState({});



    // !MUST filter/group together data points because when there are too many then the marker hides away in the graph
    const fetchDailyData = async () => {
      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
  
      const response = await fetch("http://localhost:8000/data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          start_date: dayStart.toISOString(),
          end_date: dayEnd.toISOString()
        })
      }).then(res => res.json());

      // add an entry for each hour
      let dailyData = [];
      for (let i = 0; i < 24; i++){
        let hour = new Date(dayStart);
        hour.setHours(hour.getHours() + i);
        if (hour > Date.now()) break;
        else dailyData.push({data: 0, time: hour});
      }
      response.forEach(element => {
        let formattedTime = new Date(element.time);
        dailyData[formattedTime.getHours()].data += element.data;
      });
      let maxValue = Math.ceil(Math.max(...dailyData.map(x => x.data)) / 1000) * 1000 * 1.5;

      setDailyOptions({
        title: {textAlign: 'left', fontSize: 14, fontWeight: 600, text: `${category.charAt(0).toUpperCase() + category.substring(1)} Today`},
        data: dailyData,
        series: [
          {type: 'area', xKey: 'time', xName: 'Time', yKey: 'data', yName: `${category.charAt(0).toUpperCase() + category.substring(1)}`,
          stroke: category == 'steps' ? stepsColors.stroke : category == 'distance_m' ? distanceColors.stroke
          : category == 'calories' ? caloriesColors.stroke : category == 'heartrate' ? heartrateColors.stroke : stepsColors.stroke,
          strokeWidth: 3,
          fill: category == 'steps' ? stepsColors.fill : category == 'distance_m' ? distanceColors.fill
          : category == 'calories' ? caloriesColors.fill : category == 'heartrate' ? heartrateColors.fill : stepsColors.fill,
          fillOpacity: 0.25,
          marker: {
            itemStyler: ({datum}) => {
              const isLastElem = (datum == dailyData[dailyData.length-1]);
              return {shape: 'circle', size: isLastElem ? 30 : 0,
              fill: {type: 'gradient', colorStops: category == 'steps' ? stepsColors.markerGradient : category == 'distance_m' ? distanceColors.markerGradient
                : category == 'calories' ? caloriesColors.markerGradient : category == 'heartrate' ? heartrateColors.markerGradient : stepsColors.markerGradient}
              }
            }
          }}
        ],
        axes: {
          x: {type: 'time', line: {enabled: false}, label: {
            color: '#828282', fontSize: 10, fontWeight: 300, avoidCollisions: true,
            formatter: ({value}) => {
              const hours = value.getHours();
              const minutes = value.getMinutes();
              return (hours < 10 ? `0${hours}` : hours).toString()
              + (minutes < 10 ? `0${minutes}` : minutes).toString();
            }
          },
          min: dayStart, max: dayEnd},
          y: {type: 'number', line: {enabled: false}, interval: {maxSpacing: 50},
            position: 'left', gridLine: {style: [{stroke: '#E6E6E6', strokeWidth: 1}]},
            label: {
              formatter: ({value}) => {
                return value >= 1000 ? (value / 1000).toString() + "K" : value;
              }
            },
            min: 0, max: maxValue
          }
        },
        padding: {top: 10, bottom: 10, left: 15, right: 15},
        background: {fill: '#FFFFFF'}        
      })
    }

    const fetchWeeklyData = async () => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0,0,0,0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const response = await fetch("http://localhost:8000/data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          start_date: weekStart.toISOString(),
          end_date: weekEnd.toISOString()
        })
      })
      .catch(x => {
        return fetch("http://127.0.0.1:8000/data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          start_date: weekStart.toISOString(),
          end_date: weekEnd.toISOString()
        })
      })        
      })
      .then(res => res.json());

      // fill weekly data for the number of days in a week (7)
      let weeklyData = [];
      for (let i = 0; i < 7; i++){
        let weekday = new Date(weekStart);
        weekday.setDate(weekday.getDate() + i);
        if (weekday > Date.now()) break;
        else weeklyData.push({data: 0, time: weekday});
      }
      // group data into 7 points: one for each day of the week
      response.forEach(async element => {
        // check if a data element for that day already exists, if not then create one and if so then increase steps
        let formattedDate = new Date(element.time);
        weeklyData[formattedDate.getDay()].data += element.data;
      });
      let maxValue = Math.ceil(Math.max(...weeklyData.map(x => x.data)) / 1000) * 1000 * 1.5;

      setWeeklyOptions({
        title: {textAlign: 'left', fontSize: 14, fontWeight: 600, text: `${category.charAt(0).toUpperCase() + category.substring(1)} This Week`},
        data: weeklyData,
        series: [
          {type: 'area', xKey: 'time', xName: 'Time', yKey: 'data', yName: `${category.charAt(0).toUpperCase() + category.substring(1)}`,
          stroke: category == 'steps' ? stepsColors.stroke : category == 'distance_m' ? distanceColors.stroke
          : category == 'calories' ? caloriesColors.stroke : category == 'heartrate' ? heartrateColors.stroke : stepsColors.stroke,
          strokeWidth: 3, fill: category == 'steps' ? stepsColors.fill : category == 'distance_m' ? distanceColors.fill
          : category == 'calories' ? caloriesColors.fill : category == 'heartrate' ? heartrateColors.fill : stepsColors.fill,
          fillOpacity: 0.25,
          marker: {
            itemStyler: ({datum}) => {
              const isLastElem = (datum == weeklyData[weeklyData.length-1]);
              return {shape: 'circle', size: isLastElem ? 30 : 0,
              fill: {type: 'gradient', colorStops: category == 'steps' ? stepsColors.markerGradient : category == 'distance_m' ? distanceColors.markerGradient
          : category == 'calories' ? caloriesColors.markerGradient : category == 'heartrate' ? heartrateColors.markerGradient : stepsColors.markerGradient}
              }
            }
          }}
        ],
        axes: {
          x: {type: 'time', line: {enabled: false}, label: {
            color: '#828282', fontSize: 10, fontWeight: 300, avoidCollisions: true,
            formatter: ({value}) => {
              const day = value.getDay();
              const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
              return dayNames[day].substring(0,3);
            }
          },
          min: weekStart, max: weekEnd},
          y: {type: 'number', line: {enabled: false}, interval: {maxSpacing: 50},
            position: 'left', gridLine: {style: [{stroke: '#E6E6E6', strokeWidth: 1}]},
            label: {
              formatter: ({value}) => {
                return value >= 1000 ? (value / 1000).toString() + "K" : value;
              }
            },
            min: 0, max: maxValue
          }
        },
        padding: {top: 10, bottom: 10, left: 15, right: 15},
        background: {fill: '#FFFFFF'}        
      });      
    }


    const fetchMonthlyData = async () => {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0,0,0,0);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1, -1);

      const response = await fetch("http://localhost:8000/data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          start_date: monthStart.toISOString(),
          end_date: monthEnd.toISOString()
        })
      }).then(res => res.json());

      function daysInMonth (month, year) {
          return new Date(year, month, 0).getDate();
      }


      let monthlyData = [];
      // fill monthly data with the number of days in that month
      for (let i = 0; i < daysInMonth(monthStart.getMonth(), monthStart.getFullYear()); i++){
        let day = new Date(monthStart);
        day.setDate(day.getDate() + i);
        if (day > Date.now()) break;
        else monthlyData.push({data: 0, time: day});
      }
      response.forEach(async element => {
        let formattedDate = new Date(element.time);
        monthlyData[formattedDate.getDate()].data += element.data;
      });
      let maxValue = Math.ceil(Math.max(...monthlyData.map(x => x.data)) / 1000) * 1000 *1.5;


      setMonthlyOptions({
        title: {textAlign: 'left', fontSize: 14, fontWeight: 600, text: `${category.charAt(0).toUpperCase() + category.substring(1)} This Month`},
        data: monthlyData,
        series: [
          {type: 'area', xKey: 'time', xName: 'Time', yKey: 'data', yName: `${category.charAt(0).toUpperCase() + category.substring(1)}`,
          stroke: category == 'steps' ? stepsColors.stroke : category == 'distance_m' ? distanceColors.stroke
          : category == 'calories' ? caloriesColors.stroke : category == 'heartrate' ? heartrateColors.stroke : stepsColors.stroke,
          strokeWidth: 3, fill: category == 'steps' ? stepsColors.fill : category == 'distance_m' ? distanceColors.fill
          : category == 'calories' ? caloriesColors.fill : category == 'heartrate' ? heartrateColors.fill : stepsColors.fill,
          fillOpacity: 0.25,
          marker: {
            itemStyler: ({datum}) => {
              const isLastElem = (datum == monthlyData[monthlyData.length-1]);
              return {shape: 'circle', size: isLastElem ? 30 : 0,
              fill: {type: 'gradient', colorStops: category == 'steps' ? stepsColors.markerGradient : category == 'distance_m' ? distanceColors.markerGradient
          : category == 'calories' ? caloriesColors.markerGradient : category == 'heartrate' ? heartrateColors.markerGradient : stepsColors.markerGradient}
              }
            }
          }}
        ],
        axes: {
          x: {type: 'time', line: {enabled: false}, label: {
            color: '#828282', fontSize: 10, fontWeight: 300, avoidCollisions: true,
            formatter: ({value}) => {
              const date = value.getDate();
              return date;
            }
          },
          min: monthStart, max: monthEnd},
          y: {type: 'number', line: {enabled: false}, interval: {maxSpacing: 50},
            position: 'left', gridLine: {style: [{stroke: '#E6E6E6', strokeWidth: 1}]},
            label: {
              formatter: ({value}) => {
                return value >= 1000 ? (value / 1000).toString() + "K" : value;
              }
            },
            min: 0, max: maxValue
          }
        },
        padding: {top: 10, bottom: 10, left: 15, right: 15},
        background: {fill: '#FFFFFF'}        
      });      
    }

    const fetchYearlyData = async () => {
      const yearStart = new Date();
      yearStart.setMonth(0,1);
      yearStart.setHours(0,0,0,0);
      const yearEnd = new Date(yearStart);
      yearEnd.setFullYear(yearEnd.getFullYear() + 1);

      const response = await fetch("http://localhost:8000/data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          start_date: yearStart.toISOString(),
          end_date: yearEnd.toISOString()
        })
      }).then(res => res.json());

      // group all data points into each month
      // fill yearly data with 12 months at start then add to them
      let yearlyData = [];
      for (let i = 0; i < 12; i++){
        let month = new Date(yearStart);
        month.setMonth(month.getMonth() + i);
        if (month > Date.now()) break;
        else yearlyData.push({data: 0, time: month});
      }
      response.forEach(element => {
        let formattedDate = new Date(element.time);
        yearlyData[formattedDate.getMonth()].data += element.data;
      });
      // get max steps
      yearlyData.unshift({data: 0, time: yearStart});
      let maxValue = Math.ceil(Math.max(...yearlyData.map(x => x.data)) / 1000) * 1000 * 1.5;


      setYearlyOptions({
        title: {textAlign: 'left', fontSize: 14, fontWeight: 600, text: `${category.charAt(0).toUpperCase() + category.substring(1)} This Year`},
        data: yearlyData,
        series: [
          {type: 'area', xKey: 'time', xName: 'Time', yKey: 'data', yName: `${category.charAt(0).toUpperCase() + category.substring(1)}`,
          stroke: category == 'steps' ? stepsColors.stroke : category == 'distance_m' ? distanceColors.stroke
          : category == 'calories' ? caloriesColors.stroke : category == 'heartrate' ? heartrateColors.stroke : stepsColors.stroke,
          strokeWidth: 3, fill: category == 'steps' ? stepsColors.fill : category == 'distance_m' ? distanceColors.fill
          : category == 'calories' ? caloriesColors.fill : category == 'heartrate' ? heartrateColors.fill : stepsColors.fill,
          fillOpacity: 0.25,
          marker: {
            itemStyler: ({datum}) => {
              const isLastElem = (datum == yearlyData[yearlyData.length-1]);
              return {shape: 'circle', size: isLastElem ? 30 : 0,
              fill: {type: 'gradient', colorStops: category == 'steps' ? stepsColors.markerGradient : category == 'distance_m' ? distanceColors.markerGradient
          : category == 'calories' ? caloriesColors.markerGradient : category == 'heartrate' ? heartrateColors.markerGradient : stepsColors.markerGradient}
              }
            }
          },
        }],
        axes: {
          x: {type: 'time', line: {enabled: false}, label: {
            color: '#828282', fontSize: 10, fontWeight: 300, avoidCollisions: true,
            formatter: ({value}) => {
              const monthNames = [
              "January","February","March","April","May","June",
              "July","August","September","October","November","December"
              ];
              return (monthNames[value.getMonth()]).toString().substring(0,3);
            }
          },
          min: yearStart, max: yearEnd},
          y: {type: 'number', line: {enabled: false}, interval: {maxSpacing: 50},
            position: 'left', gridLine: {style: [{stroke: '#E6E6E6', strokeWidth: 1}]},
            label: {
              formatter: ({value}) => {
                return value >= 1000 ? (value / 1000).toString() + "K" : value;
              }
            },
            min: 0, max: maxValue
          }
        },
        padding: {top: 10, bottom: 10, left: 15, right: 15},
        background: {fill: '#FFFFFF'}        
      });      
    }


    useEffect(() => {
      const checkAuth = async () => {
          const loggedIn = await IsUserLoggedIn();
          const outOfDate = await IsAuthOutOfDate();

          if (!loggedIn){
            navigate("/login");
          }
          else if (outOfDate){
            await auth.signOut();
            navigate("/login");
          }
          else if (!location.state){
            navigate("/other/home");
          }
          else{
              auth.currentUser.reload();
          }
      };

      checkAuth();     

      // go back to profile screen after 10 minutes
      setTimeout(() => {
        navigate("/profile");
      }, 1000 * 60);

      if (showDaily) fetchDailyData();
      if (showWeekly) fetchWeeklyData();
      if (showMonthly) fetchMonthlyData();
      if (showYearly) fetchYearlyData();
    }, []);

    return (
    <div className="stats-page">
        <TitleBar title="Heartbeat" enableBack={true} />
        <NavBar isHome={true} isQR={false} isProfile={false} />
        <div className="stats-page-scrolldiv">
            {showDaily ?
            (<div className="stats-page-section">
                <Divider text="Daily" />
                <div className="data-graph-container">
                    <AgCharts options={dailyOptions} />
                </div>
            </div>)
            : null}

            {showWeekly ?
            (<div className="stats-page-section">
                <Divider text="Weekly" />
                <div className="data-graph-container">
                    <AgCharts options={weeklyOptions} />
                </div>
            </div>)
            : null}

            {showMonthly ?
            (<div className="stats-page-section">
                <Divider text="Monthly" />
                <div className="data-graph-container">
                    <AgCharts options={monthlyOptions} />
                </div>
            </div>)
            : null}                                    

            {showYearly ?
            (<div className="stats-page-section">
                <Divider text="Yearly" />
                <div className="data-graph-container">
                    <AgCharts options={yearlyOptions} />
                </div>
            </div>)
            : null}

            <></>
        </div>
    </div>
    )
}



export default OtherUserStatsPage;