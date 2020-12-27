from django.shortcuts import render
from .forms import FormDatabase, Query
import json
from .models import Database
from .query import search_db

# Create your views here.


def home(request):
    return render(request, 'database/base.html', {})


def diagnosis(request):
    context = database(request, 'diagnosis')
    return render(request, 'database/database.html', context)


def complain(request):
    context = database(request, 'complain')
    return render(request, 'database/database.html', context)


def ot_procedure(request):
    context = database(request, 'ot_procedure')
    return render(request, 'database/database.html', context)


def medicine(request):
    context = database(request, 'medicine')
    return render(request, 'database/database.html', context)


def sanitize_data(data):
    try:
        data = json.loads(data)
        d = dict({})
        d['data'] = data[0]
        data.remove(data[0])
        counter = 0
        for i in data:
            counter += 1
            d['data_%d' % counter] = i
        d['counter'] = counter + 1
    except TypeError:
        d = None

    return d


def display(field):
    qs = Database.objects.filter(field_name=field)
    if qs.count() == 0:
        return None
    else:
        db = qs.first()

    field_value = db.data
    r = sanitize_data(field_value)
    r['counter'] += 10

    return r


def database(request, field):
    context = dict({})
    if request.is_ajax():
        d = sanitize_data(request.POST.get('data'))
        form = FormDatabase(d)
        if form.is_valid():
            form.category_name(field)
            form.set_data(request.POST.get('data'))
            form.save()
        context['form'] = form
    else:
        d = display(field)
        form = FormDatabase(d)
        context['form'] = form

    return context


def query(request):
    form = Query(request.GET or None)
    context = {'form': form}

    if request.GET and form.is_valid():
        context['query'] = search_db(form.cleaned_data)

    return render(request, 'database/query.html', context)