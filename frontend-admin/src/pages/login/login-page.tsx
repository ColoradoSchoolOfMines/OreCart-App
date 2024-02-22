import React from 'react';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

function onLoginFail() {
  document.getElementById('login-confirmation').innerHTML='username or password incorrect';
  document.getElementById('login-confirmation').style.display='block';
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    body: new FormData(e.currentTarget),
    credentials: 'include',
  })
    .then((response) => {
      document.getElementById('login-confirmation').style.display='block';
      if (response.status == 400) {
        onLoginFail();
      }
    })
    .catch((error) => {
      onLoginFail();
    });
}

const LoginPage: React.FC = () => {
  return (
    <main>

      <h1>Log In</h1>

      <form method="post" action={`${baseUrl}/auth/login`} onSubmit={handleSubmit}>
        <div>
          <label>Username:
            <input type="text" name="username" required />
          </label>
        </div>
        <div>
          <label>Password:
            <input type="password" name="password" required />
          </label>
        </div>
        <div>
          <input type="submit" value="Log in" />
        </div>
      </form>
      <p id="login-confirmation" style={{"display": "none"}}>You have logged in successfully; other pages are now available!</p>

    </main>
  );
};

export default LoginPage;
