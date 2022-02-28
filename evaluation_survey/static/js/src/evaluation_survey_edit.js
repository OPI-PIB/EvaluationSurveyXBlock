/* Javascript for EvaluationSurveyXBlock. */
function EvaluationSurveyXBlockEdit(runtime, element) {
    const self = this;
    this.init = () => {
        this.selectTemplates = $('select.templates', element);
        this.actionCancelButton = $('.action-cancel', element);
        this.actionSaveButton = $('.action-save', element);
        this.actionConnectButton = $('.action-connect', element);
        this.actionDisconnectButton = $('.survey-action.action-disconnect', element);
        this.actionConnectButtonContainer = $('.action-connect-container', element);
        this.actionDisconnectButtonContainer = $('.action-disconnect-container', element);
        this.settingsMainContainer = $('.evaluation-survey-main-settings', element)
        this.course_id = this.settingsMainContainer.data('course_id');
        this.surveyIdField = this.settingsMainContainer.data('survey_id');
        this.actionCancelButton.bind('click', this.onCancel);
        this.actionSaveButton.bind('click', this.onSubmit);
        this.actionConnectButton.bind('click', this.onConnect);
        this.actionDisconnectButton.bind('click', this.onDisconnect);
        this.submitHandlerUrl = runtime.handlerUrl(element, 'studio_submit');
        this.removeHandlerUrl = runtime.handlerUrl(element, 'studio_remove');
        this.surveyId = false;
        this.getTemplatesIds();
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
                    $('select.templates', element).append(`<option value=${el.id} ${selected === el.id ? 'selected' : ''}>${el.published_version.name}</option>`)
                }
            });
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
            } else {
                self.editVisibility(true);
            }
        }

    }
    this.onConnect = function () {
        const templateId = self.selectTemplates.val();
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
        var dataToSend = { 'template_id': '', 'survey_id': '' };
        if (dataToSend) {
            const surveyId = self.surveyId ? self.surveyId : self.surveyIdField;
            if (surveyId !== "None") {
                $.ajax({
                    type: 'DELETE',
                    global: false,
                    url: '/api/survey/v1/surveys/' + surveyId + '/',
                    success: () => {
                        $.ajax({
                            type: 'POST',
                            url: self.removeHandlerUrl,
                            data: JSON.stringify(dataToSend),
                            success: () => {
                                self.editVisibility(true);
                                self.selectTemplates.val("");
                            },
                        });
                    },
                    error: (XMLHttpRequest) => {
                        if (XMLHttpRequest.statusText === "Forbidden") {
                            runtime.notify('error', {
                                title: EvaluationSurveyXBlocki18n.gettext("Forbidden"),
                                msg: EvaluationSurveyXBlocki18n.gettext("You need to have GlobalStaff permission. To do this action. Please contact with ...")
                            })
                        }
                    }
                })
            }
        }
    }


    $(function ($) {
        self.init();
        self.findSurveyId();
    });
}
