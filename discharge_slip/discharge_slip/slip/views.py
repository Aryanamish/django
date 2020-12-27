from django.shortcuts import render, HttpResponse
import json
from .models import Patient
from .forms import TestForm
from django.template import loader
from database.models import Database
from print.views import print_pdf


def home(request):

    form = TestForm()
    response = {
        'status': True,
        'error': False,
        'message': '',
        'valid': True,
        'confirmation': False,
        'header': '',
        'printed': False
    }
    context = {'form': form}
    if request.is_ajax():
        # time.sleep(6)
        if request.POST.get('confirmation') == 'true':
            try:
                patient_id = request.POST['patient_id']
                patient = Patient.objects.get(patient_id=patient_id)
            except KeyError:
                patient = None

            slip_form = TestForm(request.session['slip'])
            slip_form.set_patient_object(patient_id=patient)
            if slip_form.is_valid():
                slip_form.save()
                response['printed'] = True
                print_data = slip_form.modelSlip
                patient_data = {
                    'patient_name': request.session.get('slip').get('patient_name'),
                    'age': request.session.get('slip').get('age'),
                    'sex': request.session.get('slip').get('sex'),
                }
                print_data.update(patient_data)
                print_pdf(data=print_data)
        else:
            form = TestForm(request.POST)
            if form.is_valid():
                data = form.is_duplicate()
                if data['duplicate'] is True:
                    p_response = {}
                    for i in data['patient']:
                        p_response[i[0].patient_id] = [i[0].patient_name, i[0].age, i[0].sex, i[0].phone, i[1]]

                    request.session['slip'] = request.POST
                    response['confirmation'] = True
                    response['patient'] = p_response
                    response['header'] = data['header'].format(name=form.cleaned_data.get('patient_name'),
                                                               age=form.cleaned_data.get('age'),
                                                               sex=form.cleaned_data.get('sex'))
                elif data['error'] is True:
                    response['error'] = True
                    response['message'] = data['message']

                else:
                    form.set_patient_object(data['patient'])
                    form.save()
                    response['message'] = 'Data Saved Successfully'
                    response['printed'] = True
                    # print function
                    print_data = form.modelSlip
                    patient_data = {
                        'patient_name': data['patient'].patient_name,
                        'age': data['patient'].age,
                        'sex': data['patient'].sex,
                    }
                    print_data.update(patient_data)
                    print_pdf(data=print_data)

            else:
                template = loader.get_template('slip/form.html')
                html = template.render({'form': form})
                response['rendered'] = html
                response['valid'] = False
        return HttpResponse(json.dumps(response))
    else:
        context['data'] = Database.objects.all()
        return render(request, 'slip/content.html', context)

