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
      await fetch(
        `${baseUrl}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(json),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response;
        })
        .then((response) => response.json())
        .then((data) => {
          console.log("Received the following JWT:");
          console.log(data.jwt);
        });

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
