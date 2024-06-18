import React, { useEffect, useState } from 'react'
import { TopicScoreApi } from '../../middleware/LearnerMiddleware/TopicScoreApi';
 
function TopicScore() {
 
  const [TopicId] = useState('43083bc3-fe12-4b71-b189-9a090109c84d');
  const [LearnerId] = useState('6bdbab27-c637-48ff-850e-2cf9eb700a40');
//  const [LearnerId]= useState(sessionStorage.getItem('UserSessionID'));
 console.log("hello session", LearnerId);
 
  const [ViewScore, setScore] = useState({score:0});
  useEffect(() => {
    scoreFetch(LearnerId, TopicId);
  }, []);
 
 
  const scoreFetch = async () => {
    try {
      const ScoreData = await TopicScoreApi(LearnerId, TopicId);
      setScore(ScoreData[0]);
      // console.log(ViewScore);4
      console.log('scoredata',ScoreData)
     
      // return ScoreData;
     
    }
    catch (error) {
      console.error('error in fetch', error);
    }
  };
 
 
 
 
 
  return (
    <>
      <div className='mt-5'>
        <div className='container d-flex justify-content-center'>
          <h1> view topic score </h1>
          <h1>{ViewScore.score}</h1>
        <label>course Name</label>  <h1>{ViewScore.courseTitle}</h1>
      <label>Topic Name</label>    <h1>{ViewScore.topicName}</h1>
        </div>
      </div>
 
 
 
    </>
  )
}
export default TopicScore;






 
 
 
 
 
 

 