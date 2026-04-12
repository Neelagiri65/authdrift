# TRUE NEGATIVE: Python handler keying on sub, not email
import requests
from django.contrib.auth.models import User


def google_oauth_callback(request):
    code = request.GET.get("code")
    token_resp = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": "...",
            "client_secret": "...",
            "redirect_uri": "...",
            "grant_type": "authorization_code",
        },
    )
    access_token = token_resp.json()["access_token"]
    userinfo = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    ).json()

    # Safe: keying on sub, storing email as display attribute
    user, created = User.objects.get_or_create(
        google_sub=userinfo["sub"],
        defaults={"email": userinfo["email"], "first_name": userinfo["given_name"]},
    )
    return user
