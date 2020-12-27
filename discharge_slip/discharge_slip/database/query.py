from slip.models import Slip, Patient
from slip.check_duplicate import split_name, name_query
from slip.filter_data import sanitize_name
import datetime


def search_db(query):
    p_qs = Patient.objects.none()
    s_qs = Slip.objects.none()
    if query.get('patient_id'):
        p_qs = p_qs | Patient.objects.filter(patient_id__exact=query.get('patient_id'))
    if query.get('name'):
        p_qs = p_qs | name_query(split_name(sanitize_name(query.get('name'))))

    if query.get('sex'):
        p_qs = p_qs | Patient.objects.filter(sex=query.get('sex'))

    if query.get('phone'):
        p_qs = p_qs | Patient.objects.filter(phone__icontains=query.get('phone'))

    if query.get('date_of_admission'):
        s_qs = s_qs | Slip.objects.filter(date_of_admission=query.get('date_of_admission'))

    if query.get('date_of_operation'):
        s_qs = s_qs | Slip.objects.filter(date_of_operation=query.get('date_of_operation'))

    if query.get('date_of_discharge'):
        s_qs = s_qs | Slip.objects.filter(date_of_discharge=query.get('date_of_discharge'))

    if query.get('slip_id'):
        s_qs = s_qs | Slip.objects.filter(slip_id__exact=query.get('slip_id'))

    if query.get('age'):
        dob = datetime.date.today() - datetime.timedelta(365*(query.get('age')+1))
        dob_lower = datetime.date.today() - datetime.timedelta(365*(query.get('age')-1))

        dob = (dob, dob_lower)
        age_qs = Patient.objects.filter(approx_dob__range=dob)
        p_qs = p_qs | age_qs

    if p_qs.count() != 0:
        s_qs = s_qs | Slip.objects.filter(patient_id__in=p_qs)

    if s_qs.count() != 0:
        return s_qs