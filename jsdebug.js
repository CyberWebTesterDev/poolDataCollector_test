// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import {
  compact,
  toString,
} from 'lodash';
import { compose } from 'redux';
import { submit } from 'redux-form';
import type { ButtonType } from '@/components/buttons-section';
import { ButtonsSection } from '@/components/buttons-section';
import {
  hasRefinancingObligationInputTask,
  getApplicationSequence,
} from '@/modules/application';
import { fetchApplicationHistory } from '@/modules/application-history';
import { withModals, MODALS } from '@/modules/modals';
import { withStatusLog } from '@/modules/status-log';
import {
  openPathInNewWindow,
  toCreditRequestParametersPage,
  redirectToChangeCreditPage,
} from '@/routes-utils';
import { saveApplicationChanges } from '../../credit-request-application-page-actions';
import { CREDIT_REQUEST_APPLICATION_FORM_NAME } from '../../credit-request-application-page-constants';
import {
  getShowButtonsWithPermissions,
  getToCreditRequestParametersBtnIsVisible,
  getIsPrintAndViewButtonVisibleForAuditor,
  getIsCommentsBtnVisibleForFrontAnalytics,
  getShowCommentsButtonIsDisabled,
  getSendTorocessingDisabled,
  getPrintAndViewButtonIsDisabled,
  getPostponeButtonIsDisabled,
  getRejectionButtonIsDisabled,
  getApplicationFormValidationErrors,
  getIsShowAccountsAndScans,
  getIsCommentsBtnVisibleForSfo,
  getShowChangeInitialCreditParamsBtn,
} from './credit-request-application-page-buttons-section-selectors';
import type {
  ButtonsSectionPropTypes,
} from './credit-request-application-page-buttons-section-types';
import {
  block,
  creditHistoryButton,
  postponeButton,
  printAndViewButton,
  processingButton,
  rejectionButton,
  showAccountAndScanButton,
  showCommentsButton,
  statusLogButton,
  toCreditRequestParametersButton,
  toChangeInitialCreditParamsButton,
} from './credit-request-application-page-buttons-section-constants';
import './credit-request-application-page-buttons-section.scss';

class ButtonsSectionControllerComponent extends React.PureComponent<ButtonsSectionPropTypes> {
  componentDidMount() {
    this.props.fetchApplicationHistory();
  }

  showRejectionModal = () => this.props.showModal({ name: MODALS.REQUEST_REJECTION });

  toCreditRequestParametersPage = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const requestId = toString(this.props.applicationSequence);
    const toCreditRequestParametersPath = toCreditRequestParametersPage({ requestId });
    openPathInNewWindow(toCreditRequestParametersPath);
  };

  toCreditRequestChangeParametrsPage = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const requestId = toString(this.props.applicationSequence);
    this.props.saveApplicationChanges().then(() => redirectToChangeCreditPage({ requestId }));
  };

  getButtons = () => {
    // getButtons optimized by incoming props with reselect and React.PureComponent
    const {
      isCommentsBtnVisibleForSfo,
      showAccountsAndScans,
      toCreditRequestParametersBtnIsVisible,
      isPrintAndViewButtonVisibleForAuditor,
      isCommentsBtnVisibleForFrontAnalytics,
      showChangeInitialCreditParamsBtn,
    } = this.props;

    const statusLogBtn: ButtonType = {
      ...statusLogButton,
      onClick: this.props.showStatusLog,
    };

    const creditHistoryBtn: ButtonType = {
      ...creditHistoryButton,
      onClick: this.props.showCreditHistory,
    };

    const showAccountAndScanBtn: ButtonType = {
      ...showAccountAndScanButton,
    };

    const showCommentsBtn: ButtonType = {
      ...showCommentsButton,
      disabled: this.props.showCommentsButtonIsDisabled,
      onClick: this.props.showComments,
    };

    const processingBtn: ButtonType = {
      ...processingButton,
      onClick: this.handleProcessingBtnClick,
      validationErrors: this.props.formValidationErrors,
      disabled: this.props.sendToProcessingDisabled,
    };

    const printAndViewBtn: ButtonType = {
      ...printAndViewButton,
      label: `Просмотр и печать ${this.props.isRefinancingObligationInput ? 'приложения' : 'анкеты и согласий'}`,
      disabled: this.props.printAndViewButtonIsDisabled,
      onClick: this.props.downloadApplicationForm,
    };

    const postponeBtn: ButtonType = {
      ...postponeButton,
      disabled: this.props.postponeButtonIsDisabled,
      onClick: this.props.postpone,
    };

    const rejectionBtn: ButtonType = {
      ...rejectionButton,
      disabled: this.props.rejectionButtonIsDisabled,
      onClick: this.showRejectionModal,
    };

    const toCreditRequestParametersBtn: ButtonType = {
      ...toCreditRequestParametersButton,
      onClick: this.toCreditRequestParametersPage,
    };

    const toChangeInitialCreditParamsBtn: ButtonType = {
      ...toChangeInitialCreditParamsButton,
      title: 'Изменить условия кредита',
      onClick: this.toCreditRequestChangeParametrsPage,
    };

    const withoutPermissionButtons: Array<ButtonType> = compact([
      showAccountsAndScans ? showAccountAndScanBtn : null,
      processingBtn,
      isCommentsBtnVisibleForSfo ? showCommentsBtn : null,
      statusLogBtn,
      printAndViewBtn,
      showChangeInitialCreditParamsBtn ? toChangeInitialCreditParamsBtn : null,
      postponeBtn,
      rejectionBtn,
    ]);

    const buttonsForAuditors: Array<ButtonType> = compact([
      showAccountsAndScans ? showAccountAndScanBtn : null,
      toCreditRequestParametersBtnIsVisible ? toCreditRequestParametersBtn : null,
      statusLogBtn,
      isPrintAndViewButtonVisibleForAuditor ? printAndViewBtn : null,
      creditHistoryBtn,
      isCommentsBtnVisibleForFrontAnalytics ? showCommentsBtn : null,
    ]);

    return this.props.showButtonsWithPermissions ? buttonsForAuditors : withoutPermissionButtons;
  };

  handleProcessingBtnClick = () => {
    this.props.handleSendToProcessing();
    this.props.submit(CREDIT_REQUEST_APPLICATION_FORM_NAME);
  };

  render() {
    return (
      <ButtonsSection buttons={this.getButtons()} className={block.block()} />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  applicationSequence: getApplicationSequence,
  showAccountsAndScans: getIsShowAccountsAndScans,
  isRefinancingObligationInput: hasRefinancingObligationInputTask,
  isCommentsBtnVisibleForSfo: getIsCommentsBtnVisibleForSfo,
  isCommentsBtnVisibleForFrontAnalytics: getIsCommentsBtnVisibleForFrontAnalytics,
  showButtonsWithPermissions: getShowButtonsWithPermissions,
  toCreditRequestParametersBtnIsVisible: getToCreditRequestParametersBtnIsVisible,
  isPrintAndViewButtonVisibleForAuditor: getIsPrintAndViewButtonVisibleForAuditor,
  showCommentsButtonIsDisabled: getShowCommentsButtonIsDisabled,
  sendToProcessingDisabled: getSendTorocessingDisabled,
  printAndViewButtonIsDisabled: getPrintAndViewButtonIsDisabled,
  postponeButtonIsDisabled: getPostponeButtonIsDisabled,
  rejectionButtonIsDisabled: getRejectionButtonIsDisabled,
  formValidationErrors: getApplicationFormValidationErrors,
  showChangeInitialCreditParamsBtn: getShowChangeInitialCreditParamsBtn,
});

const mapDispatchToProps = {
  fetchApplicationHistory,
  submit,
  saveApplicationChanges,
};

export const CreditRequestApplicationPageButtonsSectionController = compose(
  withRouter,
  withStatusLog(),
  connect(mapStateToProps, mapDispatchToProps),
  withModals,
)(ButtonsSectionControllerComponent);