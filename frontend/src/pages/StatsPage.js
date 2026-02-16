import { useEffect, useState, useRef } from "react";
import TitleBar from "../components/TitleBar";
import NavBar from "../components/NavBar";
import { DataGraph, DailyDataGraph, WeeklyDataGraph, MonthlyDataGraph, YearlyDataGraph } from "../components/DataGraph";
import Divider from "../components/Divider";


import "./css/StatsPage.css";


/**
 * props are:
 * - *string* category - the data stat being viewed
 * - *bool* showDaily
 * - *bool* showWeekly
 * - *bool* showMonthly
 * - *bool* showYearly
 */
function StatsPage(props){
    // TODO: move these into props
    const [showDaily, setShowDaily] = useState(true);
    const [showWeekly, setShowWeekly] = useState(true);
    const [showMonthly, setShowMonthly] = useState(true);
    const [showYearly, setShowYearly] = useState(true);



    // ! TEST DATA
    const start = new Date('Sat Feb 08 2026 00:00:00 GMT+0000');
    const [data, setData] = useState([
    {time: start, steps: 0},
    {time: new Date('Sat Feb 10 2026 10:00:00 GMT+0000'), steps: 0},
    {time: new Date('Sat Mar 11 2026 10:00:00 GMT+0000'), steps: 50},
    {time: new Date('Sat Apr 12 2026 10:30:00 GMT+0000'), steps: 500},
    {time: new Date('Sat Jun 13 2026 12:00:00 GMT+0000'), steps: 500},
    {time: new Date('Sat Jun 14 2026 13:00:00 GMT+0000'), steps: 1050},
    {time: new Date('Sat Aug 15 2026 18:00:00 GMT+0000'), steps: 2500},
    {time: new Date('Sat Nov 16 2026 19:00:00 GMT+0000'), steps: 7000},
    {time: new Date('Sat Nov 17 2026 19:30:00 GMT+0000'), steps: 8950},
    {time: new Date('Sat Dec 18 2026 22:00:00 GMT+0000'), steps: 9500},
    ]);
    const end = new Date(data[data.length-1].time);


    const [yearlyData, setYearlyData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/data/stepcount")
        .then(res => res.json())
        .then(data => {
            setYearlyData(data);
        });
    }, []);

    return (
    <div className="stats-page">
        <TitleBar title="Heartbeat" enableBack={true} />
        <NavBar isHome={true} isQR={false} isProfile={false} />
        <div className="stats-page-scrolldiv">
            {showDaily ? 
            (<div className="stats-page-section">
                <Divider text="Daily" />
                <DailyDataGraph title="Steps Today" 
                category="steps"
                data={data} 
                maxData={10_000} />
            </div>)
            : null}

            {showWeekly ?
            (<div className="stats-page-section">
                <Divider text="Weekly" />
                <WeeklyDataGraph title="Steps This Week" 
                category="steps"
                data={data} 
                maxData={10_000} />
            </div>)
            : null}

            {showMonthly ?
            (<div className="stats-page-section">
                <Divider text="Monthly" />
                <MonthlyDataGraph title="Steps This Month" 
                category="steps"
                data={data} 
                maxData={10_000} />
            </div>)
            : null}

            {showYearly ?
            (<div className="stats-page-section">
                <Divider text="Yearly" />
                <YearlyDataGraph title="Steps This Year" 
                category="steps"
                data={yearlyData}
                maxData={10_000} />
            </div>)
            : null}

            <></>
        </div>
    </div>
    )
}



export default StatsPage;