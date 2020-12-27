from django.shortcuts import render
from django.views import generic
from .models import SideNav
from django.template.response import TemplateResponse
from compressor import compress as cp


class homePage(generic.ListView):
    template_name = "report/index.html"
    context_object_name = 'sideLinks'

    def get_queryset(self):
        return SideNav.objects.all


def report(request, slug_val):
    side_nav = SideNav.objects.filter(slug=slug_val)
    for i in side_nav:
        temp = i.template

    # a = render(request, "report/content.html", {'temp': temp, 'sideLinks': SideNav.objects.all, 'title': slug_val,
    # 'view': 'report'})

    data = {
            'html': temp.html,
            'css': temp.css,
            'js': temp.js,
            'title': side_nav[0].side_nav,
            'sideLinks': SideNav.objects.all,
            }

    response = TemplateResponse(request, 'report/detail.html', data)
    compress = cp.compress()
    response.app_name = request.resolver_match.app_name
    response.add_post_render_callback(compress.getLinks)

    return response



