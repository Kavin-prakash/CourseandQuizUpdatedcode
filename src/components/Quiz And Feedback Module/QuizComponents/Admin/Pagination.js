import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
// import "../../../../Styles/Quiz And Feedback Module/Pagination.css";

export default function BasicPagination({
  totalQuestions,
  questionsPerPage,
  page,
  onPageChange,
}) {
  // Calculate the total number of pages
  const pageCount = Math.ceil(totalQuestions / questionsPerPage);

  return (
    <Stack spacing={2}>
      <Pagination
        count={pageCount}
        page={page}
        onChange={onPageChange}
        variant="outlined"
        color="primary"
        className="pagination"
      />
    </Stack>
  );
}
