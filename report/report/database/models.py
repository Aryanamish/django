from django.db import models
from django.conf import settings

# Create your models here.


class Db(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    database_name = models.CharField(max_length=200)
    data = models.TextField(null=False, default='[]')
    fields = models.TextField(null=False)

    class Meta:
        unique_together = (
            ('user', 'database_name'),
        )

    def __str__(self, *args, **kwargs):
        return self.database_name





