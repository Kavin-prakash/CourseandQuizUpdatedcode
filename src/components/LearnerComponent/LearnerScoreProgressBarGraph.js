
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCoursesTopicsScoresRequest } from '../../actions/LearnerAction/LearnerScoreProgressBarGraphAction';
// import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip, VictoryGroup } from 'victory';

// function LearnerScoreProgressBarGraph() {
//     const dispatch = useDispatch();
//     const id = sessionStorage.getItem("UserSessionID");
//     const scoreProgressSelector = useSelector((state) => state.scoreProgressBarGraph.scoreProgress);


//     useEffect(() => {
//         dispatch(fetchCoursesTopicsScoresRequest(id));
//     }, [dispatch]);

//     // Get all unique topics
//     const topics = [...new Set(scoreProgressSelector.map(item => item.topicName))];

//     // Get all unique courses
//     const courses = [...new Set(scoreProgressSelector.map(item => item.courseName))];

//     const topicColors = ['#e6eefb', '#27235C']

//     // Calculate chart width based on the number of courses and topics
//     const chartWidth = 100 * courses.length * topics.length;

//     return (
//         <div style={{ width: `350px`, height: '350px' }}>
//             <VictoryChart domainPadding={55} padding={{ top: 20, bottom: 60, left: 100, right: 80 }}>
//                 <VictoryAxis tickValues={courses} tickFormat={courses} />
//                 <VictoryAxis dependentAxis />
//                 <VictoryGroup offset={15}>
//                     {topics.map((topic, index) => (
//                         <VictoryBar
//                             key={index}
//                             data={scoreProgressSelector.filter(item => item.topicName === topic)}
//                             x="courseName"
//                             y="score"
//                             labels={({ datum }) => `Topic: ${topic}, Score: ${datum.score}`}
//                             labelComponent={<VictoryTooltip />}
//                             style={{ data: { fill: topicColors[index % topicColors.length] } }}
//                         />
//                     ))}
//                 </VictoryGroup>
//             </VictoryChart>
//         </div>
//     );
// }

// export default LearnerScoreProgressBarGraph;














import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoursesTopicsScoresRequest } from '../../actions/LearnerAction/LearnerScoreProgressBarGraphAction';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip, VictoryGroup } from 'victory';
import LearnerScoreProgressBarGraphApi from '../../middleware/LearnerMiddleware/LearnerScoreProgressBarGraphApi';
 
function LearnerScoreProgressBarGraph() {
    const dispatch = useDispatch();
    const id = sessionStorage.getItem("UserSessionID");
    // const scoreProgressSelector = useSelector((state) => state);
    const [scoreProgressSelector, setScoreProgressSelector] = useState([]);
    console.log("scoreProgressSelector",scoreProgressSelector);
 
    useEffect(() => {
        console.log("gghfhgf");
        fetchCoursesTopicsScores(id);
    }, []);
 
 
 
    const fetchCoursesTopicsScores = async (id) =>{
        console.log("red")
        const data = await LearnerScoreProgressBarGraphApi(id);
        console.log("tadytas",data);
        setScoreProgressSelector(data);
    }
 
    // Get all unique topics
    const topics = [...new Set(scoreProgressSelector.map(item => item.topicName))];
 
    // Get all unique courses
    const courses = [...new Set(scoreProgressSelector.map(item => item.courseName))];
 
    const topicColors = ['#e6eefb', '#27235C']
 
     // Check if there's any score data
     const hasScoreData = scoreProgressSelector.some(item => item.score > 0);
 
     if (!hasScoreData) {
         return null; // Don't render anything if there's no score data
     }
 
    // Calculate chart width based on the number of courses and topics
    const chartWidth = 100 * courses.length * topics.length;
 
    return (
        <div style={{ width: `350px`, height: '350px' }}>
            <VictoryChart domainPadding={55} padding={{ top: 20, bottom: 60, left: 100, right: 80 }}>
                <VictoryAxis tickValues={courses} tickFormat={courses} />
                <VictoryAxis dependentAxis />
                <VictoryGroup offset={15}>
                    {topics.map((topic, index) => (
                        <VictoryBar
                            key={index}
                            data={scoreProgressSelector.filter(item => item.topicName === topic)}
                            x="courseName"
                            y="score"
                            labels={({ datum }) => `Topic: ${topic}, Score: ${datum.score}`}
                            labelComponent={<VictoryTooltip />}
                            style={{ data: { fill: topicColors[index % topicColors.length] } }}
                        />
                    ))}
                </VictoryGroup>
            </VictoryChart>
        </div>
    );
}
 
export default LearnerScoreProgressBarGraph;