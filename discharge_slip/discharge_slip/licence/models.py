from django.db import models


class Licence(models.Model):
    licence_key = models.CharField(max_length=128, unique=True)

    def save(self, *args, **kwargs):
        if Licence.objects.count() > 0:
            return False
        else:
            super(Licence, self).save(*args, **kwargs)
            return True

    def __str__(self):
        return self.licence_key