import React from 'react';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  document.getElementById("login-confirmation").style.display="block";
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
