from django.db import models

# Create your models here.


class Patient(models.Model):
    patient_id = models.CharField(max_length=6, primary_key=True)
    patient_name = models.CharField(max_length=50, blank=False)
    age = models.IntegerField(blank=False, default=0)
    SEX_CHOICES = (
        ('F', 'Female',),
        ('M', 'Male',),
        ('O', 'Others',),
    )
    sex = models.CharField(
        max_length=1,
        choices=SEX_CHOICES,
    )
    dob = models.TextField(null=False)
    approx_dob = models.DateField(null=False)
    phone = models.TextField(null=True)

    def __str__(self):
        return self.patient_name


class Slip(models.Model):
    slip_id = models.CharField(max_length=15,  unique=True)
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    phone = models.CharField(max_length=45, null=True)
    report_no = models.CharField(max_length=3)
    date = models.DateField(auto_now_add=True)
    address = models.CharField(max_length=1000, null=True, blank=False)
    date_of_admission = models.DateField(null=False)
    date_of_operation = models.DateField(null=False)
    date_of_discharge = models.DateField(null=False)
    diagnosis = models.CharField(max_length=1000, null=True, blank=True)
    complain = models.CharField(max_length=1000, null=True, blank=True)
    investigation = models.TextField(null=True, blank=True)
    ot_procedure = models.CharField(max_length=500, null=True, blank=True)
    advice = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.slip_id



