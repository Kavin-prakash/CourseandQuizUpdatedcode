export const FETCH_EDIT_TOPICS_REQUEST = 'FETCH_EDIT_TOPICS_REQUEST';
export const FETCH_EDIT_TOPICS_SUCCESS = 'FETCH_EDIT_TOPICS_SUCCESS';
export const FETCH_EDIT_TOPICS_FAILURE = 'FETCH_EDIT_TOPICS_FAILURE';
// export const FETCH_EDIT_TOPIC_EXIST='FETCH_EDIT_TOPIC_EXIST' ; 
  
export const fetchEditTopicsRequest = (formData) => ({
    type: FETCH_EDIT_TOPICS_REQUEST,
    payload: formData
    
  });
   
export const fetchEditTopicsSuccess = (topics) => ({
    type: FETCH_EDIT_TOPICS_SUCCESS,
    payload: topics,
    
  });
   
export const fetchEditTopicsFailure = (error) => ({
    type: FETCH_EDIT_TOPICS_FAILURE,
    payload: error,
  });

  // export const fetchEditTopicsExists = () => ({
  //   type: FETCH_EDIT_TOPICS_FAILURE,
    
  // }); 