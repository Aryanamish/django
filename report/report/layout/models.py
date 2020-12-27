from django.db import models
from django.conf import settings

# Create your models here.


class Template(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    template_name = models.CharField(max_length=100)
    html = models.TextField(default='')
    property = models.TextField(default='')
    js = models.TextField(default='')
    css = models.TextField(default='')

    def __str__(self, *args, **kwargs):
        return self.template_name

    class Meta:
        unique_together = (
            ('user', 'template_name'),
        )