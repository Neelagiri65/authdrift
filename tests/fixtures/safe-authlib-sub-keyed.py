# Should NOT trigger any rules — using sub as primary key
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

    # SAFE: using sub (OIDC subject ID) as immutable primary key
    user = User.objects.get(provider="google", provider_uid=userinfo["sub"])
    # email is stored as mutable contact attribute only
    user.email = userinfo.get("email", "")
    user.save()
    return user
