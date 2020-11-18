import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import * as type from "../TypeAction";
import axios from "axios";

import { registerSucced, registerFailed, submitUserReviewFailed } from "../actions/index";

const apiUrl = "http://localhost:8000/reviews";


export function* submitUserReviewInSaga(action) {
  
   const reviewUser = {
    content: action.payload.review,
    star: action.payload.rate,
    tourId: action.payload.tourId,
    placeId: action.payload.placeId
     

   }
  
  try {

    const token = JSON.parse(localStorage.getItem('token'))
    const headerAuth = {
      headers: { Authorization: 'Bearer ' + token }
  };


    const response = yield call(axios.post, apiUrl, reviewUser, headerAuth);

    if (response) {
      console.log('response', response)
      // yield put(submitUserReviewSucced());  
    }
  } catch (error) {
    yield put(submitUserReviewFailed(error.response.data));
    
    
  }
}

export default function* submitUserReviewSaga() {
  yield takeLatest(type.SUBMIT_USER_REVIEW_REQUEST, submitUserReviewInSaga);
}
