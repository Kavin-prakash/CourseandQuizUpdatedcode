import React, { useState, useEffect } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Box from '@mui/material/Box';
import { Container, Overlay, Row } from "react-bootstrap";

function PDFViewer(prop) {
  const [error, setError] = useState(null);
  const { material } = prop;
  const [viewpdf, setViewPdf] = useState(material);
  useEffect(() => {
    setViewPdf(material)
  }, [material]);
  return (
    <Container>
      <Row className="justify-content-md-center">
        <div
           className="container"
           style={{ width: "70%",height:"83vh",marginTop:'0px'}}
       > 
        <Box sx={{
         width: { xs: '100%', sm: '65vh', md: '55vh', lg: "77" },
         height: { xs: '100%', sm: '83vh', md: '95vh', lg: "83" },

          overflow: 'auto',
          marginTop: '7px'
        }} className="pdf-container">
          {error ? (
            <div className="error">{error}</div>
          ) : (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              {viewpdf ? (
                <Viewer fileUrl={viewpdf} />
              ) : (
                <div>Loading.....</div>
              )}
            </Worker>
          )}
        </Box>
        </div>

      </Row>
    </Container>
  );
}


export default PDFViewer;

