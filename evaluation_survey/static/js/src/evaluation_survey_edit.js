/* Javascript for EvaluationSurveyXBlock. */
function EvaluationSurveyXBlockEdit(runtime, element) {
    const self = this;

    const STATUS_ENUM = Object.freeze({
        NONE: '',
        SETTED: 'SETTED',
        PTD: 'PREPARED_TO_DISCONNECT',
        CONNECTED: 'CONNECTED'
    });
    const SELECT_ENUM = Object.freeze({
        NONE: '',
        CHANGED: 'CHANGED',
    });
    this.init = () => {
        this.selectTemplates = $('select.templates', element);
        this.actionCancelButton = $('.action-cancel', element);
        this.actionSaveButton = $('.action-save', element);
        this.actionConnectButton = $('.action-connect', element);
        this.actionDisconnectButton = $('.survey-action.action-disconnect', element);
        this.actionConnectButtonContainer = $('.action-connect-container', element);
        this.actionDisconnectButtonContainer = $('.action-disconnect-container', element);
        this.confirmDeleteContainer = $('.confirm-delete-container', element);
        this.confirmUpdateContainer = $('.confirm-update-container', element);
        this.settingsMainContainer = $('.evaluation-survey-main-settings', element)
        this.course_id = this.settingsMainContainer.data('course_id');
        this.surveyIdField = this.settingsMainContainer.data('survey_id');
        this.actionCancelButton.bind('click', this.onCancel);
        this.actionSaveButton.bind('click', this.preConnect);
        this.selectTemplates.bind('change', this.preSelect);
        this.actionDisconnectButton.bind('click', this.preDisconnect);
        this.submitHandlerUrl = runtime.handlerUrl(element, 'studio_submit');
        this.removeHandlerUrl = runtime.handlerUrl(element, 'studio_remove');
        this.surveyId = false;
        this.getTemplatesIds();
        this.state = { status: { main: STATUS_ENUM.NONE, select: SELECT_ENUM.NONE }, selectValue: this.selectTemplates.val() };
    }

    this.getTemplatesIds = () => {
        $.ajax({
            type: 'GET',
            url: '/api/survey/v1/templates/?course_id=' + encodeURIComponent(this.course_id),
            headers: {
                'X-CSRFToken': $.cookie('csrftoken')
            },
            success: self.addOptions
        });
    }
    this.addOptions = (payload) => {
        const selected = this.selectTemplates.data('template_id');
        if (payload.results) {
            payload.results.forEach(el => {
                if (el.published_version) {
                    $('select.templates', element).append(`<option value=${el.id}>${el.published_version.name}</option>`)
                }
            });
            this.state.status.select = STATUS_ENUM.SETTED;
            this.state.selectValue = this.selectTemplates.val();
        }
        $("#embedded_answers_edit_survey option:first").prop("selected", true);
        self.findSurveyId();
    }

    this.editVisibilityOfConfirmElements = (element, flag) => {
        if (flag) {
            element.removeClass('d-none');
        }
        else {
            element.addClass('d-none');
        }
    }

    this.editVisibility = (flag) => {
        if (flag) {
            this.actionConnectButtonContainer.removeClass('d-none');
            this.actionDisconnectButtonContainer.addClass('d-none')
            this.selectTemplates.removeAttr('disabled');
        }
        else {
            this.actionConnectButtonContainer.addClass('d-none');
            this.actionDisconnectButtonContainer.removeClass('d-none')
            this.selectTemplates.attr('disabled', 'disabled');
        }
    }

    this.onCancel = function () {
        runtime.notify('save', { state: 'end' });
    };

    this.findSurveyId = () => {
        $.ajax({
            type: 'GET',
            url: '/api/survey/v1/polls/?course=' + encodeURIComponent(self.course_id),
            headers: {
                'X-CSRFToken': $.cookie('csrftoken')
            },
            success: clbk
        });

        function clbk(payload) {
            if (payload.results[0]) {
                self.surveyId = payload.results[0].id
                self.editVisibility(false);
                self.state.status.main = STATUS_ENUM.CONNECTED;
                if($("#embedded_answers_edit_survey option:selected").text() !== payload.results[0].name){
                    $("#embedded_answers_edit_survey option:contains("+ payload.results[0].name +")").prop("selected", true);
                }
            } else {
                self.editVisibility(true);
            }
        }

    }

    this.preConnect = () => {
        if (self.state.status.main === STATUS_ENUM.NONE && self.state.status.select === SELECT_ENUM.CHANGED) {
            self.onConnect();
        }
        if (self.state.status.main === STATUS_ENUM.PTD && self.state.status.select === SELECT_ENUM.NONE) {
            self.onDisconnect();
        }
        if (self.state.status.main === STATUS_ENUM.PTD && self.state.status.select === SELECT_ENUM.CHANGED) {
            self.onDisconnect().done(() => { self.onConnect() });
        }
    }

    this.preDisconnect = () => {
        self.editVisibility(true);
        self.selectTemplates.val("");
        self.state.status.main = STATUS_ENUM.PTD;
        self.state.status.select = SELECT_ENUM.NONE
        self.editVisibilityOfConfirmElements(self.confirmUpdateContainer , false);
        self.editVisibilityOfConfirmElements(self.confirmDeleteContainer , true);
    }

    this.preSelect = (ev) => {
        self.state.status.select = SELECT_ENUM.CHANGED;
        self.state.selectValue = ev.target.value;
        if (self.surveyId) {
            self.editVisibilityOfConfirmElements(self.confirmDeleteContainer , false);
            self.editVisibilityOfConfirmElements(self.confirmUpdateContainer , true);
        }
    }

    this.onConnect = function () {
        const templateId = self.state.selectValue;
        var dataToSend = { 'template_id': templateId };
        const apiPayload = { 'course_id': self.course_id };
        if (templateId) {
            $.ajax({
                type: 'POST',
                url: '/api/survey/v1/templates/' + templateId + "/connect_to_course/",
                data: apiPayload,
                success: (resp) => {
                    if (resp.survey_id) {
                        dataToSend['survey_id'] = resp.survey_id
                        $.ajax({
                            type: 'POST',
                            url: self.submitHandlerUrl,
                            data: JSON.stringify(dataToSend),
                            success: () => {
                                self.editVisibility(false);
                                runtime.notify('save', { state: 'end' });
                            },
                        });
                    }
                },
            })
        }
        else {
            runtime.notify('save', { state: 'end' });
        }
    }

    this.onDisconnect = function () {
        const surveyId = self.surveyId ? self.surveyId : self.surveyIdField;
        return $.ajax({
            type: 'DELETE',
            global: false,
            url: '/api/survey/v1/surveys/' + surveyId + '/',
            success: () => {
                $.ajax({
                    type: 'POST',
                    url: self.removeHandlerUrl,
                    data: JSON.stringify({ 'template_id': '', 'survey_id': '' }),
                    success: () => {
                        runtime.notify('save', { state: 'end' });
                    },
                });
            },
            error: (XMLHttpRequest) => {
                if (XMLHttpRequest.status === 403) {
                    runtime.notify('error', {
                        title: EvaluationSurveyXBlocki18n.gettext("Forbidden"),
                        msg: XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.details
                    })
                }
            }
        })
    }


    $(function ($) {
        self.init();
    });
}
