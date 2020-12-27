from django import forms
import json
from django.http import QueryDict
from .models import Database


class FormDatabase(forms.Form):

    def __init__(self, *args, **kwargs):
        no_of_fields = 10
        for i in args:
            try:
                no_of_fields = int(i['counter'])
            except:
                no_of_fields = 10

        super(FormDatabase, self).__init__(*args, **kwargs)

        self.no_of_fields = no_of_fields
        for i in range(1, no_of_fields):
            self.fields['data_%d' % i] = self.fields['data']
        self.field_name = None

    data = forms.CharField(
        widget=forms.TextInput(attrs={'class': 'form-control', 'autocomplete': 'off'}),
        required=False
    )

    def category_name(self, name):
        self.field_name = name

    def set_data(self, data):
        self.data = data

    def save(self):
        qs = Database.objects.filter(field_name=self.field_name)
        if qs.count() == 0:
            db = Database()
        else:
            db = qs.first()

        db.field_name = self.field_name
        db.data = self.data
        db.save()
        return True


class Query(forms.Form):
    slip_id = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'autocomplete': 'on'})
    )
    patient_id = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'autocomplete': 'on'})
    )
    name = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'autocomplete': 'on'})
    )
    age = forms.IntegerField(
        required=False,
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
        required = False,
        widget=forms.Select(attrs={'class': 'form-control'}),
        choices=SEX_CHOICES,
    )
    date_of_admission = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'autocomplete': 'on', 'type': 'date'})
    )
    date_of_operation = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'autocomplete': 'on', 'type': 'date'})
    )
    date_of_discharge = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'autocomplete': 'on', 'type': 'date'})
    )
