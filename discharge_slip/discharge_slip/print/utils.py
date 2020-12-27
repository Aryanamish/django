from io import BytesIO, StringIO
from django.http import HttpResponse
from django.template.loader import get_template


from xhtml2pdf import pisa


def render_to_pdf(template_src, context_dict={}, show=False):
    template = get_template(template_src)
    html = template.render(context_dict)
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)

    if not pdf.err:
        if show is False:
            return result.getvalue()
        return HttpResponse(result.getvalue(), content_type='application/pdf')
    return None