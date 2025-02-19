import { takeLatest, call, put } from 'redux-saga/effects';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  restoreSessionRequest,
  restoreSessionSuccess,
  restoreSessionFailure,
} from '../slices/authSlice';
import AuthService from '../../services/auth/authService';
import { LoginCredentials, LoginResponse } from '../types/auth';

function* loginSaga(action: ReturnType<typeof loginRequest>) {
  try {
    const response: LoginResponse = yield call([AuthService, 'login'], action.payload);
    yield call([AuthService, 'setupAxiosInterceptors']);
    yield put(loginSuccess(response));
  } catch (error) {
    yield put(loginFailure(error instanceof Error ? error.message : 'Erreur de connexion'));
  }
}

function* logoutSaga() {
  try {
    yield call([AuthService, 'logout']);
    yield put(logoutSuccess());
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    // On déconnecte quand même l'utilisateur localement
    yield put(logoutSuccess());
  }
}

function* restoreSessionSaga() {
  try {
    const session: LoginResponse | null = yield call([AuthService, 'restoreSession']);
    yield put(restoreSessionSuccess(session));
  } catch (error) {
    yield put(restoreSessionFailure());
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
  yield takeLatest(restoreSessionRequest.type, restoreSessionSaga);
}
