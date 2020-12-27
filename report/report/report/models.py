from django.db import models

# Create your models here.


class Templates(models.Model):
    template_name = models.CharField(max_length=100, primary_key=True)
    html = models.TextField(null=True)
    js = models.TextField(null=True)
    css = models.TextField(null=True)

    def __str__(self):
        return self.template_name


class SideNav(models.Model):
    template = models.ForeignKey(Templates, on_delete=models.DO_NOTHING)
    side_nav = models.CharField(max_length=100, primary_key=True)
    tab_index = models.IntegerField(null=True)
    slug = models.CharField(max_length=250,default="null")

    def __str__(self):
        return self.side_nav


class FieldData(models.Model):
    side_nav = models.ForeignKey(SideNav, on_delete=models.CASCADE)
    field = models.TextField()


    def __str__(self):
        return self.field


















