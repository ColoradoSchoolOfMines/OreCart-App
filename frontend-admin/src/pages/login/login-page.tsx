import React from 'react';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const LoginPage: React.FC = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {};

  return (
    <main>

      <h1>Log In</h1>

      <form action={`${baseUrl}/auth/login`} method="post" onSubmit={handleSubmit}>
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

    </main>
  );
};

export default LoginPage;
