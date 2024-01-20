import React from 'react';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const LoginPage: React.FC = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await fetch(
        `${baseUrl}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: new FormData(e.currentTarget),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response;
        });

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <main>

      <h1>Log In</h1>

      <form method="post" onSubmit={handleSubmit}>
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
