from django.shortcuts import HttpResponse, HttpResponseRedirect, get_object_or_404
from .utils import render_to_pdf
import json
import tempfile
import win32print
import locale
from slip.models import Slip
import ghostscript


# Create your views here.


def print_pdf(data=None):
    data['investigation'] = tuple(json.loads(data['investigation']))
    data['advice'] = tuple((json.loads(data['advice'])))

    context = {
        'data': data,
    }
    pdf = render_to_pdf('print/slip.html', context)

    temp1 = tempfile.mktemp('.pdf')
    f1 = open(temp1, 'ab')
    f1.write(pdf)
    f1.close()

    args = [
        "-dPrinted", "-dBATCH", "-dNOSAFER", "-dNOPAUSE", "-dNOPROMPT"
        "-q",
        "-dNumCopies#1",
        "-sDEVICE#mswinpr2",
        f'-sOutputFile#"%printer%{win32print.GetDefaultPrinter()}"',
        f'"{temp1}"'
    ]
    encoding = locale.getpreferredencoding()
    args = [a.encode(encoding) for a in args]
    ghostscript.Ghostscript(*args)

    return True


def show_pdf(request):

    if request.GET.get('slip_id'):
        slip = get_object_or_404(Slip, slip_id__exact=request.GET.get('slip_id'))
        slip.investigation = tuple(json.loads(slip.investigation))
        slip.advice = tuple(json.loads(slip.advice))
        context = {
            'data': slip
        }
        pdf = render_to_pdf('print/slip.html', context, show=True)

        return HttpResponse(pdf, content_type='application/pdf')
    else:
        return HttpResponseRedirect('/')


