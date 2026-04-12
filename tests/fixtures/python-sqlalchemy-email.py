# TRUE POSITIVE: Python SQLAlchemy filter_by with userinfo email
import requests
from flask import request, redirect
from models import User, db


def google_callback():
    code = request.args.get("code")
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

    user = User.query.filter_by(email=userinfo["email"]).first()
    if not user:
        user = User(email=userinfo["email"], name=userinfo["name"])
        db.session.add(user)
        db.session.commit()
    return redirect("/dashboard")
