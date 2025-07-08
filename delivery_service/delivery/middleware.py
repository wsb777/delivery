class ForwardedPrefixMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Получаем префикс из заголовка
        prefix = request.META.get('HTTP_X_FORWARDED_PREFIX', '')
        if prefix:
            # Корректируем путь запроса
            request.path_info = request.path_info.replace(prefix, '', 1)
        return self.get_response(request)