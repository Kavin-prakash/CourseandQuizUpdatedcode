// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../Styles/Learner/Navbarone.css";
// // import logo from '../Images/logo.png';
// import logo from "../../../src/Images/logo.png";

// import { Document, Page } from "react-pdf";
// import { useSelector } from "react-redux";

// import { Link, Route } from "react-router-dom";
// import PDFViewer from "./PDFViewer";
// import PptViewerComponent from "./Pptxday";
// import { CiMusicNote1 } from "react-icons/ci";
// import { BsFiletypePdf, BsFiletypePpt } from "react-icons/bs";
// import {  FaFileAlt} from 'react-icons/fa';
// import { CiYoutube } from "react-icons/ci";
// import CourseDescription from "./CourseDescription";

// function SidebarTopics() {
//   const selectedCourse = useSelector((state) => state.enroll.selectedCourse);
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const viewcourse = useSelector((state) => state.enroll.course[0]);

//   const pdf = useSelector((state) => state.fetchPdf.material);
//  useEffect(()=>{
//   console.log(selectedCourse);
//  },[])
//   const [folders, setFolders] = useState([
//     {
//       name: selectedCourse ? selectedCourse.enrolledCoursename : "Loading...",
//       isOpen: false,
//       topics:
//         selectedCourse && selectedCourse.topics
//           ? selectedCourse.topics.map((topic) => ({
//               name: topic.topicName,
//               isOpen: false,

//                 materials: topic.materials? topic.materials.map((material)=>(
//                   {
//                     materialId:material.materialId,
//                     materialname:material.materialName,
//                     materiallink:material.material,
//                     materialType:material.materialType

//                   }
//                 )):<>loading...</>

//             }))
//           : [],
//     },
//   ]);
//   useEffect(()=>{
//     console.log(folders);
//   },[])

//   const [selectedComponent, setSelectedComponent] = useState(<CourseDescription course={selectedCourse}/>);

//   const toggleFolder = (index) => {
//     const updatedFolders = [...folders];
//     updatedFolders[index].isOpen = !updatedFolders[index].isOpen;
//     setFolders(updatedFolders);
//   };

//   const toggleTopic = (folderIndex, topicIndex, e) => {
//     e.stopPropagation();
//     const updatedFolders = [...folders];
//     if (updatedFolders[folderIndex].topics[topicIndex].isOpen) {
//       updatedFolders[folderIndex].topics[topicIndex].isOpen = false;
//     } else {

//       updatedFolders[folderIndex].topics.forEach((topic) => {
//         topic.isOpen = false;
//       });
//       updatedFolders[folderIndex].topics[topicIndex].isOpen = true;
//     }
//     setFolders(updatedFolders);
//   };
//   const toggleType = (folderIndex, topicIndex, typeIndex, e) => {
//     e.stopPropagation();
//     console.log("oo")
//     const updatedFolders = [...folders];

//     if (updatedFolders[folderIndex].topics[topicIndex].materialType[typeIndex].isOpen) {
//         updatedFolders[folderIndex].topics[topicIndex].materialType[typeIndex].isOpen = false;
//     } else {
//         updatedFolders[folderIndex].topics[topicIndex].materialType.forEach((type) => {
//             type.isOpen = false;
//         });
//         updatedFolders[folderIndex].topics[topicIndex].materialType[typeIndex].isOpen = true;
//     }

//     setFolders(updatedFolders);
// };
//    const navigate = useNavigate();
//   // const handleFileClick = (file) => {
//   //   switch (file) {
//   //     case "PPT":
//   //       setSelectedComponent(
//   //         <div style={{ width: '100%', height: '100vh' }}>
//   //           <PptViewerComponent Document={materiallink}/>
//   //         </div>
//   //       );

//   //       break;
//   //     case "PDF":
//   //       setSelectedComponent(<PDFViewer Document={"k"}/>);

//   //       // setSelectedComponent( <a href="">{pdf.length > 0 && pdf[0].name}</a>);

//   //       // navigate('/PDF');
//   //       // setSelectedComponent(
//   //       //   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//   //       //     {/* navigate('/PDF'); */}
//   //       //     {/* <Route file={'/PDF'} onLoadSuccess={onDocumentLoadSuccess}>
//   //       //       <Page pageNumber={pageNumber} />
//   //       //     </Route> */}
//   //       //   </div>
//   //       // );
//   //       break;
//   //     case "AssessmentEvaluation1.2":
//   //       // Set the component for AssessmentEvaluation1.2
//   //       break;
//   //     default:
//   //       setSelectedComponent(null);
//   //       break;
//   //   }
//   // };

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//   }
//  const opencontent=(type,materiallink)=>{
//  console.log("io"+type)
//  console.log("link"+materiallink)
//  switch (type) {
//   case "PPT":
//         setSelectedComponent(<PDFViewer material={materiallink}/>);

//     break;
//   case "PDF":
//     setSelectedComponent(<PDFViewer material={materiallink}/>);

//     // setSelectedComponent( <a href="">{pdf.length > 0 && pdf[0].name}</a>);

//     // navigate('/PDF');
//     // setSelectedComponent(
//     //   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//     //     {/* navigate('/PDF'); */}
//     //     {/* <Route file={'/PDF'} onLoadSuccess={onDocumentLoadSuccess}>
//     //       <Page pageNumber={pageNumber} />
//     //     </Route> */}
//     //   </div>
//     // );
//     break;
//     case "TEXT":
//       setSelectedComponent(<PDFViewer material={materiallink}/>);

//   default:
//     // setSelectedComponent(<CourseDescription course={selectedCourse}/>);         for emg
//     break;
//   }
//  }
//   return (
//     <div>
//       <nav className="navbar navbar-expand-sm navbar-default navbar-fixed-top">
//         <div className="container-fluid">
//           <a className="navbar-brand" href="#">
//             <div className="logo">
//               <img
//                 src={logo}
//                 alt="Logo"
//                 style={{ width: 100, height: 25 }}
//                 className="rounded-pill"
//               />
//             </div>
//           </a>
//           {/* <button type="button" class="btn btn-primary">Back</button> */}

//           <Link className="btn btn-primary" to={`/LearnerenrolledCourse`}>
//             Back
//           </Link>
//         </div>

//       </nav>
//       <div className="d-flex">

//       <div className="side">

//     <ul className="tree" style={{ width: 250 }}>
//         {folders.map((folder, folderIndex) => (
//             <li key={folderIndex} className={`folder ${folder.isOpen ? "open" : ""}`} onClick={() => toggleFolder(folderIndex)}>
// {folder.isOpen ? "-" : "+"} {folder.name}
//                 {folder.isOpen && (
//                     <ul>
//                         {folder.topics?.map((topic, topicIndex) => (
//                             <li key={topicIndex} className={`folder ${topic.isOpen ? "open" : ""}`} onClick={(e) => toggleTopic(folderIndex, topicIndex, e)}>
// {topic.isOpen ? "-" : "+"} {topic.name}
//                                 {topic.isOpen && (
//                                     <ul type="none">
//                                                         {topic.materials.map((content, contentIndex) => (

//                                                             <li key={contentIndex} className="file" onClick={(e)=>{opencontent(content.materialType,content.materiallink)}}>
//                                         {content.materialType==='VIDEO'?<><CiYoutube className="icon" style={{ color: 'blue', fontSize: '20px' }} /></>:content.materialType=='AUDIO'?<><CiMusicNote1 className="icon" style={{ color: 'blue' }} /></>:content.materialType=='TEXT'?<><FaFileAlt className="icon" style={{ color: 'red' }} /></>:content.materialType=='PDF'?<><BsFiletypePdf className="icon" style={{ color: 'red' }} /></>:<><BsFiletypePpt className="icon" style={{ color: 'red' }} /></>}
//                                                                 {content.materialname}
//                                                             </li>
//                                                         ))}
//                                                         <button style={{marginLeft:"5%" , backgroundColor:"#fff"}}>Take Quiz</button>

//                                     </ul>
//                                 )}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </li>
//         ))}
//     </ul>
// </div>
//         <div className="content">
//           {selectedComponent}
//           {/* <a href="">{pdf.length > 0 && pdf[0].name}</a> */}
//         </div>

//         {/* <div class="scroll" style={{width:10000}}>

//             <PDFViewer/>
//         </div> */}
//         <div></div>

//         <a href="">{pdf.length > 0 && pdf[0].name}</a>
//       </div>
//     </div>
//   );
// }

// export default SidebarTopics;

//before change

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../Styles/Learner/Navbarone.css";
// import logo from "../../../src/Images/logo.png";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import PDFViewer from "./PDFViewer";
// import { CiMusicNote1 } from "react-icons/ci";
// import { BsFiletypePdf, BsFiletypePpt } from "react-icons/bs";
// import { FaFileAlt, FaCheck } from "react-icons/fa";
// import { CiYoutube } from "react-icons/ci";
// import CourseDescription from "./CourseDescription";
// import LearnerAudioViewer from "./LearnerAudioViewer";
// import LearnerVideoViewer from "./LearnerVideoViewer";
// import { fetchQuizIdRequest } from "../../actions/Quiz And Feedback Module/Learner/FetchQuizIdAction";
// import PptViewerComponent from "./Pptxday";
// import { fetchlearnerscoreRequest } from "../../actions/Quiz And Feedback Module/Learner/LearnerScorePageAction";

// function SidebarTopics() {

//   const selectedCourse = useSelector((state) => state.enroll.selectedCourse);
//   const viewcourse = useSelector((state) => state.enroll.course[0]);
//   const userId = sessionStorage.getItem("UserSessionID");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const pdf = useSelector((state) => state.fetchPdf.material);

//   useEffect(() => {
//     console.log(selectedCourse);
//   }, [selectedCourse]);

//   const [folders, setFolders] = useState([
//     {
//       name: selectedCourse ? selectedCourse.enrolledCoursename : "Loading...",
//       isOpen: false,
//       topics:
//         selectedCourse && selectedCourse.topics
//           ? selectedCourse.topics.map((topic) => ({
//             name: topic.topicName,
//             topicid:topic.topicId,
//               isOpen: false,
//               materials: topic.materials
//                 ? topic.materials.map((material) => ({
//                     materialId: material.materialId,
//                     materialname: material.materialName,
//                     materiallink: material.material,
//                     materialType: material.materialType,
//                   }))
//                 : [],
//             }))
//           : [],
//     },
//   ]);

//   useEffect(() => {
//     console.log(folders);
//   }, [folders]);

//   const [selectedComponent, setSelectedComponent] = useState(
//     <CourseDescription course={selectedCourse} />
//   );

//   const [openedMaterials, setOpenedMaterials] = useState(new Set());

//   const [completedTopics, setCompletedTopics] = useState(() => {
//     const storedCompletedTopics = sessionStorage.getItem(
//       `completedTopics_${userId}`
//     );
//     return storedCompletedTopics
//       ? new Set(JSON.parse(storedCompletedTopics))
//       : new Set();
//   });

//   useEffect(() => {
//     const storedOpenedMaterials = sessionStorage.getItem(
//       `openedMaterials_${userId}`
//     );
//     if (storedOpenedMaterials) {
//       setOpenedMaterials(new Set(JSON.parse(storedOpenedMaterials)));
//     }
//   }, [userId]);

//   const saveOpenedMaterials = (openedMaterials) => {
//     sessionStorage.setItem(
//       `openedMaterials_${userId}`,
//       JSON.stringify(Array.from(openedMaterials))
//     );
//   };

//   const saveCompletedTopics = (completedTopics) => {
//     sessionStorage.setItem(
//       `completedTopics_${userId}`,
//       JSON.stringify(Array.from(completedTopics))
//     );
//   };

//   const toggleFolder = (index) => {
//     const updatedFolders = [...folders];
//     updatedFolders[index].isOpen = !updatedFolders[index].isOpen;
//     setFolders(updatedFolders);
//   };

//   const toggleTopic = (folderIndex, topicIndex, e) => {
//     e.stopPropagation();

//     // Prevent the next topic from opening unless the previous topic's quiz has been completed
//     if (
//       topicIndex > 0 &&
//       !completedTopics.has(folders[folderIndex].topics[topicIndex - 1].name)
//     ) {
//       alert("Please complete the quiz for the previous topic before proceeding.");
//       return;
//     }

//     const updatedFolders = [...folders];
//     updatedFolders[folderIndex].topics = updatedFolders[folderIndex].topics.map(
//       (topic, index) => ({
//         ...topic,
//         isOpen: index === topicIndex ? !topic.isOpen : topic.isOpen,
//       })
//     );
//     setFolders(updatedFolders);
//   };

//   const opencontent = (type, materiallink, materialId) => {
//     console.log("io" + type);
//     console.log("link" + materiallink);

//     setOpenedMaterials((prevOpenedMaterials) => {
//       const updatedMaterials = new Set(prevOpenedMaterials);
//       updatedMaterials.add(materialId);
//       saveOpenedMaterials(updatedMaterials);
//       return updatedMaterials;
//     });

//     switch (type) {
//       case "PPT":
//         setSelectedComponent(<PptViewerComponent material={materiallink} materialId={materialId}/>);
//         break;
//       case "PDF":
//         setSelectedComponent(<PDFViewer  material={materiallink} materialId={materialId} />);
//         break;
//       // case "TEXT":
//       //   setSelectedComponent(<PDFViewer key={materiallink} material={materiallink} />);
//       //   break;
//       case "AUDIO":
//         setSelectedComponent(<LearnerAudioViewer  material={materiallink} materialId={materialId} />);
//         break;
//       case "VIDEO":
//         setSelectedComponent(<LearnerVideoViewer  material={materiallink} materialId={materialId} />);
//         break;
//       default:
//         break;
//     }
//   };

//   const areAllMaterialsOpened = (materials) => {
//     return materials.every((material) =>
//       openedMaterials.has(material.materialId)
//     );
//   };
//   // const quizId = useSelector(
//   //   (state) => state.fetchquizinstruction.quizinstructiondetails
//   // );
//   // debugger;
//   //   const learnersAttemptId = sessionStorage.getItem("learnerAttemptId");
//   //   const learnerAttempt = useSelector(
//   //     (state) => state.learnerscore.learnerscoredetails
//   //   );
//   //   console.log("hi,", learnerAttempt);

//   //   useEffect(() => {
//   //     debugger;
//   //     dispatch(fetchlearnerscoreRequest(learnersAttemptId));
//   //   }, [dispatch]);
//   //   console.log("learner", learnerAttempt);

//   const completeTopic = (topicName,topicId) => {
//     debugger;
//         // dispatch(fetchQuizIdRequest(topicId));
//     setCompletedTopics((prevCompletedTopics) => {
//       const updatedCompletedTopics = new Set(prevCompletedTopics);
//       updatedCompletedTopics.add(topicName);
//       saveCompletedTopics(updatedCompletedTopics);
//       sessionStorage.setItem("topicId", topicId);
//     // sessionStorage.setItem("quizId",quizId.quizId);
//       navigate("/instruction");

//       return updatedCompletedTopics;
//     });
//   };
// //  console.log(quizId);
//   return (
//     <div>
//       <nav
//         className="navbar navbar-expand-sm navbar-default navbar-fixed-top"
//         style={{ height: "15px", backgroundColor: "#27235C" }}
//       >
//         <div className="container-fluid">
//           <a className="navbar-brand" href="#">
//             <div className="logo">
//               <img src={logo} alt="Logo" className="rounded-pill" />
//             </div>
//           </a>
//           <div style={{ marginLeft: "450%" }}>
//             <Link
//               className="btn btn-secondary"
//               to={`/LearnerenrolledCourse`}
//               style={{ textAlign: "center", marginTop: "-45%" }}
//             >
//               Back
//             </Link>
//           </div>
//         </div>
//       </nav>
//       <div className="d-flex">
//         <div className="side">
//           <ul className="tree" style={{ width: 250 }}>
//             {folders.map((folder, folderIndex) => (
//               <li
//                 key={folderIndex}
//                 className={`folder ${folder.isOpen ? "open" : ""}`}
//                 onClick={() => toggleFolder(folderIndex)}
//               >
//                 {folder.isOpen ? "-" : "+"} {folder.name}
//                 {folder.isOpen && (
//                   <ul>
//                     {folder.topics?.map((topic, topicIndex) => (
//                       <li
//                         key={topicIndex}
//                         className={`folder ${topic.isOpen ? "open" : ""}`}
//                         onClick={(e) => toggleTopic(folderIndex, topicIndex, e)}
//                       >
//                         {topic.isOpen ? "-" : "+"} {topic.name}
//                         {topic.isOpen && (
//                           <ul type="none">
//                             {topic.materials.map((content, contentIndex) => (
//                               <li
//                                 key={contentIndex}
//                                 className="file"
//                                 onClick={(e) => {
//                                   e.stopPropagation(); // Prevent the topic from toggling
//                                   opencontent(
//                                     content.materialType,
//                                     content.materiallink,
//                                     content.materialId
//                                   );
//                                 }}
//                               >
//                                 {content.materialType === "VIDEO" ? (
//                                   <>
//                                     <CiYoutube
//                                       className="icon"
//                                       style={{
//                                         color: "blue",
//                                         fontSize: "20px",
//                                       }}
//                                     />
//                                   </>
//                                 ) : content.materialType === "AUDIO" ? (
//                                   <>
//                                     <CiMusicNote1
//                                       className="icon"
//                                       style={{ color: "blue" }}
//                                     />
//                                   </>
//                                 ) : content.materialType === "TEXT" ? (
//                                   <>
//                                     <FaFileAlt
//                                       className="icon"
//                                       style={{ color: "red" }}
//                                     />
//                                   </>
//                                 ) : content.materialType === "PDF" ? (
//                                   <>
//                                     <BsFiletypePdf
//                                       className="icon"
//                                       style={{ color: "red" }}
//                                     />
//                                   </>
//                                 ) : (
//                                   <>
//                                     <BsFiletypePpt
//                                       className="icon"
//                                       style={{ color: "red" }}
//                                     />
//                                   </>
//                                 )}
//                                 {content.materialname}
//                                 {openedMaterials.has(content.materialId) && (
//                                   <FaCheck
//                                     className="icon"
//                                     style={{
//                                       color: "green",
//                                       marginLeft: "5px",
//                                     }}
//                                   />
//                                 )}
//                               </li>
//                             ))}

//                             {/* <button
//                               className="btn btn-success"
//                               disabled={!areAllMaterialsOpened(topic.materials)}
//                               onClick={() => completeTopic(topic.name,topic.topicid)
//                               }
//                             >
//                               {/* {topic.topicid} */}
//                             {/* Take Quiz */}
//                             {/* </button>  */}

//                             <button
//                               className="btn btn-success"
//                               disabled={!topic.materials.length || !areAllMaterialsOpened(topic.materials)}
//                               onClick={() => completeTopic(topic.name,topic.topicid)}
//                             >
//                               Take Quiz
//                             </button>
//                             {/* {learnerAttempt.score}

//                             {learnerAttempt.isPassed === "true" ? (
//                               <>
//                                 <button
//                                   className="btn btn-success"
//                                   disabled={
//                                     !areAllMaterialsOpened(topic.materials)
//                                   }
//                                   onClick={() =>
//                                     completeTopic(topic.name, topic.topicid)
//                                   }
//                                 >
//                                   {topic.topicid}
//                                   Take Quiz
//                                 </button>
//                               </>
//                             ) : (
//                               <>
//                                 <button
//                                   id="takebutton"
//                                   disabled
//                                   type="button"
//                                   title="Tooltip on left"
//                                   onClick={() =>
//                                     completeTopic(topic.name, topic.topicid)
//                                   }
//                                 >
//                                   {topic.topicid}
//                                   Take Quiz
//                                 </button>
//                               </>
//                             )} */}
//                           </ul>
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="content">{selectedComponent}</div>
//         <a href="">{pdf.length > 0 && pdf[0].name}</a>
//       </div>
//     </div>
//   );
// }

// export default SidebarTopics;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Learner/Navbarone.css";
import logo from "../../../src/Images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PDFViewer from "./PDFViewer";
import { CiMusicNote1 } from "react-icons/ci";
import { BsFiletypePdf, BsFiletypePpt } from "react-icons/bs";
import { FaFileAlt, FaCheck } from "react-icons/fa";
import { CiYoutube } from "react-icons/ci";
import CourseDescription from "./CourseDescription";
import LearnerAudioViewer from "./LearnerAudioViewer";
import LearnerVideoViewer from "./LearnerVideoViewer";
import { fetchQuizIdRequest } from "../../actions/Quiz And Feedback Module/Learner/FetchQuizIdAction";
import PptViewerComponent from "./Pptxday";
import { fetchlearnersresultRequest } from "../../actions/Quiz And Feedback Module/Learner/GetResultByLearnerIDAction";
import { fetchlearnerfeedbackresultRequest } from "../../actions/Quiz And Feedback Module/Learner/LearnerFeedbackResultAction";

function SidebarTopics() {
  const selectedCourse = useSelector((state) => state.enroll.selectedCourse);
  const viewcourse = useSelector((state) => state.enroll.course[0]);
  const userId = sessionStorage.getItem("UserSessionID");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pdf = useSelector((state) => state.fetchPdf.material);

  useEffect(() => {
    console.log(selectedCourse);
  }, [selectedCourse]);

  const [folders, setFolders] = useState([
    {
      name: selectedCourse ? selectedCourse.enrolledCoursename : "Loading...",
      isOpen: false,
      topics:
        selectedCourse && selectedCourse.topics
          ? selectedCourse.topics.map((topic) => ({
              name: topic.topicName,
              topicid: topic.topicId,
              isOpen: false,
              materials: topic.materials
                ? topic.materials.map((material) => ({
                    materialId: material.materialId,
                    materialname: material.materialName,
                    materiallink: material.material,
                    materialType: material.materialType,
                  }))
                : [],
            }))
          : [],
    },
  ]);

  useEffect(() => {
    console.log(folders);
  }, [folders]);

  const [selectedComponent, setSelectedComponent] = useState(
    <CourseDescription course={selectedCourse} />
  );
  const [openedMaterials, setOpenedMaterials] = useState(new Set());
  const [completedTopics, setCompletedTopics] = useState(() => {
    const storedCompletedTopics = sessionStorage.getItem(
      `completedTopics_${userId}`
    );
    return storedCompletedTopics
      ? new Set(JSON.parse(storedCompletedTopics))
      : new Set();
  });

  useEffect(() => {
    const storedOpenedMaterials = sessionStorage.getItem(
      `openedMaterials_${userId}`
    );
    if (storedOpenedMaterials) {
      setOpenedMaterials(new Set(JSON.parse(storedOpenedMaterials)));
    }
  }, [userId]);

  const saveOpenedMaterials = (openedMaterials) => {
    sessionStorage.setItem(
      `openedMaterials_${userId}`,
      JSON.stringify(Array.from(openedMaterials))
    );
  };

  const saveCompletedTopics = (completedTopics) => {
    sessionStorage.setItem(
      `completedTopics_${userId}`,
      JSON.stringify(Array.from(completedTopics))
    );
  };

  const toggleFolder = (index) => {
    const updatedFolders = [...folders];
    updatedFolders[index].isOpen = !updatedFolders[index].isOpen;
    setFolders(updatedFolders);
  };

  const toggleTopic = (folderIndex, topicIndex, e) => {
    e.stopPropagation();
    if (
      topicIndex > 0 &&
      !completedTopics.has(folders[folderIndex].topics[topicIndex - 1].name)
    ) {
      alert(
        "Please complete the quiz for the previous topic before proceeding."
      );
      return;
    }
    const updatedFolders = [...folders];
    updatedFolders[folderIndex].topics = updatedFolders[folderIndex].topics.map(
      (topic, index) => ({
        ...topic,
        isOpen: index === topicIndex ? !topic.isOpen : topic.isOpen,
      })
    );
    setFolders(updatedFolders);
  };

  const opencontent = (type, materiallink, materialId) => {
    console.log("io" + type);
    console.log("link" + materiallink);
    setOpenedMaterials((prevOpenedMaterials) => {
      const updatedMaterials = new Set(prevOpenedMaterials);
      updatedMaterials.add(materialId); 


      saveOpenedMaterials(updatedMaterials);
      return updatedMaterials;
    });
    switch (type) {
      case "PPT":
        setSelectedComponent(
          <PptViewerComponent material={materiallink} materialId={materialId} />
        );
        break;
      case "PDF":
        setSelectedComponent(
          <PDFViewer material={materiallink} materialId={materialId} />
        );
        break;
      case "AUDIO":
        setSelectedComponent(
          <LearnerAudioViewer material={materiallink} materialId={materialId} />
        );
        break;
      case "VIDEO":
        setSelectedComponent(
          <LearnerVideoViewer material={materiallink} materialId={materialId} />
        );
        break;
      default:
        break;
    }
  };

  const areAllMaterialsOpened = (materials) => {
    return materials.every((material) =>
      openedMaterials.has(material.materialId)
    );
  };

  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const completeTopic = (topicName, topicId) => {
    debugger;
    setCompletedTopics((prevCompletedTopics) => {
      const updatedCompletedTopics = new Set(prevCompletedTopics);
      updatedCompletedTopics.add(topicName);
      saveCompletedTopics(updatedCompletedTopics);
      sessionStorage.setItem("topicId", topicId);
      navigate("/instruction");
      return updatedCompletedTopics;
    });
  };

  const giveFeedback = (topicId) => {
    setFeedbackGiven(true);
    sessionStorage.setItem("topicId", topicId);
    navigate("/topicfeedbackquestion");
  };

  debugger;
  const learneridresult = sessionStorage.getItem("UserSessionID");
  const learnersresult = useSelector(
    (state) => state.learnersresult.learnersresultdetails
  );
  console.log("hiiii", learnersresult);
  const learnerfeedback = useSelector(
    (state) => state.learnerfeedbackresult.learnersfeedbackresultdetails
  );
  console.log("hellooo", learnerfeedback);

  useEffect(() => {
    dispatch(fetchlearnerfeedbackresultRequest(learneridresult));
    dispatch(fetchlearnersresultRequest(learneridresult));
  }, []);

  return (
    <div>
      <nav
        className="navbar navbar-expand-sm navbar-default navbar-fixed-top"
        style={{ height: "15px", backgroundColor: "#27235C" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <div className="logo">
              <img src={logo} alt="Logo" className="rounded-pill" />
            </div>
          </a>
          <div style={{ marginLeft: "450%" }}>
            <Link
              className="btn btn-secondary"
              to={`/LearnerenrolledCourse`}
              style={{ textAlign: "center", marginTop: "-45%" }}
            >
              Back
            </Link>
          </div>
        </div>
      </nav>
      <div className="d-flex">
        <div className="side">
          <ul className="tree" style={{ width: 250 }}>
            {folders.map((folder, folderIndex) => (
              <li
                key={folderIndex}
                className={`folder ${folder.isOpen ? "open" : ""}`}
                onClick={() => toggleFolder(folderIndex)}
              >
                {folder.isOpen ? "-" : "+"}
                {folder.name}
                {folder.isOpen && (
                  <ul>
                    {folder.topics?.map((topic, topicIndex) => (
                      <li
                        key={topicIndex}
                        className={`folder ${topic.isOpen ? "open" : ""}`}
                        onClick={(e) => toggleTopic(folderIndex, topicIndex, e)}
                      >
                        {topic.isOpen ? "-" : "+"}
                        {topic.name}
                        {topic.isOpen && (
                          <ul type="none">
                            {topic.materials.map((content, contentIndex) => (
                              <li
                                key={contentIndex}
                                className="file"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  opencontent(
                                    content.materialType,
                                    content.materiallink,
                                    content.materialId
                                  );
                                }}
                              >
                                {content.materialType === "VIDEO" ? (
                                  <>
                                    <CiYoutube
                                      className="icon"
                                      style={{
                                        color: "blue",
                                        fontSize: "20px",
                                      }}
                                    />
                                  </>
                                ) : content.materialType === "AUDIO" ? (
                                  <>
                                    <CiMusicNote1
                                      className="icon"
                                      style={{ color: "blue" }}
                                    />
                                  </>
                                ) : content.materialType === "TEXT" ? (
                                  <>
                                    <FaFileAlt
                                      className="icon"
                                      style={{ color: "red" }}
                                    />
                                  </>
                                ) : content.materialType === "PDF" ? (
                                  <>
                                    <BsFiletypePdf
                                      className="icon"
                                      style={{ color: "red" }}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <BsFiletypePpt
                                      className="icon"
                                      style={{ color: "red" }}
                                    />
                                  </>
                                )}
                                {content.materialname}
                                {openedMaterials.has(content.materialId) && (
                                  <FaCheck
                                    className="icon"
                                    style={{
                                      color: "green",
                                      marginLeft: "5px",
                                    }}
                                  />
                                )}
                              </li>
                            ))}
                            {/* <button
                              className="btn btn-primary"
                              disabled={
                                !topic.materials.length ||
                                !areAllMaterialsOpened(topic.materials)
                              }
                              onClick={() => giveFeedback(topic.topicid)}
                            >
                              Give Feedback
                            </button> */}
                            {/* {learnerfeedback.length > 1 ? (
                              <>Take quiz</>
                            ) : (
                              <>
                                <button
                                  className="btn btn-success"
                                  // disabled={!feedbackGiven}
                                  onClick={() =>
                                    completeTopic(topic.name, topic.topicid)
                                  }
                                >
                                  Take Quiz
                                </button>
                                <button
                                  className="btn btn-primary"
                                  disabled={
                                    !topic.materials.length ||
                                    !areAllMaterialsOpened(topic.materials)
                                  }
                                  onClick={() => giveFeedback(topic.topicid)}
                                >
                                  Give Feedback
                                </button>
                              </>
                            )}
                            {learnerfeedback.isTopicFeedbackGiven ? (
                              <>
                                <button
                                  className="btn btn-success"
                                  disabled={!feedbackGiven}
                                  onClick={() =>
                                    completeTopic(topic.name, topic.topicid)
                                  }
                                >
                                  Take Quiz
                                </button>
                                <button
                                  className="btn btn-primary"
                                  disabled={
                                    !topic.materials.length ||
                                    !areAllMaterialsOpened(topic.materials)
                                  }
                                  onClick={() => giveFeedback(topic.topicid)}
                                >
                                  Give Feedback
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-success"
                                  // disabled={!feedbackGiven}
                                  disabled
                                  onClick={() =>
                                    completeTopic(topic.name, topic.topicid)
                                  }
                                >
                                  Quiz Taken
                                </button>
                                <button
                                  className="btn btn-primary"
                                  disabled
                                  onClick={() => giveFeedback(topic.topicid)}
                                >
                                  Feedback Given
                                </button>
                              </>
                            )} */}
                            <button
                              className="btn btn-success"
                              disabled={
                                learnerfeedback.isTopicFeedbackGiven === "false" ||
                                learnersresult.isLearnerPassed === "true" ||
                                learnersresult.hasAttemptsRemaining === "false"
                              }
                              onClick={() =>
                                completeTopic(topic.name, topic.topicid)
                              }
                            >
                              Take Quiz
                            </button>
                            {/* <>
                              {learnerfeedback.isTopicFeedbackGiven ? (
        <>
          <button
            className="btn btn-primary"
            disabled={learnerfeedback.isTopicFeedbackGiven || feedbackGiven}
            onClick={() => giveFeedback(topic.topicid)}
          >
            Give Feedback
          </button>
          <button
            className="btn btn-success"
            disabled={!learnerfeedback.isTopicFeedbackGiven || !feedbackGiven}
            onClick={() => completeTopic(topic.name, topic.topicid)}
          >
            Take Quiz
          </button>
        </>
      ) : (
        <>
          <button
            className="btn btn-primary"
            disabled={feedbackGiven}
            onClick={() => giveFeedback(topic.topicid)}
          >
            Give Feedback
          </button>
          <button
            className="btn btn-success"
            disabled={!feedbackGiven}
            onClick={() => completeTopic(topic.name, topic.topicid)}
          >
            Take Quiz
          </button>
        </>
      )}
    </> */}
{/* 
                              {learnerfeedback.isTopicFeedbackGiven ? (
                              <>
                                <button
                                  className="btn btn-primary"
                                  disabled={
                                    learnerfeedback.isTopicFeedbackGiven ||
                                    feedbackGiven
                                  }
                                  onClick={() => giveFeedback(topic.topicid)}
                                >
                                  Give Feedback
                                </button>
                                <button
                                  className="btn btn-success"
                                  disabled={
                                    !learnerfeedback.isTopicFeedbackGiven ||
                                    !feedbackGiven
                                  }
                                  onClick={() =>
                                    completeTopic(topic.name, topic.topicid)
                                  }
                                >
                                  Take Quiz
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-primary"
                                  disabled={feedbackGiven}
                                  onClick={() => giveFeedback(topic.topicid)}
                                >
                                  Give Feedback
                                </button>
                                <button
                                  className="btn btn-success"
                                  disabled={!feedbackGiven}
                                  onClick={() =>
                                    completeTopic(topic.name, topic.topicid)
                                  }
                                >
                                  Take Quiz
                                </button>
                             
                            </>
                            )} */}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="content">{selectedComponent}</div>
        <a href="">{pdf.length > 0 && pdf[0].name}</a>
      </div>
    </div>
  );
}

export default SidebarTopics;
