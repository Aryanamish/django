from django.shortcuts import render, HttpResponse

def page_not_found(request, exception):
	response = render(
		request,
		'error/404.html',
	)

	response.status_code = 404

	return response


def forbidden(request, exception):
	response = render(
		request,
		'error/403.html',
	)

	response.status_code = 403

	return response


def server_error(request):
	response = render(
		request,
		'error/500.html',
	)

	response.status_code = 500

	return response


def bad_request(request, exception):
	response = render(
		request,
		'error/400.html',
	)

	response.status_code = 400

	return response