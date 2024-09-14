import jwt
from django.conf import settings
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from .models import User 
import re
import logging

logger = logging.getLogger(__name__)

class TokenAuthenticationMiddleware(MiddlewareMixin):
    def _init_(self, get_response):
        self.get_response = get_response
        self.exempt_paths = [
            r'^/signup/$',
            r'^/login/$',
            r'^/verify/$',
            r'^/resend/$',
            r'^/checkEmail/$',
            r'^/resetPassword/$',
            r'^/resetOtp/$'
        ]

    def _is_exempt_path(self, path):
        for exempt_path in self.exempt_paths:
            if re.match(exempt_path, path):
                logger.info(f"Path exempted: {path}")
                return True
        logger.info(f"Path not exempted: {path}")
        return False

    def _call_(self, request):
        
        logger.info(f"Request path: {request.path}")
        print(request.path)

        if request.method == 'OPTIONS':
            return self.get_response(request)
        
        if request.path.startswith('/admin') or self._is_exempt_path(request.path):
            return self.get_response(request)
        
        token = request.headers.get('Authorization')
        if not token:
            return JsonResponse({'error': 'Token missing'}, status=401)
        
        # blacklisted_token = BlacklistedToken.objects.filter(token=token).first()
        # if blacklisted_token:
        #     return JsonResponse({'error': 'Token is Expired'}, status=403)

        try:
            # Decode the token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

            # Fetch the user based on the ID in the token payload
            user = User.objects.get(id=payload['id'])
            request.user = user  

        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token expired'}, status=401)

        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=401)

        # If everything is fine, proceed to the view
        return self.get_response(request)