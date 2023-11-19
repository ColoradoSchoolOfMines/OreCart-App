# Ore Cart Backend

## Development Overview 🌟

The backend will be used to store locations of the shuttles, serve that data to the frontend, and make statistics about the Ore Cart queryable.

## Development Expectations 📌

### Dependencies 📦

Keeping track of dependencies can be hard and frustrating. As such, we have a `requirements.txt` file that can be used to install the dependencies with `pip install -r requirements.txt`. If you add a dependency and know how to update the `requirements.txt` accordingly please do, if you do not know how to update it, run `pip freeze > requirements.txt`.

One side note regarding updating the `requirements.txt`, please do not add anything unnecessary to it! We want to minimize bloat for everyone, but also because our CI build needs to install the requirements.txt frequently, so adding unnecessary dependencies will slow down our CI.

---

### Use a Python Virtual Environment 🐍

For consistency in our development experience we will be using a python virtual environment (venv). Venv's are useful because python packages have conflicts ocassionally and venvs isolate packages. 👩‍💻

To create a venv run the following command (this may vary slightly depending on your installation of python):

```
python3 -m venv venv
```

Before you start working on this project, activate the venv. To that run the following command (again this may vary by system):

```
source venv/bin/activate
```

When you are done working on this project, deactivate the venv. The following command deactivate the venv (This should be fairly standardized):

```
deactivate
```

---

### Running the server

To run the backend, ensure your venv is running:

```
source venv/bin/activate
```

Then execute the following command:

```
uvicorn src.main:app --reload
```

The server will be running on `localhost:8000`!

---

### Formatting, Linting, Typing, and More 🛠️

Our repository has CI running and checking the code passes several checks (black, mypy, isort, and pylint). If you want to know what the checks are and how to check locally read below! 🧹

One issue in large python projects is inconsistent code formatting. Thankfully we have black! black is code formatter for python that can be run via the command line. In our requirements.txt, which you should keep up to date as it changes, is the correct packages for black (and all the other tools in this section). Our CI runs `black --check` which will cause the CI to fail if the code is not formatted. Conveniently you can format your code with `black filepath`. ✨

Another issue in python is types (or the lack thereof). mypy is a tool that keeps our types in check. Our CI build runs `mypy --check`. While mypy doesn't have an automatic fix, it should be easy to maintain compliant code. 📑

A different issue regarding formatting is import statements. In python they can get messy easily, and black doesn't force them to be in any order. That's where isort comes in. isort forces a specific order for import statements, don't worry though you can automagically sort your imports by running `isort filepath`. Our CI build also runs `isort --check`. 📦

We are using pylint to verify that our python doesn't have any obvious errors. Our CI is configured to test with `pylint -E` which will only fail if there are errors detected. 🐞

Lastly, we will be unit testing the backend with `pytest`. This allows us to ensure the routes and other components are working correctly before they are exposed to users. Our CI build runs `pylint`, which should automatically fail as soon as one test fails.

---

Feel free to reach out if you have any questions or need further clarification on any of these development expectations! 🙌
