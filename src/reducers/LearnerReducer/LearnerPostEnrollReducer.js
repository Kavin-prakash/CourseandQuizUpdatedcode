import { ENROLL_REQUEST, ENROLL_SUCCESS, ENROLL_FAILURE, SET_IS_ENROLL_COURSE } from '../../actions/LearnerAction/LearnerPostEnrollAction';

const initialState = {
    enrolledCourses: [],
    loading: false,
    error: null,
    isRequesting:false
};

export default function LearnerPostEnrollReducer(state = initialState, action) {
    switch (action.type) {
        case ENROLL_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case ENROLL_SUCCESS:
            return {
                ...state,
                loading: false,
                enrolledCourses: [...state.enrolledCourses, { courseId: action.courseId, learnerId: action.learnerId }],
            };
        case ENROLL_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.error,
            };

            case SET_IS_ENROLL_COURSE:
                return{
                    ...state,
                    isRequestingOTP:action.payload,
                };
        default:
            return state;
    }
}