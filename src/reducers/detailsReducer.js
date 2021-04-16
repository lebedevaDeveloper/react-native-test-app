export const GET_DETAILS = "GET_DETAILS";
export const GET_DETAILS_SUCCESS = "GET_DETAILS_SUCCESS";
export const GET_DETAILS_FAIL = "GET_DETAILS_FAIL";

export default function detailsReducer(
  state = { details: {}, detailsLoading: false },
  action
) {
  switch (action.type) {
    case GET_DETAILS:
      return { ...state, detailsLoading: true };
    case GET_DETAILS_SUCCESS:
      return { ...state, detailsLoading: false, details: action.payload.data };
    case GET_DETAILS_FAIL:
      return {
        ...state,
        detailsLoading: false,
        error: "Error while fetching shows"
      };
    default:
      return state;
  }
}

export function getDetails(id) {
  return {
    type: GET_DETAILS,
    payload: {
      request: {
        url: `shows/${id}`
      }
    }
  };
}
