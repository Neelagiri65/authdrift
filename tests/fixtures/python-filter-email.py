# TRUE POSITIVE: Python Django filter + first() with userinfo email
import requests
from myapp.models import UserProfile


def google_login_callback(request):
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

    user = UserProfile.objects.filter(email=userinfo["email"]).first()
    if not user:
        user = UserProfile.objects.create(email=userinfo["email"], name=userinfo["name"])
    return user
