"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
from django.utils import translation
from six import text_type
from xblock.core import XBlock
from xblock.fields import Scope, String
from xblock.fragment import Fragment
from xblockutils.resources import ResourceLoader
from django.conf import settings


def _(text): return text


loader = ResourceLoader(__name__)


@XBlock.needs('i18n')
class EvaluationSurveyXBlock(XBlock):
    """
    This is XBlock for Evaluation Survey. Allows connect the survey to the course and embed it using an iframe
    """

    display_name = String(
        display_name=_('Display Name'),
        default=_('Evaluation Survey'),
        scope=Scope.settings,
        help=_('This name appears in the horizontal navigation at the top of the page')
    )

    template_id = String(
        display_name=_('Display Name'),
        default='',
        scope=Scope.settings,
        help=_('This is id of the template')
    )

    survey_id = String(
        display_name=_('Display Name'),
        default=None,
        scope=Scope.settings,
        help=_('This is a id of survey')
    )

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def student_view(self, context=None):
        """
        The primary view of the EvaluationSurveyXBlock, shown to students
        when viewing courses.
        """

        frag = Fragment()
        ctx = {
            'survey_id': self.survey_id,
            'course_id': text_type(self.course_id),
            'survey_microfrontend_url': getattr(settings, 'SURVEY_MICROFRONTEND_URL', '')
        }

        frag.add_content(loader.render_django_template(
            'static/html/evaluation_survey.html',
            context=ctx,
            i18n_service=self.runtime.service(self, "i18n"),
        ))

        frag.add_css(self.resource_string("static/css/evaluation_survey.css"))

        # Add i18n js
        statici18n_js_url = self._get_statici18n_js_url()
        if statici18n_js_url:
            frag.add_javascript_url(self.runtime.local_resource_url(self, statici18n_js_url))

        frag.add_javascript(self.resource_string("static/js/src/evaluation_survey.js"))
        frag.add_javascript(self.get_translation_content())
        frag.initialize_js('EvaluationSurveyXBlock')
        return frag

    def studio_view(self, context=None):
        '''
        The secondary view of the XBlock, shown to teachers
        when editing the XBlock.
        '''
        frag = Fragment()
        ctx = {
            'display_name': self.display_name,
            'survey_id': self.survey_id,
            'template_id': self.template_id,
            'course_id': self.course_id,
        }
        frag.add_content(loader.render_django_template(
            'static/html/evaluation_survey_edit.html',
            context=ctx,
            i18n_service=self.runtime.service(self, "i18n"),
        ))

        # Add i18n js
        statici18n_js_url = self._get_statici18n_js_url()
        if statici18n_js_url:
            frag.add_javascript_url(self.runtime.local_resource_url(self, statici18n_js_url))

        frag.add_css(loader.load_unicode('static/css/evaluation_survey_edit.css'))
        frag.add_javascript(loader.load_unicode('static/js/src/evaluation_survey_edit.js'))
        frag.add_javascript(self.get_translation_content())
        frag.initialize_js('EvaluationSurveyXBlockEdit')
        return frag

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.

    @XBlock.json_handler
    def studio_submit(self,  data, suffix=''):
        '''Save studio edits'''
        for key, value in data.items():
            if key in ['survey_id', 'template_id']:
                setattr(self, key, value)

        return {'result': 'success'}

    @XBlock.json_handler
    def studio_remove(self,  data, suffix=''):
        '''Save studio edits'''
        for key, value in data.items():
            if key in ['survey_id', 'template_id']:
                delattr(self, key)
        return {'result': 'success'}

    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("EvaluationSurveyXBlock",
             """<evaluation_survey/>
             """),
            ("Multiple EvaluationSurveyXBlock",
             """<vertical_demo>
                <evaluation_survey/>
                <evaluation_survey/>
                <evaluation_survey/>
                </vertical_demo>
             """),
        ]

    @staticmethod
    def _get_statici18n_js_url():
        """
        Returns the Javascript translation file for the currently selected language, if any.
        Defaults to English if available.
        """
        locale_code = translation.get_language()
        if locale_code is None:
            return None
        text_js = 'public/js/translations/{locale_code}/text.js'
        lang_code = locale_code.split('-')[0]
        for code in (locale_code, lang_code, 'en'):
            if pkg_resources.resource_exists(
                    loader.module_name, text_js.format(locale_code=code)):
                return text_js.format(locale_code=code)
        return None

    @staticmethod
    def get_dummy():
        """
        Dummy method to generate initial i18n
        """
        return translation.gettext_noop('Dummy')

    def get_translation_content(self):
        try:
            return self.resource_string('static/js/translations/{lang}/text.js'.format(
                lang=translation.get_language(),
            ))
        except IOError:
            return self.resource_string('static/js/translations/en/text.js')
