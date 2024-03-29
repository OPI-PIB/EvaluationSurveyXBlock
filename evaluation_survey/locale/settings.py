"""
Django settings for evaluation_survey project.
For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/
For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""
import os

SECRET_KEY = os.getenv('DJANGO_SECRET', 'open_secret')

# Application definition

INSTALLED_APPS = (
    'statici18n',
    'evaluation_survey',
)

LANGUAGES = [
    ('en', 'English - Source Language'),
    ('en_US', 'English'),
    ('pl', 'Polski'),
]

# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'

# statici18n
# https://django-statici18n.readthedocs.io/en/latest/settings.html

STATICI18N_DOMAIN = 'text'
STATICI18N_PACKAGES = (
    'evaluation_survey',
)
STATICI18N_ROOT = 'evaluation_survey/static/js'
STATICI18N_OUTPUT_DIR = 'translations'
STATICI18N_NAMESPACE = 'EvaluationSurveyXBlocki18n'
