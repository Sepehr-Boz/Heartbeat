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
import { toast } from 'react-toastify';


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
function StatsPage({route}){
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

    const [stopduplicateToasts, setStopDuplicateToasts] = useState(true);




// notificaiton system to alert user of how many steps they have taken today 
    const checkStepGoal = async () => {
      const STEP_GOAL = 10000;
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);

      
        // Fetch today's steps data
        const response = await fetch("http://localhost:8000/get_data/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          //bunch together data points for steps
          body: JSON.stringify({
            category: category,
            min_date: todayStart.toISOString(),
            max_date: todayEnd.toISOString(),
            uid: auth.currentUser.uid,
            group: "daily",
            mode: "sum"
          })
        });

        const data = await response.json();
        
        // Calculate total steps today
        let totalSteps = 0;
        if (data && data.length > 0) {
          totalSteps = data.reduce((sum, item) => sum + item.data, 0);
        }

        // Calculate time until midnight
        const midnight = new Date(todayEnd);
        const hoursLeft = Math.floor((midnight - now) / (1000 * 60 * 60));
        const minutesLeft = Math.floor(((midnight - now) % (1000 * 60 * 60)) / (1000 * 60));

        // Show notification
        if (stopduplicateToasts) {
          setStopDuplicateToasts(false);
          if (totalSteps >= STEP_GOAL) {
            toast.success(
              <div>
                <strong> Goal reached! good job </strong>
                <p style={{ margin: '5px 0 0 0' }}>
                  You've reached {Math.trunc(totalSteps).toLocaleString()} steps today!
                </p>
              </div>,
                    {
                      autoClose: 5000,
                    }
                    );
                } else {
                  const stepsNeeded = STEP_GOAL - totalSteps;
                  toast.warning(
                    <div>
                      <strong>Step Goal Reminder</strong>
                      <p style={{ margin: '5px 0 0 0' }}>
                      You need {Math.trunc(stepsNeeded).toLocaleString()} more steps to reach 10,000 before midnight

                      </p>
                      <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#666' }}>
                        Time remaining: {hoursLeft}h {minutesLeft}m
                      </p>
                    </div>,
                    {
                      autoClose: 5000,
                    }
                  );
                }
            }
      };




    // !MUST filter/group together data points because when there are too many then the marker hides away in the graph
    const fetchDailyData = async () => {
      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date();
  
      const response = await fetch("http://localhost:8000/get_data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          min_date: dayStart.toISOString(),
          max_date: dayEnd.toISOString(),
          uid: auth.currentUser.uid,
          group: "daily",
          mode: category != "heartrate" ? "sum" : "mean"
        })
      })
      .then(res => res.json())
      .then(res => {
        if (category == "heartrate") return res.map(x => {
          return {data: x.data, time: new Date(x.time)};
        });
        let res2 = [{
          data: res[0].data,
          time: new Date(res[0].time)
        }];
        for (let i = 1; i < res.length; i++){
          res2.push({
            data: res[i].data + res2[i-1].data,
            time: new Date(res[i].time)
          });
        }
        return res2;
      })
      .then(res => {
        let maxValue = Math.max(...res.map(x => x.data)) * 1.25;

        setDailyOptions({
          title: {textAlign: 'left', fontSize: 14, fontWeight: 600, text: `${category.charAt(0).toUpperCase() + category.substring(1)} Today`},
          data: res,
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
                const isLastElem = (datum == res[res.length-1]);
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
                  if (category == "heartbeat") return Math.trunc(value).toString() + "BPM";
                  else if (value >= 1_000_000) return Math.trunc(value / 1_000_000).toString() + "M";
                  else if (value >= 1000) return Math.trunc(value / 1000).toString() + "K";
                  else return Math.trunc(value).toString();
                }
              },
              min: 0, max: maxValue
            }
          },
          padding: {top: 10, bottom: 10, left: 15, right: 15},
          background: {fill: '#FFFFFF'}        
        })        
      })
    }

    const fetchWeeklyData = async () => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0,0,0,0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const response = await fetch("http://localhost:8000/get_data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          min_date: weekStart.toISOString(),
          max_date: weekEnd.toISOString(),
          uid: auth.currentUser.uid,
          group: "weekly",
          mode: category != "heartrate" ? "sum" : "mean"
        })
      })
      .catch(x => {
        return fetch("http://127.0.0.1:8000/get_data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          min_date: weekStart.toISOString(),
          max_date: weekEnd.toISOString(),
          uid: auth.currentUser.uid,
          group: "weekly",
          mode: category != "heartrate" ? "sum" : "mean"
        })
      })        
      })
      .then(res => res.json())
      .then(res => res.map(x => {
        return {data: x.data, time: new Date(x.time)};
      }))
      .then(res => {
        let maxValue = Math.max(...res.map(x => x.data)) * 1.25;

        setWeeklyOptions({
          title: {textAlign: 'left', fontSize: 14, fontWeight: 600, text: `${category.charAt(0).toUpperCase() + category.substring(1)} This Week`},
          data: res,
          series: [
            {type: 'area', xKey: 'time', xName: 'Time', yKey: 'data', yName: `${category.charAt(0).toUpperCase() + category.substring(1)}`,
            stroke: category == 'steps' ? stepsColors.stroke : category == 'distance_m' ? distanceColors.stroke
            : category == 'calories' ? caloriesColors.stroke : category == 'heartrate' ? heartrateColors.stroke : stepsColors.stroke,
            strokeWidth: 3, fill: category == 'steps' ? stepsColors.fill : category == 'distance_m' ? distanceColors.fill
            : category == 'calories' ? caloriesColors.fill : category == 'heartrate' ? heartrateColors.fill : stepsColors.fill,
            fillOpacity: 0.25,
            marker: {
              itemStyler: ({datum}) => {
                const isLastElem = (datum == res[res.length-1]);
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
                  if (category == "heartbeat") return Math.trunc(value).toString() + "BPM";
                  else if (value >= 1_000_000) return Math.trunc(value / 1_000_000).toString() + "M";
                  else if (value >= 1000) return Math.trunc(value / 1000).toString() + "K";
                  else return Math.trunc(value).toString();
                }
              },
              min: 0, max: maxValue
            }
          },
          padding: {top: 10, bottom: 10, left: 15, right: 15},
          background: {fill: '#FFFFFF'}        
        });              
      })
    }


    const fetchMonthlyData = async () => {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0,0,0,0);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1, -1);

      const response = await fetch("http://localhost:8000/get_data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          min_date: monthStart.toISOString(),
          max_date: monthEnd.toISOString(),
          uid: auth.currentUser.uid,
          group: "weekly",
          mode: category != "heartrate" ? "sum" : "mean"
        })
      })
      .then(res => res.json())
      .then(res => res.map(x => {
        return {data: x.data, time: new Date(x.time)};
      }))
      .then(res => {
        let maxValue = Math.max(...res.map(x => x.data)) * 1.25;

        setMonthlyOptions({
          title: {textAlign: 'left', fontSize: 14, fontWeight: 600, text: `${category.charAt(0).toUpperCase() + category.substring(1)} This Month`},
          data: res,
          series: [
            {type: 'area', xKey: 'time', xName: 'Time', yKey: 'data', yName: `${category.charAt(0).toUpperCase() + category.substring(1)}`,
            stroke: category == 'steps' ? stepsColors.stroke : category == 'distance_m' ? distanceColors.stroke
            : category == 'calories' ? caloriesColors.stroke : category == 'heartrate' ? heartrateColors.stroke : stepsColors.stroke,
            strokeWidth: 3, fill: category == 'steps' ? stepsColors.fill : category == 'distance_m' ? distanceColors.fill
            : category == 'calories' ? caloriesColors.fill : category == 'heartrate' ? heartrateColors.fill : stepsColors.fill,
            fillOpacity: 0.25,
            marker: {
              itemStyler: ({datum}) => {
                const isLastElem = (datum == res[res.length-1]);
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
                  if (category == "heartbeat") return Math.trunc(value).toString() + "BPM";
                  else if (value >= 1_000_000) return Math.trunc(value / 1_000_000).toString() + "M";
                  else if (value >= 1000) return Math.trunc(value / 1000).toString() + "K";
                  else return Math.trunc(value).toString();
                }
              },
              min: 0, max: maxValue
            }
          },
          padding: {top: 10, bottom: 10, left: 15, right: 15},
          background: {fill: '#FFFFFF'}        
        });             
      })
    }

    const fetchYearlyData = async () => {
      const yearStart = new Date();
      yearStart.setMonth(0,1);
      yearStart.setHours(0,0,0,0);
      const yearEnd = new Date(yearStart);
      yearEnd.setFullYear(yearEnd.getFullYear() + 1);

      const response = await fetch("http://localhost:8000/get_data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          min_date: yearStart.toISOString(),
          max_date: yearEnd.toISOString(),
          uid: auth.currentUser.uid,
          group: "yearly",
          mode: category != "heartrate" ? "sum" : "mean"
        })
      })
      .then(res => res.json())
      .then(res => res.map(x => {
        return {data: x.data, time: new Date(x.time)};
      }))
      .then(res => {
        let maxValue = Math.max(...res.map(x => x.data)) * 1.25;

        setYearlyOptions({
          title: {textAlign: 'left', fontSize: 14, fontWeight: 600, text: `${category.charAt(0).toUpperCase() + category.substring(1)} This Year`},
          data: res,
          series: [
            {type: 'area', xKey: 'time', xName: 'Time', yKey: 'data', yName: `${category.charAt(0).toUpperCase() + category.substring(1)}`,
            stroke: category == 'steps' ? stepsColors.stroke : category == 'distance_m' ? distanceColors.stroke
            : category == 'calories' ? caloriesColors.stroke : category == 'heartrate' ? heartrateColors.stroke : stepsColors.stroke,
            strokeWidth: 3, fill: category == 'steps' ? stepsColors.fill : category == 'distance_m' ? distanceColors.fill
            : category == 'calories' ? caloriesColors.fill : category == 'heartrate' ? heartrateColors.fill : stepsColors.fill,
            fillOpacity: 0.25,
            marker: {
              itemStyler: ({datum}) => {
                const isLastElem = (datum == res[res.length-1]);
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
                  if (category == "heartbeat") return Math.trunc(value).toString() + "BPM";
                  else if (value >= 1_000_000) return Math.trunc(value / 1_000_000).toString() + "M";
                  else if (value >= 1000) return Math.trunc(value / 1000).toString() + "K";
                  else return Math.trunc(value).toString();
                }
              },
              min: 0, max: maxValue
            }
          },
          padding: {top: 10, bottom: 10, left: 15, right: 15},
          background: {fill: '#FFFFFF'}        
        });              
      })
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
          else if (!location.state.category){
            navigate("/home");
          }
          
          else{
              auth.currentUser.reload();

            if (category === 'steps') {
              
              checkStepGoal();
              setStopDuplicateToasts(false);

          }
          }
      };

      checkAuth();     
      document.head.getElementsByTagName("title")[0].innerText = "Heartbeat - " + category.charAt(0).toUpperCase() + category.substring(1);

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



export default StatsPage;