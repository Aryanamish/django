from django.db import models

# Create your models here.


class Database(models.Model):
    field_name = models.CharField(max_length=100)
    data = models.TextField(null=True)

    def __str__(self):
        return self.field_name