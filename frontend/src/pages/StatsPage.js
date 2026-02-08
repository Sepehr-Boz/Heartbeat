import { useState } from "react";
import TitleBar from "../components/TitleBar";
import NavBar from "../components/NavBar";
import { DataGraph, DailyDataGraph } from "../components/DataGraph";
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
    {time: new Date('Sat Feb 08 2026 09:00:00 GMT+0000'), steps: 0},
    {time: new Date('Sat Feb 08 2026 10:00:00 GMT+0000'), steps: 50},
    {time: new Date('Sat Feb 08 2026 10:30:00 GMT+0000'), steps: 500},
    {time: new Date('Sat Feb 08 2026 12:00:00 GMT+0000'), steps: 500},
    {time: new Date('Sat Feb 08 2026 13:00:00 GMT+0000'), steps: 1050},
    {time: new Date('Sat Feb 08 2026 18:00:00 GMT+0000'), steps: 2500},
    {time: new Date('Sat Feb 08 2026 19:00:00 GMT+0000'), steps: 7000},
    {time: new Date('Sat Feb 08 2026 19:30:00 GMT+0000'), steps: 8950},
    {time: new Date('Sat Feb 08 2026 22:00:00 GMT+0000'), steps: 9500},
    ]);
    const end = new Date(data[data.length-1].time);

    // TODO: add more custom graphs for weeks, months, years, and 
    // TODO: render those for each of the sections
    const [dailyGraph, setDailyGraph] = useState(
        <DailyDataGraph title="Steps Today" category="steps"
        data={data} maxData={10_000} />
    );
    const [weeklyGraph, setWeeklyGraph] = useState(
        <DailyDataGraph title="Steps This Week" category="steps"
        data={data} maxData={10_000} />
    );
    const [monthlyGraph, setMonthlyGraph] = useState(
        <DailyDataGraph title="Steps This Month" category="steps"
        data={data} maxData={10_000} />
    );
    const [yearlyGraph, setYearlyGraph] = useState(
        <DailyDataGraph title="Steps This Year" category="steps"
        data={data} maxData={10_000} />
    );



    return (
    <div className="stats-page">
        <TitleBar title="Heartbeat" enableBack={true} />
        <NavBar />
        <div className="stats-page-scrolldiv">
            {showDaily ? 
            (<div className="stats-page-section">
                <Divider text="Daily" />
                {dailyGraph}
            </div>)
            : null}

            {showWeekly ?
            (<div className="stats-page-section">
                <Divider text="Weekly" />
                {weeklyGraph}
            </div>)
            : null}

            {showMonthly ?
            (<div className="stats-page-section">
                <Divider text="Monthly" />
                {monthlyGraph}
            </div>)
            : null}

            {showYearly ?
            (<div className="stats-page-section">
                <Divider text="Yearly" />
                {yearlyGraph}
            </div>)
            : null}

            <></>
        </div>
    </div>
    )
}



export default StatsPage;