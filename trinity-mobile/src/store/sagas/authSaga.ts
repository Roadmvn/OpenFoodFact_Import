import { takeLatest, call, put } from 'redux-saga/effects';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  logoutSuccess,
  restoreSessionRequest,
  restoreSessionSuccess,
  restoreSessionFailure,
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
} from '../slices/authSlice';
import AuthService from '../../services/auth/authService';
import { LoginCredentials, LoginResponse, RegisterCredentials, User } from '../types/auth';

function* loginSaga(action: ReturnType<typeof loginRequest>) {
  try {
    const response: LoginResponse = yield call([AuthService, 'login'], action.payload);
    yield call([AuthService, 'setupAxiosInterceptors']);
    yield put(loginSuccess(response));
  } catch (error) {
    yield put(loginFailure(error instanceof Error ? error.message : 'Erreur de connexion'));
  }
}

function* registerSaga(action: ReturnType<typeof registerRequest>) {
  try {
    const response: LoginResponse = yield call([AuthService, 'register'], action.payload);
    yield call([AuthService, 'setupAxiosInterceptors']);
    yield put(registerSuccess(response));
  } catch (error) {
    yield put(registerFailure(error instanceof Error ? error.message : 'Erreur lors de l\'inscription'));
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

function* fetchProfileSaga() {
  try {
    const user: User = yield call([AuthService, 'getCurrentUser']);
    yield put(fetchProfileSuccess(user));
  } catch (error) {
    yield put(fetchProfileFailure(error instanceof Error ? error.message : 'Erreur lors de la récupération du profil'));
  }
}

function* updateProfileSaga(action: ReturnType<typeof updateProfileRequest>) {
  try {
    const user: User = yield call([AuthService, 'updateProfile'], action.payload);
    yield put(updateProfileSuccess(user));
    // Afficher un message de succès
    // TODO: Implémenter un système de toast/notification
  } catch (error) {
    yield put(updateProfileFailure(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil'));
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
  yield takeLatest(restoreSessionRequest.type, restoreSessionSaga);
  yield takeLatest(fetchProfileRequest.type, fetchProfileSaga);
  yield takeLatest(updateProfileRequest.type, updateProfileSaga);
}
