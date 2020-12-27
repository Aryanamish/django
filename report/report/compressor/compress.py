import bs4 as bs
#import numpy as np
import urllib.request as url
import pandas as pd
from django.conf import settings
import re
import os


class compress:

    static_folder = ""
    request = ""

    def getLinks(self, template_obj):
        return template_obj
        self.request = template_obj
        self.staticFolder()

        html = self.request.content

        soup = bs.BeautifulSoup(html, 'lxml')

        css_links = []
        js_links = []

        __link = soup.find_all('link')

        for i in __link:
            href = i.get('href')

            if href.find('.js') != -1:
                href = self.static_folder + href
                css_links.append(href)
                css = open(href, 'r')
                css = css.read()
                self.compressCss(css)

        __script = soup.find_all('script')

        for i in __script:
            href = i.get('src')

            if href is not None and href.find('jquery.js') != -1:
                href = self.static_folder + href
            else:
                href = None

            if href is not None:
                js_links.append(href)
                js = open(href, 'r')
                self.compressJs(js.read(), href)

        return self.request

    def compressCss(self, css_script):
        pass

    def compressJs(self, js_script, file_name):
        # to remove comment

        regex = r'(?s)/\*.*?\*/|//[\w\W][^\n\r]*'
        pattern = re.compile(regex)
        js_script = re.sub(pattern, '', js_script)

        # to remove white spaces
        regex = r'(\s+)(?=(?:[^\'\"]*[\'\"][^\'\"]*[\'\"])*[^\'\"]*$)(?<!\b\s\b)(?<!abstract )(?<!arguments )(' \
                r'?<!await )(?<!boolean )(?<!break )(?<!byte )(?<!case )(?<!catch )(?<!char )(?<!class )(?<!const )(' \
                r'?<!continue )(?<!debugger )(?<!default )(?<!delete )(?<!do )(?<!double )(?<!else )(?<!enum )(' \
                r'?<!eval )(?<!export )(?<!extends )(?<!false )(?<!final )(?<!finally )(?<!float )(?<!for )(' \
                r'?<!function )(?<!goto )(?<!if )(?<!implements )(?<!import )(?<!in )(?<!instanceof )(?<!int )(' \
                r'?<!interface )(?<!let )(?<!long )(?<!native )(?<!new )(?<!null )(?<!package )(?<!private )(' \
                r'?<!protected )(?<!public )(?<!return )(?<!short )(?<!static )(?<!super )(?<!switch )(' \
                r'?<!synchronized )(?<!this )(?<!throw )(?<!throws )(?<!transient )(?<!true )(?<!try )(?<!typeof )(' \
                r'?<!var )(?<!void )(?<!volatile )(?<!while )(?<!with )(?<!yield )'
        pattern = re.compile(regex)
        js_script = re.sub(pattern, '', js_script)

        self.request.content = js_script



    def staticFolder(self):

        if settings.STATICFILES_DIRS:
            self.static_folder = self.request.app_name
        else:
            self.static_folder = self.request.app_name






