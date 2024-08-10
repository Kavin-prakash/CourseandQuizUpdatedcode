
import React, { useState, useEffect } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchPdfRequest } from "../../actions/LearnerAction/FetchPdfAction";
import { Container, Row } from "react-bootstrap";
import { watchTimeRequest } from "../../actions/LearnerAction/WatchTimeAction";
function PDFViewer(prop) {
  const [error, setError] = useState(null);
  const { material, materialId } = prop;
  const [viewpdf, setViewPdf] = useState(material);
  const dispatch = useDispatch();
  const [fileResponse, setFileResponse] = useState([]);
  const learnerId = sessionStorage.getItem('UserSessionID')
  const newPlugin = defaultLayoutPlugin({
    toolbar: {
      download: {
        enabled: false, // Disable the download button
      },
    },
  });
  useEffect(() => {
    setViewPdf(material)
  }, [material])


  useEffect(() => {

    const learnerprogressdata = {
      materialId: materialId,
      learnerId: sessionStorage.getItem("UserSessionID"),
      watchTime: "01:00:00"
    }
    dispatch(watchTimeRequest(learnerprogressdata));

  }, []);

  return (
    <Container >
      <Row className="justify-content-md-center">
        <div
          className="container"
          style={{ width: "100%", height: "100vh", overflow: "auto", marginTop: '7px' }}
        >
          <div className="pdf-container" style={{ width: 1250 }}>
            {error && <div className="error">{error}</div>}
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              {viewpdf ? (
                <Viewer fileUrl={viewpdf} plugins={[newPlugin]} />
              ) : (
                <div>No PDF available</div>
              )}
            </Worker>
          </div>
        </div>
      </Row>
    </Container>
  );
}

export default PDFViewer;