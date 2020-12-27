from django.shortcuts import render, redirect
import os


# Create your views here.

def print(request):
    response = redirect('/')
    os.startfile("C:/Users/Aryan/Desktop/test.txt", "print")
    return response