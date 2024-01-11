// import { useQuery, useQueryClient } from '@tanstack/react-query';
import React  from 'react';
// import Card from '../../components/card/card';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const AuthPage: React.FC = () => {

  return (
    <main>

      <h1>Auths</h1>

        <form method="post" action={`${baseUrl}/auth/`}>
          <div>
            <label for="username">Username:</label>
            <input type="text" name="username" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" name="password" required />
          </div>
          <div>
            <input type="submit" value="Log in" />
          </div>
        </form>

    </main>
  );
};

export default AuthPage;
