from django import forms
from django.forms.models import  DeclarativeFieldsMetaclass
from django.forms.models import modelform_factory


class MultiModelFormMetaClass(DeclarativeFieldsMetaclass):

    def __new__(mcs, name, bases, attrs):
        # attrs['__init__'] = mcs.cus__init
        models = attrs['Meta'].model
        model_field  = {}
        for i in models:
            model_field[i] = i._meta.get_fields()
            fields = []
            exclude = []
            formfield_callback = attrs['Meta'].formfield_callback if hasattr(attrs['Meta'], 'formfield_callback') else None
            widgets = {}
            localized_fields = []
            labels = {}
            help_texts = {}
            error_messages = {}
            field_classes = {}
            include = []
            model_fields = i._meta.get_fields()
            for j in model_fields:
                field_name = j.name
                fields.append(j)
                if hasattr(attrs['Meta'], 'exclude') and field_name in attrs['Meta'].exclude:
                    exclude.append(field_name)

                if hasattr(attrs['Meta'], 'widgets') and field_name in attrs['Meta'].widgets:
                    widgets[field_name] = attrs['Meta'].widgets[field_name]

                if hasattr(attrs['Meta'], 'localized_fields') and field_name in attrs['Meta'].localized_fields:
                    localized_fields.append(field_name)

                if hasattr(attrs['Meta'], 'labels') and field_name in attrs['Meta'].labels:
                    labels[field_name] = attrs['Meta'].labels[field_name]

                if hasattr(attrs['Meta'], 'help_texts') and field_name in attrs['Meta'].help_texts:
                    help_texts[field_name] = attrs['Meta'].help_texts[field_name]

                if hasattr(attrs['Meta'], 'error_messages') and field_name in attrs['Meta'].error_messages:
                    error_messages[field_name] = attrs['Meta'].error_messages[field_name]

                if hasattr(attrs['Meta'], 'field_classes') and field_name in attrs['Meta'].field_classes:
                    field_classes[field_name] = attrs['Meta'].field_classes[field_name]

                if hasattr(attrs['Meta'], 'include') and field_name in attrs['Meta'].include:
                    include.append(field_name)

            for j in fields:
                if j not in include and len(include) != 0 and j not in exclude:
                    exclude.append(j)

            model_form = modelform_factory(model=i, form=forms.ModelForm, fields=None, exclude=exclude,
                                           formfield_callback=formfield_callback, widgets=widgets,
                                           localized_fields=localized_fields, labels=labels, help_texts=help_texts,
                                           error_messages=error_messages, field_classes=field_classes
                                           )

            for j in model_form.base_fields:
                attrs[j] = model_form.base_fields[j]
                if hasattr(attrs['Meta'], 'common_attrs'):
                    attrs[j].widget.attrs.update(attrs['Meta'].common_attrs)

                if hasattr(attrs['Meta'], 'attrs') and isinstance(attrs['Meta'].attrs.get(j), dict):
                    attrs[j].widget.attrs.update(attrs['Meta'].attrs.get(j))

        new_class = super(MultiModelFormMetaClass, mcs).__new__(mcs, name, bases, attrs)

        return new_class


class MultiModelForm(forms.Form, metaclass=MultiModelFormMetaClass):
    class Meta:
        model = []
        include = []
        exclude = []
        widget = []
        localized_fields = []
        labels = {}
        help_texts = {}
        error_messages = {}
        field_classes = {}
        attrs = {}
        common_attrs = {}

    def save(self, commit=True):
        data = []
        for i in self.Meta.model:
            d = i()
            for j in self.fields:
                if hasattr(d, j):
                    setattr(d, j, self.cleaned_data.get(j))
            if commit:
                d.save()
            data.append(d)
        return data
