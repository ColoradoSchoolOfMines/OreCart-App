import { useQuery, useQueryClient } from '@tanstack/react-query';
import React  from 'react';
// import Card from '../../components/card/card';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

// consider putting the form stuff in a class maybe?
const AuthPage: React.FC = () => {
  //const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json
    var json = {};
    (new FormData(e.currentTarget)).forEach((value, key) => json[key] = value);
    try {
      const response = await fetch(
        `${baseUrl}/auth/`,
        {
          method: 'POST',
          body: JSON.stringify(json),
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      //await queryClient.invalidateQueries({ queryKey: ['auth'] });
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <main>

      <h1>Auths</h1>

        <form method="post" onSubmit={handleSubmit}>
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
