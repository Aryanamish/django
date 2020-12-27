from django import forms
from .models import Slip, Patient
from .filter_data import sanitize_name, alpha_numeric_number_generator
from .check_duplicate import duplicate
import datetime
import json
from .model_form import PatientModelForm


class TestForm(forms.Form):

    def __init__(self, *args, **kwargs):
        advice = 1
        investigation = 1
        for i in args:
            try:
                investigation = int(i['investigation_counter'])
            except KeyError:
                investigation = 1
            try:
                advice = int(i['advice_counter'])
            except KeyError:
                advice = 1

        super(TestForm, self).__init__(*args, **kwargs)

        for i in range(1, investigation):
            self.fields["investigation_textarea_%d" % i] = self.fields["investigation_textarea"]
            self.fields["date_of_investigation_%d" % i] = self.fields["date_of_investigation"]
        self.investigation = investigation
        for i in range(1, advice):
            self.fields["advice_field_%d" % i] = self.fields["advice_field"]
            self.fields["advice_value_%d" % i] = self.fields["advice_value"]
        self.advice = advice

        for i in self.fields:
            j = i.split(' ')
            if self.label.get(j[0]):
                self.fields[i].label = self.label[j[0]]
        self.modelSlip = {}

    patient_name = forms.CharField(
        widget=forms.TextInput(attrs={'class': 'form-control', 'autocomplete': 'off'})
    )
    age = forms.IntegerField(
        max_value=120,
        min_value=0,
        widget=forms.TextInput(attrs={'class': 'form-control', 'autocomplete': 'off'}),
    )
    SEX_CHOICES = (
        ('M', 'Male',),
        ('F', 'Female',),
        ('O', 'Others',),
    )
    sex = forms.ChoiceField(
        widget=forms.Select(attrs={'class': 'form-control'}),
        choices=SEX_CHOICES,
    )
    address = forms.CharField(
        widget=forms.Textarea(attrs={'rows': '5', 'class': 'form-control', 'autocomplete': 'off'}),
    )
    phone = forms.CharField(
        widget=forms.TextInput(attrs={'class': 'form-control', 'autocomplete': 'off'}),

    )

    date_of_admission = forms.DateField(
        widget=forms.TextInput(attrs={'type': 'date', 'class': 'form-control'}),
    )
    date_of_operation = forms.DateField(
        widget=forms.TextInput(attrs={'type': 'date', 'class': 'form-control'}),
    )
    date_of_discharge = forms.DateField(
        widget=forms.TextInput(attrs={'type': 'date', 'class': 'form-control'}),
    )
    diagnosis = forms.CharField(
        widget=forms.TextInput(attrs={'autocomplete': 'off', 'list': 'diagnosis', 'class': 'form-control'}),
    )
    complain = forms.CharField(
        widget=forms.TextInput(attrs={'autocomplete': 'off', 'list': 'complain', 'class': 'form-control'}),
    )
    date_of_investigation = forms.DateField(
        widget=forms.TextInput(attrs={'type': 'date', 'class': 'form-control investigation'}),
    )
    investigation_textarea = forms.CharField(
        widget=forms.Textarea(attrs={'rows': '5', 'class': 'form-control investigation'}),
    )
    ot_procedure = forms.CharField(
        widget=forms.TextInput(attrs={'autocomplete': 'off', 'list': 'ot_procedure', 'class': 'form-control'}),
    )
    advice_field = forms.CharField(
        widget=forms.TextInput(attrs={'autocomplete': 'off', 'list': 'medicine', 'class': 'form-control advice'}),
    )
    advice_value = forms.CharField(
        widget=forms.TextInput(attrs={'type': 'text', 'class': 'form-control advice'}),
    )

    help_block_temp = '<label class="help-block">{}</label><br/>'
    label_temp = '<label class="control-label">{}</label>'

    label = {
        'patient_name': 'Patient Name',
        'date_of_investigation': 'Date Of Investigation'
    }

    def clean_patient_name(self):
        name = self.cleaned_data.get('patient_name')
        name = sanitize_name(name)
        return name

    def clean_age(self):
        age = self.cleaned_data.get('age')
        if age > 120:
            raise forms.ValidationError('Age cannot be more than 120 years')
        else:
            return age

    def clean_address(self):
        add = self.cleaned_data.get('address')
        add = add.replace(', ', ',').replace(' ,', ',').split(',')
        add = ', '.join(add)
        self.modelSlip['address'] = add
        return add

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        phone = phone.replace('-', '').replace('+', '').replace(' ', '')
        for i in phone:
            if i.isnumeric() or i == ',':
                pass
            else:
                raise forms.ValidationError('Phone number can\'t contain any other character')

        phone = phone.split(',')
        phone = [i[-10:] for i in phone]
        phone = ', '.join(phone)
        self.modelSlip['phone'] = phone
        return phone

    def clean_date_of_admission(self):
        self.modelSlip['date_of_admission'] = self.cleaned_data.get('date_of_admission')
        return self.modelSlip['date_of_admission']

    def clean_date_of_operation(self):
        date_of_operation = self.cleaned_data.get('date_of_operation')
        date_of_admission = self.cleaned_data.get('date_of_admission')
        if date_of_operation < date_of_admission:
            raise forms.ValidationError('Date of operation cannot be before date of admission')
        else:
            self.modelSlip['date_of_operation'] = date_of_operation
            return date_of_operation

    def clean_date_of_discharge(self):
        date_of_discharge = self.cleaned_data.get('date_of_discharge')
        date_of_operation = self.cleaned_data.get('date_of_operation')
        if date_of_discharge < date_of_operation:
            raise forms.ValidationError('Date of Discharge cannot be before date of operation')
        else:
            self.modelSlip['date_of_discharge'] = date_of_discharge
            return date_of_discharge

    def is_duplicate(self):
        data = dict({})
        data['patient_name'] = self.cleaned_data.get('patient_name')
        data['age'] = self.cleaned_data.get('age')
        data['sex'] = self.cleaned_data.get('sex')
        data['phone'] = self.cleaned_data.get('phone')
        data = duplicate(data)

        return data

    def set_patient_object(self, patient_id):
        self.modelSlip['patient_id'] = patient_id

    def save(self):
        if self.modelSlip.get('patient_id') is None:
            self.modelSlip['patient_id'] = self.genrate_new_patient()
        self.create_modal_slip()
        self.merge_fields()
        self.generate_slip_id()
        self.modelSlip['date'] = datetime.date.today()
        try:
            modal_slip = Slip(**self.modelSlip)
            modal_slip.save()
        except:
            return False
        return True

    def create_modal_slip(self):
        self.modelSlip['diagnosis'] = self.cleaned_data.get('diagnosis')
        self.modelSlip['complain'] = self.cleaned_data.get('complain')
        self.modelSlip['ot_procedure'] = self.cleaned_data.get('ot_procedure')

    def merge_fields(self):
        investigation = []
        date_of_investigation = self.cleaned_data.get('date_of_investigation')
        investigation_textarea = self.cleaned_data.get('investigation_textarea')
        investigation.append([date_of_investigation.strftime("%d%m%Y"), investigation_textarea])
        for i in range(1, self.investigation):
            date_of_investigation = self.cleaned_data.get('date_of_investigation_%d' % i)
            investigation_textarea = self.cleaned_data.get('investigation_textarea_%d' % i)
            investigation.append([date_of_investigation.strftime("%d%m%Y"), investigation_textarea])

        advice = []
        advice_field = self.cleaned_data.get('advice_field')
        advice_value = self.cleaned_data.get('advice_value')
        advice.append([advice_field, advice_value])
        for i in range(1, self.advice):
            advice_field = self.cleaned_data.get('advice_field_%d' % i)
            advice_value = self.cleaned_data.get('advice_value_%d' % i)
            advice.append([advice_field, advice_value])

        self.modelSlip['investigation'] = json.dumps(investigation)
        self.modelSlip['advice'] = json.dumps(advice)
        return True

    def generate_slip_id(self):
        patient_id = self.modelSlip['patient_id'].patient_id
        d = datetime.date.today().strftime("%d%m%y")
        try:
            last = Slip.objects.last()
            if last.date == datetime.date.today():
                report_no = alpha_numeric_number_generator(last.report_no)
            else:
                report_no = alpha_numeric_number_generator('00')
        except:
            report_no = alpha_numeric_number_generator('00')

        self.modelSlip['report_no'] = str(report_no)
        self.modelSlip['slip_id'] = str(patient_id) + d + str(report_no)
        return True

    def genrate_new_patient(self):
        data = dict({})
        data['patient_name'] = self.cleaned_data.get('patient_name')
        data['age'] = self.cleaned_data.get('age')
        data['sex'] = self.cleaned_data.get('sex')
        data['phone'] = self.cleaned_data.get('phone')
        patient = PatientModelForm(data)
        if patient.is_valid():
            patient.save()

            return Patient.objects.get(patient_id=patient.patient_id)

