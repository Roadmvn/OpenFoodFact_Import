import { takeLatest, put, call } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { loginRequest, loginSuccess, loginFailure } from '../slices/authSlice';
import { AuthService } from '../../services/authService';

function* handleLogin(action: PayloadAction<{ email: string; password: string }>) {
  try {
    const { email, password } = action.payload;
    const response = yield call(AuthService.login, email, password);
    yield put(loginSuccess(response));
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

export function* watchAuth() {
  yield takeLatest(loginRequest.type, handleLogin);
}
