from django import template
import json
import datetime
from django.utils.html import mark_safe


register = template.Library()


@register.simple_tag
def has_error(error_message):
    if error_message:
        return 'has-error'
    else:
        return ''


@register.simple_tag
def help_block(message, temp):
    return_value = mark_safe('')
    if message:
        for i in message:
            return_value += temp.format(i) if i is not None else ''
    return mark_safe(return_value)


@register.simple_tag
def label(message, temp):
    return_value = ''
    if message:
        return_value += temp.format(message)
    else:
        return ''
    return mark_safe(return_value)


@register.simple_tag
def dynamic(form, count, *fields):
    count = count - 1

    return_val = ''

    for i in fields:
        if count == 0:
            t = i

        else:
            t = i + "_" + str(count)

        return_val += str(form[t])

    return mark_safe(return_val)


@register.simple_tag
def datalist(qs):
    r_value= ''
    for i in qs:
        r_value += f'<datalist id={i.field_name}>'
        lst = json.loads(i.data)
        for j in lst:
            r_value += f'<option value="{j}">{j.title()}</option>'
        r_value += '</datalist>'

    return mark_safe(r_value)


@register.filter
def date(value, args='%d%m%Y'):
    return datetime.datetime.strptime(value, args).date()\


@register.filter
def slip_id(value):
    return f'{value[0:6]} - {value[6:8]}/{value[8:10]}/{value[10:12]} - {value[12:14]}'
