import re
import pandas as pd
import numpy as np

file = open('test.js')
js = file.read()
file.close()


def compress(js):

    quotes_single, quotes_double = False, False
    small_bracket, big_bracket, curly_bracket = False, False, False
    colon = False
    semi_colon = False
    assign, compare = False, False
    word_break = False
    keyword = False
    word = ""
    word_break_list = ['[', ']', '(', ')', '{', '}', ';', ':', '.']
    word_break_char = None

    regex = re.compile(r'\s')

    for i in js:
    	word_break = False
    	colon = False
        if regex.search(i) is not None:
        	if quotes_double or quotes_single:
        		word = word +i
        	else:
        		word_break = True
        elif i == '{':
        	curly_bracket = True
        elif i == '}' and curly_bracket:
        	curly_bracket = False
        elif i == '[':
        	big_bracket = True
        elif i == ']' and big_bracket:
        	big_bracket = False
        elif i == '(':
        	small_bracket = True
        elif i == ')' and small_bracket:
        	small_bracket = False
		elif i == ';':
        	colon = True


    return js


compress(js)
