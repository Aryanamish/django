# Django MultiFormClass

This Model can be used to create multiple model form using one class

## How to use
Just copy and paste the Script in your project directory and import MultiModelForm

### Some Additionals Features are

* You can add multiple model by specifying it in Meta.model (list)
* can add common attribute to all the fields
* can add different HTML attribute to different Elements

** In case you are using Foreign in your model You have to override the save() method  **

### Overriding default Save method
-The default save method return list of models in the order of Meta.model property

```
class TestForm:
	class Meta:
		models = [model1, model2]
		exclude = []

	def save(self, commit=True):
	    model1, model2 = super(TestForm, self).save(commit=False)
	    model1.foreignkey = model2
	    if commit:
	    	model1.save()
	    	model2.save()

```
### Basic Example of how to use it

```
from .multimodelform import MultiModelForm
from . import models

class MultipleForm(MultiModelForm):
	class Meta:
 		model = [models.model1, models.model2]	# It is a list
		exclude = ['patient_id']
		widgets = {
		    'field1': forms.TextInput(attrs={
		        'onkeypress': 'alert("hi")'
		    })
		}
		attrs = {
		    'field1': {
		        'onkeypress': js_integer.format(12),
		        'list': 'live_search',
		    },
		    'field2': {
		        'list': 'live_search',
		    }
		}
		common_attrs = {
		    'class': 'form-control',
		    'autocomplete': 'off',
		}
		include = []
```
