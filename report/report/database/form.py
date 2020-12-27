from django import forms
from .models import Db
import json
import re
from django.db.utils import IntegrityError


class DbModelForm(forms.ModelForm):
    user = ''

    def __init__(self, *args, **kwargs):
        super(forms.ModelForm, self).__init__(*args, **kwargs)
        self.fields['fields'].widget.attrs.update({
            'rows': '3'
        })

    class Meta:
        abstract = True
        model = Db
        fields = ['database_name', 'fields']
        labels = {
            'database_name': 'Enter New Database Name',
            'fields': 'Enter Fields Name (separated by comma)',
        }
        exclude =['user', 'data']

    def clean_fields(self):
        data = self.cleaned_data.get('fields')

        if isinstance(data, str):
            data = data if data[-1] != ',' else data[0: -1]
            data = data.split(',')
            data = json.dumps(data)
        else:
            raise forms.ValidationError("Invalid Data")
        return data

    def clean_database_name(self):
        name = self.cleaned_data.get('database_name')
        if len(name) <= 3:
            raise forms.ValidationError("Database Name should be more than 3 character long")
        elif name.isalnum() is False:
            raise forms.ValidationError('Database Name should be alpha numeric')
        return name

    def clean(self, *args, **kwargs):
        super(forms.ModelForm, self).clean(*args, **kwargs)
        cleaned_data = self.cleaned_data
        user_inc = self.user
        name = cleaned_data.get('database_name')
        query = self.Meta.model.objects.filter(user=user_inc, database_name=name)
        if query.exists():
            raise forms.ValidationError('Database Already Exists')
        return cleaned_data

    def save(self, commit=True):
        obj = super(forms.ModelForm, self).save(commit=False)
        if commit:
            obj.user = self.user
            obj.save()

    def add_user(self, user):
        self.user = user


class DbModelFormUpdate(DbModelForm, forms.ModelForm):
    default = forms.CharField(max_length=1000, required=False, label='Enter One of Default Value (separated by comma')

    def __init__(self, *args, **kwargs):
        super(DbModelForm, self).__init__(*args, **kwargs)
        self.fields['database_name'].widget.attrs.update({
            'disabled': True
        })
        self.fields['fields'].widget.attrs.update({
            'rows': '3'
        })
        self.fields['data'].widget.attrs.update({
            'style': 'display:none'
        })

    class Meta(DbModelForm.Meta):
        DbModelForm.Meta.fields.append('default')
        DbModelForm.Meta.fields.append('data')
        DbModelForm.Meta.exclude.remove('data')
        labels = {
            'database_name': 'Database Name',
            'fields': 'Update Fields Name (separated by comma)',
            'data': '',
        }

    def clean_default(self):
        data = self.cleaned_data.get('default')
        return data

    def clean(self, *args, **kwargs):
        super(forms.ModelForm, self).clean(*args, **kwargs)





