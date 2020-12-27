import numpy
import datetime
import json
from .models import Slip
from dateutil.parser import parse


def filter_data(data):
    error = []
    data['investigation'] = json.loads(data['investigation'])
    data['advice_field'] = json.loads(data['advice_field'])
    data['advice_value'] = json.loads(data['advice_value'])
    del data['csrfmiddlewaretoken']

    for i in data:
        if i == 'phone':
            if data[i].isdigit():
                data[i] = data[i][-10:]
            else:
                error.append([i, "Phone no. incorrect", data[i]])
        elif 'date' in i:
            if validate_date(data[i]):
                pass
            else:
                error.append([i, "Incorrect Date", data[i]])
        elif i == 'investigation':

            for j in data[i]:
                if validate_date(j[0]):
                    pass
                else:
                    error.append([i, "Incorrect Date", j])
        elif i == 'age':
            if data[i].isdigit():
                data[i] = int(data[i])
                if data[i] > 120:
                    error.append([i, "Age cannot be more than 120", data[i]])
            else:
                error.append([i, "Age can only be number", data[i]])
        elif i == 'sex':
            if len(data[i]) != 1:
                error.append([i, "Wrong Data", data[i]])
        elif i == 'patient_name':
            data[i] = sanitize_name(data[i])
    return data, error


def sanitize_name(name):
    honorifics = ['mr', 'lord', 'mrs', 'miss', 'ms', 'mx', 'sir', 'dr', 'lady', 'madam', 'captain']
    x = name.split('.')
    counter = 0
    for i in x:
        if i.lower() in honorifics:
            x[counter] = i.title() + '. '
        elif len(i.strip()) == 1:
            x[counter] = i.strip().title() + '.'
        elif i[0:1] == ' ':
            x[counter] = i.strip().title()
        else:
            x[counter] = i.strip().title() + '.'
        counter += 1
    x = ''.join(x)
    if x[-1:] == '.':
        x = x[:-1]
    return x


def generate_id():
    record = Slip.objects.last()
    patient_id = record.patient_id
    patient_id = alpha_numeric_number_generator(patient_id)
    report_no = alpha_numeric_number_generator(record.report_no)

    d = datetime.date.today()
    yy = str(d.year)[2:]
    dd = d.day
    mm = d.month
    date = dd + mm + yy

    slip_id = patient_id + date + report_no

    return slip_id


def alpha_numeric_number_generator(previous=''):
    length = len(previous)
    new = int(previous, 36) + 1
    new = numpy.base_repr(new, 36)
    if len(new) != length:
        diff = length - len(new)
        zero = ['0' for _ in range(0, diff)]
        new = ''.join(zero) + new
    return new


def validate_date(date_text, fuzzy=False):
    try:

        return parse(date_text, fuzzy=fuzzy)

    except ValueError:
        return False


