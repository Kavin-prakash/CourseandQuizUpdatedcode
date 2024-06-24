// import React from 'react'
// import { Container, Row ,Col} from 'react-bootstrap'
// import { Card,CardMedia,Typography,CardContent,CardActionArea } from '@mui/material'
// import { Connect, connect } from 'react-redux'
// import { fetchquizfailedusersRequest } from '../../../actions/Admin/QuizFailedUserAction'
// import { useParams } from 'react-router-dom'
// import { useState,useEffect } from 'react'
// const QuizFailedReport = ({fetchfailedusers,quizfailesdusers}) => {


//   // Impletment the UseStates for the Search and Filter

//   const [searchfailedusers, setSearchfailedusers] = useState('');
//   const [filtersearchfailedusers, setFilteredsearchfailedusers] = useState([]);

//   console.log(searchfailedusers)



//   // Get the Quiz from the Page 

//   const FailedUserQuizId=useParams();
//   console.log("Checking the Quiz Id for the Quiz Failes Users", FailedUserQuizId);



//   // UseEffect for the get the data 

//   useEffect(() => {
//     fetchfailedusers(FailedUserQuizId);
// }, [fetchfailedusers, FailedUserQuizId]);




// useEffect(() => {

//   setFilteredsearchfailedusers(
//          quizfailesdusers.filter((filterfaileduser) =>
//               Object.values(filterfaileduser).some((value) =>
//                   value !== null && value.toString().toLowerCase().includes(searchfailedusers.toLowerCase())
//               )
//           )
//       );

// }, [quizfailesdusers, searchfailedusers]);



//   return (
//     <>
//       <Container fluid className='mt-5'>
//         <>
//           <Row>
//             <Col xs={12} md={6}>
//               <form className="form-inline my-2 my-lg-0">
//                 <input
//                   className="form-control mr-sm-2"
//                   type="search"
//                   placeholder="Search"
//                   aria-label="Search"
//                   value={searchfailedusers}
//                   onChange={(e) => setSearchfailedusers(e.target.value)}
//                 />
//               </form>
//             </Col>
//           </Row>
//           <div className='scrollable-content'>
//             {filtersearchfailedusers.map((passeduser) => (
//               <Card key={passeduser.courseId} sx={{ maxWidth: 200, maxHeight: 250, mb: 5, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//                 <CardActionArea>
//                   <CardMedia
//                     component="img"
//                     image={passeduser.profilephoto}
//                     alt={passeduser.learnerName || 'Course image'}
//                     style={{
//                       height: '90px', width: '90px', alignContent: 'center',
//                       alignItems: 'center', borderRadius: '50%', marginInlineStart: '50px'
//                     }}
//                   />
//                   <CardContent>
//                     <Typography gutterBottom component="div">
//                       <b>Name:</b> {passeduser.learnerName}
//                     </Typography>
//                     <Typography variant="body2" gutterBottom color="text.secondary">  
//                       <b>Attempts :</b> {passeduser.totalNoofQuizAttempts}
//                     </Typography>
//                     <Typography variant="body2" gutterBottom style={{ color: 'red' }}>
//                       <b>Score :</b> {passeduser.score}
//                     </Typography>
//                   </CardContent>
//                 </CardActionArea>
//               </Card>
//             ))}
//           </div>
//         </>


//       </Container>

//     </>
//   )
// }


// const mapStateToProps = (state) => ({
//   quizfailesdusers: state.quizfailedusers.quizfaileduser
// });

// const mapDispatchToProps = (dispatch) => ({
//   fetchfailedusers: (FailedUserQuizId) => dispatch(fetchquizfailedusersRequest(FailedUserQuizId))
// });



// export default connect (mapStateToProps,mapDispatchToProps) (QuizFailedReport)


import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import { fetchquizfailedusersRequest } from '../../../actions/Admin/QuizFailedUserAction'
// import { fetchEnrollCourseLearnerRequest } from "../../actions/Admin/EnrollmentCourseLearners";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Tooltip from '@mui/material/Tooltip';
export default function QuizFailedReport() {
  const quizId = useParams();
  const dispatch = useDispatch();
  const enrolledlearners = useSelector((state) => state.quizfailedusers.quizfaileduser);
  useEffect(() => {
    dispatch(fetchquizfailedusersRequest(quizId))
  }, []);
  console.log(enrolledlearners);
  const rows = enrolledlearners;
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  //Comparator
  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  //Stable Sort for table
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  //Header for table
  const headCells = [
    {
      id: "sno",
      numeric: true,
      disablePadding: false,
      label: "S.No",
    },

    {
      id: "learnerName",
      numeric: false,
      disablePadding: false,
      label: "Name",
    },
    {
      id: "email",
      numeric: false,
      disablePadding: false,
      label: "Email",
    },
    {
      id: "score",
      numeric: false,
      disablePadding: false,
      label: "Score",
    },
    {
      id: "totalNoofQuizAttempts",
      numeric: true,
      disablePadding: false,
      label: "Total No of Quiz Attempts",
    },
    {
      id: "learnerAttempts",
      numeric: true,
      disablePadding: false,
      label: "Available attempts",
    },
  ];

  const pdfRef = React.useRef();
  let today = new Date();
  today.setDate(today.getDate());
  let month = String(today.getMonth() + 1).padStart(2, "0");
  let day = String(today.getDate()).padStart(2, "0");
  let Dates = day + "-" + month + "-" + today.getFullYear();
  const Exportreport = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.text('Failed Learner Details', 85, 12);
      pdf.setFontSize(5);
      pdf.text("Project Name - LXP " + today.toLocaleDateString() + " " + today.toLocaleTimeString(), 2, 15);
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Quiz_Failed_User_List_${Dates}.pdf`);
    });
  };

  //Component for Head in Table
  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead style={{ backgroundColor: "#23275c" }}>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "left" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{ color: "white" }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                style={{ color: "white" }}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  //Props for EnhancedHead Table
  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  //Table and props for toolbar

  function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          mt: 5,
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {/* {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h4"
            id="tableTitle"
            component="div"
            align="center"
          >
            Failed Learner Details
          </Typography>
        )} */}
      </Toolbar>
    );
  }

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  //Table for the Overall Component

  function EnhancedTable() {
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("S.no");
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const dense = true;
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [filteredUser, setFilteredUser] = React.useState([]);

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelected = rows.map((n) => n.id);
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    useEffect(() => {
      setFilteredUser(
        visibleRows.filter((row) =>
          Object.values(row).some((value) =>
            value !== null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
    });

    const visibleRows = React.useMemo(
      () =>
        stableSort(rows, getComparator(order, orderBy)).slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        ),
      [order, orderBy, page, rowsPerPage]
    );
    const [count, setCount] = React.useState(0);
    return (
      <Box sx={{ width: "100%" }}>
        <Paper
          sx={{
            width: "100%",
            mb: 2,
          }}
        >
          <EnhancedTableToolbar numSelected={selected.length} />
          <div style={{ display: "flex", padding: "10px" }}>
            <form className="form-inline my-2 my-lg-0">
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchTerm}
                style={{ width: "30vw" }}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <button
              className="btn btn-success"
              onClick={Exportreport}
              style={{ marginLeft: "48%" }}
            >
              Download Report
              <ArrowDownwardIcon />
            </button>
          </div>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h4"
            id="tableTitle"
            component="div"
            align="center"
          >
            Failed Learner Details
          </Typography>
          <div id="learnersreport" className="m-2">
            <TableContainer ref={pdfRef}>

              <Table
                sx={{ minWidth: 100 }}
                aria-labelledby="tableTitle"
                size={dense ? "medium" : "medium"}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {filteredUser.map((row, index) => {
                    const isItemSelected = isSelected(row.learnerID);

                    return (
                      <TableRow
                        hover
                        // onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.index}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                        style={{ textDecoration: 'none' }}
                        component={Link} to={'/individuallearner/' + row.learnerId}
                      >
                        <TableCell align="left">{index + 1}</TableCell>
                        {/* <TableCell align="center">
                                                    <Avatar alt={row.name} src={row.profilePhoto} />
                                                </TableCell> */}
                        <TableCell
                          component="th"
                          id={row.learnerID}
                          scope="row"
                          align="left"
                          padding="none"
                        >
                          {row.learnerName}
                        </TableCell>
                        <TableCell align="left">{row.emailId}</TableCell>
                        <TableCell align="left">
                          {row.score}
                        </TableCell>
                        <TableCell align="left">
                          <Tooltip title={'Total Attempts'}>
                            {row.totalNoofQuizAttempts}
                          </Tooltip>
                        </TableCell>
                        <TableCell align="left">
                          <Tooltip title={'Available attempts'}>
                            {row.learnerAttempts}
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <TablePagination
            rowsPerPageOptions={[
              { label: '5 Rows', value: 5 },
              { label: '10 rows', value: 10 },
              { label: '25 rows', value: 25 },
              { label: 'All', value: rows.length },
            ]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    );
  }

  return (
    <>
      <EnhancedTable />
    </>
  );
};