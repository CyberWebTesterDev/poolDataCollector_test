// @flow

//print-and-scan-page-actions.js


import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import type { TGetState } from '@/reducers';
import { saveRejectReason, rejectTask } from '@/modules/application';
import { getDataForRejectReasonSave } from '@/modules/modals/request-rejection-modal';
import { getApplicationMetaData } from '@/modules/application/application-selectors/application-application-meta-data';
import { redirectToRootPage } from '@/routes-utils';
import { SALES_CHANNEL } from '@/modules/dictionaries';
import { delete5NtAccount } from './modules/5nt-iteraction';
import { getIsReverseAccountAvailableOnReject } from './print-and-scan-page-selectors';
import { PRINT_AND_SCAN_ACTIONS_NAMESPACE } from './print-and-scan-page-constants';

export const namespaceActionType = (type: string) => `${PRINT_AND_SCAN_ACTIONS_NAMESPACE}/${type}`;

export const rejectApplication = (reasonId: string, methodName: string): ThunkAction => async (
  dispatch: ThunkDispatch,
  getState: TGetState,
) => {
  const state = getState();
  const applicationMetaData = getApplicationMetaData(state);
  const { saleChannel = '' } = applicationMetaData;

  if (saleChannel === SALES_CHANNEL.CODES.GPB_PARTNER) {
    const isReverseAccountAvailableOnReject = getIsReverseAccountAvailableOnReject(state);

    if (isReverseAccountAvailableOnReject) {
      await dispatch(delete5NtAccount());
    }
  }

  await dispatch(saveRejectReason(getDataForRejectReasonSave));
  dispatch(rejectTask(reasonId, methodName));
  redirectToRootPage();
};

export const SET_BATCH_FILES_UPLOAD_ATTEMPT = namespaceActionType('SET_BATCH_FILES_UPLOAD_ATTEMPT');
export const setBatchFilesUploadAttempt = () => ({
  type: SET_BATCH_FILES_UPLOAD_ATTEMPT,
  payload: true,
});



//REDUCERS


// @flow
import { type Reducer } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { storeManager } from '@/modules/store-manager';
import type { ConnectionStatusType } from '@/modules/service-connector';
import { serviceConnectorReducer, SERVICE_CONNECTOR_STORE_KEY } from '@/modules/service-connector';
import { blockingRequestsLoaderReducer, BLOCKING_REQUESTS_LOADER_STORE_KEY } from '@/modules/blocking-requests-loader';
import { notificationsReducer, NOTIFICATIONS_STORE_KEY } from '@/modules/notifications';
import { DICTIONARIES_STORE_KEY, dictionariesReducer } from '@/modules/dictionaries';
import { PAGE_SIDEBAR_STORE_KEY, pageSidebarReducer } from '@/modules/page-sidebar';
import type { PageSidebarStateType } from '@/modules/page-sidebar';
import type { DictionariesState } from '@/modules/dictionaries';
import { NEW_CREDIT_REQUEST_PAGE_STORE_KEY, newCreditRequestPageReducer } from '@/pages/new-credit-request-page';
import {
  CREDIT_REQUEST_APPLICATION_STORE_KEY,
  creditRequestApplicationPageReducer,
} from '@/pages/credit-request-application-page';
import type { NewCreditRequestPageState } from '@/pages/new-credit-request-page';
import { AUTH_STORE_KEY, authReducer } from '@/modules/auth';
import type { AuthState } from '@/modules/auth';
import { AUTO_DOC_STORE_KEY, autoDocServicesNamesReducer } from '@/pages/auto-doc';
import { MODALS_STORE_KEY, modalsReducer } from '@/modules/modals';
import { APPLICATIONS_CATALOG_PAGE_STORE_KEY, applicationsCatalogPageReducer } from '@/pages/applications-catalog-page';
import type { ApplicationsCatalogPageState } from '@/pages/applications-catalog-page';
import { ACCOUNT_SELECT_STORE_KEY, accountSelectPageReducer } from '@/pages/account-select-page';
import type { AccountSelectPageState } from '@/pages/account-select-page';
import type { TUnderwritingPageState } from '@/pages/underwriting-page';
import { UNDERWRITING_STORE_KEY, underwritingPageReducer } from '@/pages/underwriting-page';
import { PAGE_MAIN_HEADER_STORE_KEY, pageMainHeaderReducer } from '@/modules/page-main-header';
import type { PageMainHeaderState } from '@/modules/page-main-header';
import { PRINT_AND_SCAN_STORE_KEY, printAndScanPageReducer } from '@/pages/print-and-scan-page';
import type { PrintAndScanPageState } from '@/pages/print-and-scan-page';
import { APPLICATION_STORE_KEY, applicationReducer } from '@/modules/application';
import type { ApplicationStateType } from '@/modules/application';
import { CONTROLLER_PAGE_STORE_KEY, controllerPageReducer } from '@/pages/controller-page';
import type { ControllerPageState } from '@/pages/controller-page';
import { PHOTO_ALBUM_STORE_KEY, photoAlbumPageReducer } from '@/pages/photo-album-page';
import type { PhotoAlbumPageStateTypes } from '@/pages/photo-album-page';
import { PHOTO_ALBUM_FOLDER_STORE_KEY, photoAlbumFolderPageReducer } from '@/pages/photo-album-folder-page';
import type { PhotoAlbumFolderPageTypes } from '@/pages/photo-album-folder-page';
import { PHOTO_ALBUM_PREVIEW_STORE_KEY, photoAlbumPreviewPageReducer } from '@/pages/photo-album-preview-page';
import type { PhotoAlbumPreviewPageTypes } from '@/pages/photo-album-preview-page';
import { OFFER_PARAMETERS_PAGE_STORE_KEY, offerParametersPageReducer } from '@/pages/offer-parameters-page';
import type { OfferParametersPageReducerType } from '@/pages/offer-parameters-page';
import { ROLE_GROUP_USERS_STORE_KEY, roleAndGroupUsersReducer } from '@/modules/role-and-group-users';
import type { RoleUsersStateType } from '@/modules/role-and-group-users';
import { ERROR_PROCESSING_STORE_KEY, errorProcessingPageReducer } from '@/pages/error-processing-page';
import type { ErrorProcessingPageTypes } from '@/pages/error-processing-page';
import { currentPageSetterReducer, CURRENT_PAGE_STORE_NAME } from '@/modules/current-page-setter';
import { CONFIG_SERVICE_MODULE_NAME, configServiceReducer } from '@/modules/config-service';
import type { TConfigServiceState } from '@/modules/config-service';
import { STATUS_LOG_STORE_KEY, statusLogReducer } from '@/modules/status-log';
import type { StatusLogStateType } from '@/modules/status-log';
import { verificationPageReducer, VERIFICATION_STORE_KEY } from '@/pages/verification-page';
import type { VerificationPageState } from '@/pages/verification-page';
import { timeoutPageReducer, TIMEOUT_STORE_KEY } from '@/pages/timeout-page';
import type { DictionaryManagerPageStateType } from '@/pages/dictionary-manager';
import { DICTIONARY_MANAGER_PAGE_STORE_KEY, dictionaryManagerReducer } from '@/pages/dictionary-manager';
import { ADDRESS_VERIFICATION_STORE_KEY, addressVerificationReducer } from '@/modules/addresses';
import type { AddressVerificationStore } from '@/modules/addresses';
import type { TStompUIState } from '@/pages/stomp-ui-page';
import { stompUIReducer, STOMP_UI_STORE_KEY } from '@/pages/stomp-ui-page';
import type { TAdministrationPageState } from '@/pages/administration-page';
import { administrationPageReducer, ADMINISTRATION_PAGE_STORE_KEY } from '@/pages/administration-page';
import {
  photoAlbumExternalPageReducer,
  PHOTO_ALBUM_EXTERNAL_PAGE_KEY,
  type PhotoAlbumExternalPageReducerType,
} from '@/pages/photo-album-external-page';
import {
  type PhotoAlbumPreviewExternalPageType,
  photoAlbumPreviewExternalPageReducer,
  PHOTO_ALBUM_PREVIEW_EXTERNAL_PAGE_STORE_KEY,
} from '@/pages/photo-album-preview-external-page';
import {
  changeCreditConditionsPageReducer,
  CHANGE_CREDIT_CONDITIONS_PAGE_STORE_KEY,
  type TChangeCreditRequestPageState,
} from '@/pages/change-credit-conditions-page';
import { reduxFormPlugin } from './redux-form-plugin';

// NOTE нельзя использовать константы из-за особенностей FLOW
type TApplicationStaticState = {
  'dictionaries': DictionariesState,
  'dictionariesList': Object,
  'page-sidebar': PageSidebarStateType,
  'auth': AuthState,
  'service-connector': ConnectionStatusType,
  'address-verification': AddressVerificationStore,
  'blocking-requests-loader': { [key: string]: boolean },
  'form': Object,
  'modals': Object,
  'notifs': Object,
  'credit-request-application': Object,
  'page-main-header': PageMainHeaderState,
  'application': ApplicationStateType,
  'role-and-group-users': RoleUsersStateType,
  'current-page': string,
  'config-service': TConfigServiceState,
  'status-log': StatusLogStateType,
  'verification': VerificationPageState,
};

type TApplicationDynamicState = $Shape<{
  'account-select': AccountSelectPageState,
  'administration-page': TAdministrationPageState,
  'applications-catalog': ApplicationsCatalogPageState,
  'auto-docs-page': { serviceData: Object, serviceNames: Object },
  'change-credit-conditions': TChangeCreditRequestPageState,
  'controller': ControllerPageState,
  'credit-request-application': {},
  'dictionary-manager-page': DictionaryManagerPageStateType,
  'error-processing': ErrorProcessingPageTypes,
  'new-credit-request': NewCreditRequestPageState,
  'offer-parameters-page': OfferParametersPageReducerType,
  'photo-album': PhotoAlbumPageStateTypes,
  'photo-album-external': PhotoAlbumExternalPageReducerType,
  'photo-album-folder': PhotoAlbumFolderPageTypes,
  'photo-album-preview-external-page': PhotoAlbumPreviewExternalPageType,
  'photo-album-preview': PhotoAlbumPreviewPageTypes,
  'print-and-scan': PrintAndScanPageState,
  'stomp-ui-page': TStompUIState,
  'timeout': Object,
  'underwriting': TUnderwritingPageState,
}>;
export type TPossibleDynamicStateKeys = $Keys<TApplicationDynamicState>;

export type ApplicationState = TApplicationStaticState & TApplicationDynamicState;
export type TGetState = () => ApplicationState;

export type TStaticReducers = { [key: $Keys<TApplicationStaticState>]: Reducer<any, any> };
const staticReducers: TStaticReducers = {
  [ADDRESS_VERIFICATION_STORE_KEY]: addressVerificationReducer,
  [APPLICATION_STORE_KEY]: applicationReducer,
  [AUTH_STORE_KEY]: authReducer,
  [BLOCKING_REQUESTS_LOADER_STORE_KEY]: blockingRequestsLoaderReducer,
  [CONFIG_SERVICE_MODULE_NAME]: configServiceReducer,
  [CURRENT_PAGE_STORE_NAME]: currentPageSetterReducer,
  [DICTIONARIES_STORE_KEY]: dictionariesReducer,
  form: formReducer.plugin(reduxFormPlugin),
  [MODALS_STORE_KEY]: modalsReducer,
  [NOTIFICATIONS_STORE_KEY]: notificationsReducer,
  [PAGE_MAIN_HEADER_STORE_KEY]: pageMainHeaderReducer,
  [PAGE_SIDEBAR_STORE_KEY]: pageSidebarReducer,
  [ROLE_GROUP_USERS_STORE_KEY]: roleAndGroupUsersReducer,
  [SERVICE_CONNECTOR_STORE_KEY]: serviceConnectorReducer,
  [STATUS_LOG_STORE_KEY]: statusLogReducer,
  [VERIFICATION_STORE_KEY]: verificationPageReducer,
};

export type TDynamicReducers = { [key: $Keys<TApplicationDynamicState>]: Reducer<any, any> };
const dynamicReducers: TDynamicReducers = {
  [ACCOUNT_SELECT_STORE_KEY]: accountSelectPageReducer,
  [ADMINISTRATION_PAGE_STORE_KEY]: administrationPageReducer,
  [APPLICATIONS_CATALOG_PAGE_STORE_KEY]: applicationsCatalogPageReducer,
  [AUTO_DOC_STORE_KEY]: autoDocServicesNamesReducer,
  [CHANGE_CREDIT_CONDITIONS_PAGE_STORE_KEY]: changeCreditConditionsPageReducer,
  [CONTROLLER_PAGE_STORE_KEY]: controllerPageReducer,
  // TODO [GriAN] - Dmitrii Korotkov = редьюсер модуля должен подключаться не глобально а в
  // стор страницы, на которой используется
  [CREDIT_REQUEST_APPLICATION_STORE_KEY]: creditRequestApplicationPageReducer,
  [DICTIONARY_MANAGER_PAGE_STORE_KEY]: dictionaryManagerReducer,
  [ERROR_PROCESSING_STORE_KEY]: errorProcessingPageReducer,
  [NEW_CREDIT_REQUEST_PAGE_STORE_KEY]: newCreditRequestPageReducer,
  [OFFER_PARAMETERS_PAGE_STORE_KEY]: offerParametersPageReducer,
  [PHOTO_ALBUM_STORE_KEY]: photoAlbumPageReducer,
  [PHOTO_ALBUM_EXTERNAL_PAGE_KEY]: photoAlbumExternalPageReducer,
  [PHOTO_ALBUM_FOLDER_STORE_KEY]: photoAlbumFolderPageReducer,
  [PHOTO_ALBUM_PREVIEW_EXTERNAL_PAGE_STORE_KEY]: photoAlbumPreviewExternalPageReducer,
  [PHOTO_ALBUM_PREVIEW_STORE_KEY]: photoAlbumPreviewPageReducer,
  [PRINT_AND_SCAN_STORE_KEY]: printAndScanPageReducer,
  [STOMP_UI_STORE_KEY]: stompUIReducer,
  [TIMEOUT_STORE_KEY]: timeoutPageReducer,
  [UNDERWRITING_STORE_KEY]: underwritingPageReducer,
};

export const reducers = storeManager(staticReducers, dynamicReducers);












////////////////////STORE



// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { compact } from 'lodash';
import { showNotificationOfServiceError } from '@/utils/service-helper';
import { reducers } from './reducers';

export const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk, showNotificationOfServiceError),
    // $FlowIgnore Can't type
    ...compact([window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ maxAge: 10 })]),
  ),
);

// [Dinislam Maushov] 02.07.2019 this line allows you to use store.getState in case your redux devtool doesnt work
if (process.env.NODE_ENV === 'development') {
  window.getState = store.getState;
}



export const sendMessage = (
    endpoint: EndPointType,
    payload: any,
    dispatch?: Dispatch<*> | ThunkDispatch<*>,
    headers?: Object,
  ): Promise<*> => sendMessageLib({
    endpoint,
    message: payload,
    onFetchStart: (name: string) => {
      if (dispatch) {
        return dispatch(block(name));
      }
    },
    onFetchEnd: (name: string) => {
      if (dispatch) {
        return dispatch(unblock(name));
      }
    },
    headers,
  }).catch((error: TServiceMessageError) => {
    if (dispatch) {
      dispatch(unblock(endpoint.name));
      if (Object.values(TOKEN_ERRORS).includes(error.headers.gpb_process_result)) {
        dispatch(setShouldUpdateToken(true));
      }
      const errorMessage = `${error.headers.gpb_origin_service} \n ${error.headers.gpb_error_desc}
        Код ошибки: ${error.headers.gpb_process_result}`;
      warn(errorMessage);
    }
    return Promise.reject(error);
  });







  const requestBuildVersion = (): Promise<VersionResponseType> => axios.get(restPoints.buildVersion.url);