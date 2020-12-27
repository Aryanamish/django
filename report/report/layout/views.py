from django.shortcuts import render, HttpResponse
from django.http import HttpResponseForbidden
import json
from . import models as import_database
# from django.views.decorators.csrf import csrf_exempt
from . import forms as local_form
from django.template import Context, Template


def main(request):  # layout/
    temp_names = []
    templates = import_database.Template.objects.all()
    form = local_form.CreateTemplate()

    if templates.exists():
        for i in templates:
            temp_names.append(i.template_name)

    data = {
        'title': "layout",
        'view': 'layout',
        'temp_names': temp_names,
        'save_form': form,

    }
    return render(request, 'layout/index.html', data)


def saveTemp(request):
    if request.is_ajax() and request.user:
        save_form = local_form.CreateTemplate(request.POST or None)
        save_form.add_user(request.user)
        context = Context({'save_form': save_form})
        form = "{% load crispy_forms_tags %}{{ save_form|crispy }}"
        temp = Template(form)

        result = {
            'save_form': temp.render(context),
            'data': {
                "temp_name": save_form.cleaned_data.get('template_name'),
                'property': {},
                'css': '',
                'js': '',
                'html': '',
            }
        }
        if save_form.is_valid():
            save_form.save()
            result['status'] = True
            result['message'] = "Template Saved Successfully"
        else:
            result['status'] = False
            result['message'] = "Template Already Exists"
    else:
        return HttpResponseForbidden()
    return HttpResponse(json.dumps(result))


def loadTemp(request):
    pass


def checkTemp(r):
    pass