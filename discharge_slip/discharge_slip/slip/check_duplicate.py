from .models import Patient
import datetime
import json
import numpy as np
from .filter_data import sanitize_name
from .model_form import PatientModelForm

# sends false if there is no duplicate data otherwise sends true
def split_name(name):
    honorifics = ['mr', 'lord', 'mrs', 'miss', 'ms', 'mx', 'sir', 'dr', 'lady', 'madam', 'captain']
    name = sanitize_name(name)
    x = name.lower().split('.')
    if x[0] in honorifics:
        x.remove(x[0])
        name = '.'.join(x)
    return name.strip().split(' ')


def name_query(name):
    qs = Patient.objects.none()
    for i in name:
        qs = qs | Patient.objects.filter(patient_name__icontains=i)

    return qs


def duplicate(data):
    name = data['patient_name']
    sex = data['sex']
    phone = data['phone']
    data['age'] = int(data['age'])
    age = data['age']

    accuracy = 0

    d = datetime.date.today()
    dob = d - datetime.timedelta(days=365*age)
    dob_lower_limit = dob - datetime.timedelta(days=365)
    dob_upper_limit = dob + datetime.timedelta(days=365)
    dob_str = dob.strftime('%d%m%Y')

    name_list = split_name(name)

    qs = name_query(name_list)

    qs_sex = qs.filter(sex=sex.upper())
    sex_matched = False
    if qs_sex.count() != 0:
        sex_matched = True
        qs = qs_sex
        accuracy += 0.05

    qs_phone = qs.filter(phone__icontains=phone)
    if qs_phone.count() != 0:
        qs = qs_phone
        accuracy += 0.1

    # calculating name accuracy and age accuracy
    final_qs = []
    for i in qs:
        individual_acc = 0
        # calculating age accuracy
        age_matched = False
        approx_dob = i.approx_dob
        if dob_lower_limit  <= i.approx_dob  <= dob_upper_limit:
            age_matched = True
            day = abs((approx_dob - dob).days)
            individual_acc += (0.183 - (day / 100)) * 1.5
            approx_dob = approx_dob + datetime.timedelta(day / 2)

        for j in i.dob.split(','):
            store_dob = datetime.datetime.strptime(j, '%d%m%Y') .date()
            if dob_lower_limit < store_dob  < dob_upper_limit:
                age_matched = True

                acc_day = (store_dob - dob).days
                individual_acc += (0.0183 - (acc_day/100))
                day = abs((approx_dob - store_dob).days)
                approx_dob = approx_dob + datetime.timedelta(day/2)

        if age_matched:
            db_name = ' '.join(split_name(i.patient_name))
            entered_name = ' '.join(name_list).lower()
            a = levenshtein_algo(entered_name, db_name)
            if a <= 3:
                length = len(db_name) if len(db_name) > len(entered_name) else len(entered_name)
                individual_acc = (length - a) / length

            if individual_acc + accuracy > 0.80:
                final_qs.append([i, f'{round((individual_acc + accuracy)*100, 1)} %'])

    if len(final_qs) == 0:
        form = PatientModelForm(data)
        if form.is_valid():
            patient = form.save()
            return {'error': False, 'duplicate': False, 'patient': patient}
        else:
            return {'error': True, 'duplicate': False, 'message': 'Some Error Happened. ','patient': None}
    elif len(final_qs) == 1:
        if sex_matched is True:
            return {'error': False, 'duplicate': False, 'patient': final_qs[0][0]}
        else:
            return {'error': False, 'duplicate': True, 'patient': final_qs, 'header':f'Did you mean : '
            f'{final_qs[0][0].patient_name} ({final_qs[0][0].age}) <span style="color:red">({final_qs[0][0].sex})</span>'}
    else:
        return {'error': False, 'duplicate': True, 'patient': final_qs, 'header':'One or More results were found with name : ({name}) ({age}) ({sex})'}





def levenshtein_algo(seq1, seq2):
    size_x = len(seq1) + 1
    size_y = len(seq2) + 1
    matrix = np.zeros((size_x, size_y), int)
    for x in range(size_x):
        matrix[x, 0] = x
    for y in range(size_y):
        matrix[0, y] = y

    for x in range(1, size_x):
        for y in range(1, size_y):
            if seq1[x - 1] == seq2[y - 1]:
                matrix[x, y] = min(
                    matrix[x - 1, y] + 1,
                    matrix[x - 1, y - 1],
                    matrix[x, y - 1] + 1
                )
            else:
                matrix[x, y] = min(
                    matrix[x - 1, y] + 1,
                    matrix[x - 1, y - 1] + 1,
                    matrix[x, y - 1] + 1
                )
    distance = matrix[size_x - 1, size_y - 1]

    return distance
