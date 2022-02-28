/* Javascript for EvaluationSurveyXBlock. */
function EvaluationSurveyXBlock(runtime, element) {
    const self = this;
    var surveyId;
    this.init = () => {
        this.getIframe();
    }
    this.getIframe = () => {
        $.ajax({
            type: 'GET',
            url: '/api/survey/v1/polls/?course=' + encodeURIComponent(course_id),
            headers: {
                'X-CSRFToken': $.cookie('csrftoken')
            },
            success: addIframe
        });
    }

    this.initEvents = () => {
        window.addEventListener("message", (event) => {
            if (event.origin !== "http://example.org:8080")
                if (event.data.message) {
                    $('#survey-iframe').height(event.data.message);
                }
            return;

        }, false);
    }

    function addIframe(payload) {

        function getPollUrl(surveyId) {
            return survey_domain + 'poll/' + surveyId
        }

        if (payload.results[0]) {
            surveyId = payload.results[0].id;
            $('#survey-iframe').attr({ src: getPollUrl(surveyId) });
            $('#survey-iframe', element).removeClass('d-none');
        } else {
            $('.survey-not-connected', element).removeClass('d-none');
        }
    }
    var course_id = $('#survey-iframe').data("course_id");
    var survey_domain = $('#survey-iframe').data("survey-domain");

    $(function ($) {
        self.init();
        self.initEvents();
    });
}
