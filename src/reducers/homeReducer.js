export const GET_SHOWS = "GET_SHOWS";
export const GET_SHOWS_SUCCESS = "GET_SHOWS_SUCCESS";
export const GET_SHOWS_FAIL = "GET_SHOWS_FAIL";

export default function homeReducer(
  state = { shows: [], loading: false },
  action
) {
  switch (action.type) {
    case GET_SHOWS:
      return { ...state, loading: true };
    case GET_SHOWS_SUCCESS:
      return { ...state, loading: false, shows: action.payload.data };
    case GET_SHOWS_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while fetching shows"
      };
    default:
      return state;
  }
}

export function listShows(query) {
  return {
    type: GET_SHOWS,
    payload: {
      request: {
        url: `search/shows?q=${query}`
      }
    }
  };
}
