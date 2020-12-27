from django import forms
from .models import Template


class CreateTemplate(forms.ModelForm):

    class Meta:
        model = Template
        fields = ['template_name']
        exclude = ['user', 'js', 'css', 'property']

    def clean_template_name(self):
        name = self.cleaned_data.get('template_name')
        query = Template.objects.filter(user=self.user, template_name=name)
        if query.exists():
            raise forms.ValidationError('Template Name Already Exist')
        return name

    def add_user(self, user_inc):
        self.user = user_inc

    def save(self, commit=True, *args, **kwargs):
        obj = super(forms.ModelForm, self).save(commit=False)
        if commit:
            obj.user = self.user
            obj.save()
