const enrollmentMiddleware = async (courseId, learnerId) => {
    const enrollmentEndpoint = "http://localhost:5199/lxp/enroll";
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: courseId,
        learnerId: learnerId,
        enrollmentDate: new Date().toISOString(),
        enrollStatus: true,
        enrollRequestStatus: true,
      }),
    };
 
    try {
      const response = await fetch(enrollmentEndpoint, request);
      if (response.ok) {
        const data = await response.json();
        console.log("Enroll success", data);
      } else {
        const errorText = await response.text();
        console.error("Server Error Response:", errorText);
      }
    } catch (error) {
      console.error("Enrollment Error:", error);
    }
 
};
 
export default enrollmentMiddleware;