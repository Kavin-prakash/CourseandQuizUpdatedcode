import React, { useEffect, useState } from "react";
import { TopicScoreApi } from "../../middleware/LearnerMiddleware/TopicScoreApi";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LearnerNavbar from "./LearnerNavbar";

function TopicScore() {
  const [TopicId] = useState("2df47ffa-3fc0-44c7-b869-c403f5542150");
  const [LearnerId] = useState("6bdbab27-c637-48ff-850e-2cf9eb700a40");
  const [ViewScoresList, setViewScoresList] = useState([]);

  useEffect(() => {
    scoreFetch(LearnerId, TopicId);
  }, []);

  const scoreFetch = async (LearnerId, TopicId) => {
    try {
      const ScoreDataArray = await TopicScoreApi(LearnerId, TopicId);
      console.log(
        "ScoreDataArray",
        ScoreDataArray[0].score,
        ScoreDataArray[0].passMark
      );
      setViewScoresList(ScoreDataArray);
    } catch (error) {
      console.error("error in fetch", error);
    }
  };

  return (
    <>
      <LearnerNavbar />
      <div className="mt-5">
        <div className="container">
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Course Name</TableCell>
                  <TableCell>Topic Name</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Scores Status</TableCell>
                  <TableCell>Completion Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ViewScoresList.map((scoreItem, index) => (
                  <Row
                    key={index}
                    row={scoreItem}
                    score={scoreItem.score}
                    passmark={scoreItem.passMark}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}

function Row(props) {
  const { row, score, passmark } = props;
  const [open, setOpen] = useState(false);
  const [Passorfail, setPassorFail] = useState("Fail");
  const [reattemptClicked,setReattemptClicked]=useState(false);

  console.log("Row s p", score, passmark);

  useEffect(() => {
    PassorFail(score, passmark);
  }, [score, passmark]);

  const PassorFail = async (score, passmark) => {
    if (score >= passmark) {
      setPassorFail("Pass");
    }
  };

  const handleReattempt = () => {
    // Implement reattempt logic here
    console.log("Reattempt");
    setReattemptClicked(true);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.courseTitle}</TableCell>
        <TableCell>{row.topicName}</TableCell>
        <TableCell>{row.score}</TableCell>

        <TableCell>
          <span style={{ color: Passorfail === "Fail" ? "red" : "green" }}>
            {Passorfail}
          </span>
        </TableCell>
        <TableCell>
          {Passorfail === "Fail" && !reattemptClicked ? (
            <button style={{ marginLeft: "2%", backgroundColor: "midnightblue", color: "#fff", width: 100 }} onClick={handleReattempt} >Re-attempt</button>
          ) : (
            <span style={{ color: "green" }}>Completed</span>
          )}
        </TableCell>
        <TableCell>{row.CompletionStatus}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
         
        </TableCell>
      </TableRow>
    </>
  );
}

export default TopicScore;