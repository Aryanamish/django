from django import forms
from .models import Patient
from .filter_data import sanitize_name, alpha_numeric_number_generator
import datetime


class PatientModelForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(PatientModelForm, self).__init__(*args, **kwargs)
        self.has_error = False
        self.error = {}
        self.patient_id = 0

    class Meta:
        model = Patient
        fields = [
            'patient_name',
            'age',
            'sex',
            'phone',

        ]
        exclude = [
            'dob',
            'patient_id',
            'approx_dob',

        ]

    def clean_patient_name(self):
        name = self.cleaned_data.get('patient_name')
        name = sanitize_name(name)
        return name

    def clean_age(self):
        age = self.cleaned_data.get('age')
        if age > 120:
            self.has_error = True
            self.error['age'] = 'Age Cannot be more than 120 years'
        else:
            return age

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        phone = phone.split(',')
        new_number = []
        for i in phone:
            if len(i) > 10:
                new = i[-10:]
            elif len(i) == 10:
                new = i
            new_number.append(new)

        return ','.join(new_number)

    def save(self, commit=True, *args, **kwargs):
        obj = super(forms.ModelForm, self).save(commit=False)
        if commit:
            age = self.cleaned_data.get('age')
            dob = datetime.date.today()-datetime.timedelta(365*age)
            dob_str = dob.strftime('%d%m%Y')
            obj.dob = dob_str
            obj.approx_dob = dob
            try:
                last = Patient.objects.last()
                last_id = last.patient_id
                obj.patient_id = alpha_numeric_number_generator(last_id)
            except:
                obj.patient_id = alpha_numeric_number_generator('000000')
            self.patient_id = obj.patient_id
            obj.save()
        return obj

    def get_error(self):
        return {'has_error': self.has_error, 'error': self.error}