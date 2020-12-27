from django.shortcuts import render, HttpResponse, get_object_or_404
from . import form as import_form
from . import models as import_database
from django.template import Context, Template
from django.http import HttpResponseForbidden
import json
from django.forms.models import model_to_dict


def main(request):
    db_form_save = import_form.DbModelForm(None, initial={'user': request.user})
    db = import_database.Db.objects.all()
    db_name = []

    if db.exists() is True:
        for i in db:
            db_name.append(i)

    context = {
        "db": db_name,
        'db_form_save': db_form_save,
    }

    return render(request, 'database/index.html', context)


def ajaxSave(request):
    if request.is_ajax():

        db_form = import_form.DbModelForm(request.POST or None)
        db_form.add_user(user=request.user)

        if db_form.is_valid():
            db_form.save()
            db_form_update = import_form.DbModelFormUpdate(request.POST or None)
            db_form_update.is_valid()
            context = Context({'db_form_update': db_form_update})
            form = "{% load crispy_forms_tags %}{{ db_form_update|crispy }}"
            temp = Template(form)
            result = {
                'status': True,
                'message': "Database Saved",
                'db_name': db_form.cleaned_data.get('database_name'),
                'db_header': db_form.cleaned_data.get('fields'),
                'db_form_update': temp.render(context)
            }
        else:
            context = Context({'db_form': db_form})
            form = "{% load crispy_forms_tags %}{{ db_form|crispy }}"
            temp = Template(form)
            result = {
                'status': False,
                'message': "DataBae could not be saved",
                'form': temp.render(context)
            }
    else:
        return HttpResponseForbidden()
    return HttpResponse(json.dumps(result))


def ajaxLoad(request):
    if request.is_ajax():
        load_db_request = import_database.Db.objects.filter(database_name=request.POST.get('db_name'), user=request.user)
        if load_db_request.exists() is True and load_db_request.count() == 1:
            load_db_request = load_db_request.first()
            db_form_update = import_form.DbModelFormUpdate(instance=load_db_request, auto_id=False)
            db_form_update.is_valid()
            context = Context({'db_form_update': db_form_update})
            form = "{% load crispy_forms_tags %}{{ db_form_update|crispy }}"
            temp = Template(form)
            result = {
                'status': True,
                'database': {
                    'db_name': load_db_request.database_name,
                    'data': load_db_request.data,
                    'db_header': load_db_request.fields,
                },
                'message': "Database loaded successfully",
                "db_form_update": temp.render(context)

            }
        else:
            result = {
                'status': True,
                'database': None,
                'message': "We could not find the database"
            }
    else:
        return HttpResponseForbidden()
    return HttpResponse(json.dumps(result))


def ajaxUpdate(request):
    print(request.POST.get('data'))
    if request.is_ajax():
        obj = get_object_or_404(import_database.Db, user=request.user, database_name=request.POST.get('database_name'))
        db_form = import_form.DbModelFormUpdate(request.POST or None, instance=obj)
        db_form.add_user(user=request.user)
        if db_form.is_valid():

            db_form.save()
            result = {
                'status': True,
                'message': "Database Updated Successfully",
                'db_name': db_form.cleaned_data.get('database_name'),
                'db_header': db_form.cleaned_data.get('fields'),
                'data': db_form.cleaned_data.get('data'),
            }
        else:
            context = Context({'db_form': db_form})
            form = "{% load crispy_forms_tags %}{{ db_form|crispy }}"
            temp = Template(form)
            result = {
                'status': False,
                'message': "DataBae could not be saved",
                'form': temp.render(context)
            }
    else:
        return HttpResponseForbidden()
    return HttpResponse(json.dumps(result))
