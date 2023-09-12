# Ore Cart Backend

## Development Overview

The backend will be used to store locations of the shuttles, serve that data to the frontend, and make statistics about the Ore Cart queryable.

## Development Expectations

### Use a Python Virtual Environment

For consistency in our development experience we will be using a python virtual environment (venv). Venv's are useful because python packages have conflicts ocassionally and venvs isolate packages.

To create a venv run the following command (this may vary slightly depending on your installation of python):

```
python3 -m venv venv
```

Before you start working on this project, activate the venv. To that run the following command (again this may vary by system):

```
./venv/bin/activate
```

When you are done working on this project, deactivate the venv. The following command deactivate the venv (This should be fairly standardized):

```
deactivate
```

### Formatting, Linting, Typing, and More

To keep our code consistent and clean, we will use a variety of python packages to help us. 

We will be using `isort` to keep imports nice and wrangled. We will be using `mypy` for type checking. We will be using `black` for formatting. We will be using `Pylint` for linting.

More details to come on this, but it should be fairly easy.
