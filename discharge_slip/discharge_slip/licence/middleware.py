import uuid
from .models import Licence
import hashlib
from django.shortcuts import render


class CheckLicence:

    def __init__(self, get_response):
        self.get_response = get_response
        unique_id = uuid.UUID(int=uuid.getnode()).urn
        self.unique_id = unique_id.split(':')[2]
        self.admin_pass = '61a1c669adcafeccf86c3a2f689415652bb67484bfd69854252ecd00097df021' \
                          '3cc1a10ca87c4857184e7f946a192ed7600d4ac22c009e369ff3588d45bd4191'
        key = self.admin_pass + self.unique_id
        self.key = self._hash(key)
        self.verify = False
        try:
            db = Licence.objects.last()
            if db.licence_key == self.key:
                self.verify = True
        except:
            pass

    def _hash(self, string, round=5):
        for i in range(round):
            string = hashlib.sha512(string.encode('utf-8')).hexdigest()
        return string

    def __call__(self, request):
        if self.verify:
            response = self.get_response(request)
            return response
        context = {}
        if request.POST:
            psw = request.POST.get('psw')
            psw = self._hash(psw)
            if psw == self.admin_pass:
                if Licence.objects.all().count() > 0:
                    Licence.objects.all().delete()
                db = Licence(licence_key=self.key)
                if db.save():
                    context['message'] = "The Program is installed please Refresh the Page"
                    self.verify = True

        return render(request, 'licence/licence.html', context)
