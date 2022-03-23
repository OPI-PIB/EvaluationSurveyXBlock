
            (function(global){
                var EvaluationSurveyXBlocki18n = {
                  init: function() {
                    

(function(globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function(n) {
    var v=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  var newcatalog = {
    "By clicking \"Save\" button you confirm the removal of the survey. This action will permanently delete all results.": "Klikaj\u0105c przycisk \u201eZapisz\u201d potwierdzasz usuni\u0119cie ankiety. Ta czynno\u015b\u0107 spowoduje trwa\u0142e usuni\u0119cie wszystkich wynik\u00f3w.",
    "By clicking \"Save\" button you confirm the replacement or update of the survey. This action will permanently delete all results.": "Klikaj\u0105c przycisk \u201eZapisz\u201d potwierdzasz zamian\u0119 lub aktualizacj\u0119 ankiety. Ta czynno\u015b\u0107 spowoduje trwa\u0142e usuni\u0119cie wszystkich wynik\u00f3w.",
    "Cancel": "Anuluj",
    "Change template": "Zmie\u0144 szablon",
    "Close": "Zamknij",
    "Display Name": "Nazwa wy\u015bwietlana",
    "Dummy": "Lorem ipsum",
    "Evaluation Survey": "Ankieta ewaluacyjna",
    "Evaluation survey template": "Szablon ankiety ewaluacyjnej",
    "Forbidden": "Forbidden",
    "None": "Brak",
    "Save": "Zapisz",
    "Select the survey you want to link to your course": "Wybierz ankiet\u0119, kt\u00f3r\u0105 chcesz po\u0142\u0105czy\u0107 z kursem",
    "The survey is connected to the course. If you want to choose a different template for the survey, you need to click \"Change template\". You need to remember that if you do it, that all results will pernamently dissapeared.": "Ankieta jest po\u0142\u0105czona z kursem. Je\u015bli chcesz wybra\u0107 inny szablon ankiety, musisz klikn\u0105\u0107 \u201eZmie\u0144 szablon\u201d. Musisz pami\u0119ta\u0107, \u017ce je\u015bli to zrobisz, wszystkie wyniki zostan\u0105 utracone.",
    "This is a id of survey": "Identyfikator ankiety",
    "This is id of the template": "Identyfikator szablonu ankiety",
    "This name appears in the horizontal navigation at the top of the page": "Ta nazwa pojawia si\u0119 w nawigacji na g\u00f3rze strony",
    "You need to connect the survey to the course": "Musisz po\u0142\u0105czy\u0107 ankiet\u0119 z kursem"
  };
  for (var key in newcatalog) {
    django.catalog[key] = newcatalog[key];
  }
  

  if (!django.jsi18n_initialized) {
    django.gettext = function(msgid) {
      var value = django.catalog[msgid];
      if (typeof(value) == 'undefined') {
        return msgid;
      } else {
        return (typeof(value) == 'string') ? value : value[0];
      }
    };

    django.ngettext = function(singular, plural, count) {
      var value = django.catalog[singular];
      if (typeof(value) == 'undefined') {
        return (count == 1) ? singular : plural;
      } else {
        return value.constructor === Array ? value[django.pluralidx(count)] : value;
      }
    };

    django.gettext_noop = function(msgid) { return msgid; };

    django.pgettext = function(context, msgid) {
      var value = django.gettext(context + '\x04' + msgid);
      if (value.indexOf('\x04') != -1) {
        value = msgid;
      }
      return value;
    };

    django.npgettext = function(context, singular, plural, count) {
      var value = django.ngettext(context + '\x04' + singular, context + '\x04' + plural, count);
      if (value.indexOf('\x04') != -1) {
        value = django.ngettext(singular, plural, count);
      }
      return value;
    };

    django.interpolate = function(fmt, obj, named) {
      if (named) {
        return fmt.replace(/%\(\w+\)s/g, function(match){return String(obj[match.slice(2,-2)])});
      } else {
        return fmt.replace(/%s/g, function(match){return String(obj.shift())});
      }
    };


    /* formatting library */

    django.formats = {
    "DATETIME_FORMAT": "j E Y H:i",
    "DATETIME_INPUT_FORMATS": [
      "%d.%m.%Y %H:%M:%S",
      "%d.%m.%Y %H:%M:%S.%f",
      "%d.%m.%Y %H:%M",
      "%d.%m.%Y",
      "%Y-%m-%d %H:%M:%S",
      "%Y-%m-%d %H:%M:%S.%f",
      "%Y-%m-%d %H:%M",
      "%Y-%m-%d"
    ],
    "DATE_FORMAT": "j E Y",
    "DATE_INPUT_FORMATS": [
      "%d.%m.%Y",
      "%d.%m.%y",
      "%y-%m-%d",
      "%Y-%m-%d"
    ],
    "DECIMAL_SEPARATOR": ",",
    "FIRST_DAY_OF_WEEK": 1,
    "MONTH_DAY_FORMAT": "j E",
    "NUMBER_GROUPING": 3,
    "SHORT_DATETIME_FORMAT": "d-m-Y  H:i",
    "SHORT_DATE_FORMAT": "d-m-Y",
    "THOUSAND_SEPARATOR": "\u00a0",
    "TIME_FORMAT": "H:i",
    "TIME_INPUT_FORMATS": [
      "%H:%M:%S",
      "%H:%M:%S.%f",
      "%H:%M"
    ],
    "YEAR_MONTH_FORMAT": "F Y"
  };

    django.get_format = function(format_type) {
      var value = django.formats[format_type];
      if (typeof(value) == 'undefined') {
        return format_type;
      } else {
        return value;
      }
    };

    /* add to global namespace */
    globals.pluralidx = django.pluralidx;
    globals.gettext = django.gettext;
    globals.ngettext = django.ngettext;
    globals.gettext_noop = django.gettext_noop;
    globals.pgettext = django.pgettext;
    globals.npgettext = django.npgettext;
    globals.interpolate = django.interpolate;
    globals.get_format = django.get_format;

    django.jsi18n_initialized = true;
  }

}(this));


                  }
                };
                EvaluationSurveyXBlocki18n.init();
                global.EvaluationSurveyXBlocki18n = EvaluationSurveyXBlocki18n;
            }(this));
        