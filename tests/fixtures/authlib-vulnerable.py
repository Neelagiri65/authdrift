# Should trigger authlib-google-oauth-email-as-primary-key
from authlib.integrations.flask_client import OAuth
from flask import Flask
from myapp.models import User

app = Flask(__name__)
oauth = OAuth(app)

google = oauth.register(
    name="google",
    client_id="...",
    client_secret="...",
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


@app.route("/auth/callback")
def auth_callback():
    token = google.authorize_access_token()
    userinfo = token.get("userinfo")

    # VULNERABLE: using email as primary lookup key via .get()
    user = User.objects.get(email=userinfo.get("email"))
    return user
