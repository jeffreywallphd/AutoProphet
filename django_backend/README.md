# Django Setup Steps:

1. First, create an environment using following command in your vs code terminal 
(file location should be : ...\OpenFinAL\django_backend>):

* For Windows:
- To create a virtual environment : python -m venv venv
- To activate virtual environment : .\venv\Scripts\activate

* For Linux / macOS:
- To create a virtual environment : python3 -m venv venv
- To activate virtual environment : source venv/bin/activate

2. Then, install dependencies using below code:
- pip install -r requirements.txt

3. then create .env file in your django_backend > django_backend location which should contain below information:
    DATABASE_NAME=mydatabase 
    DATABASE_USER=myuser
    DATABASE_PASSWORD=mypassword
    DATABASE_HOST=localhost
    DATABASE_PORT=3306
- Change those dummy values with the actual values. 

4. Now, make sure your file location in your terminal is ...\OpenFinAL\django_backend> then start hitting below commands one by one:
- python manage.py makemigrations
- python manage.py migrate
- python manage.py runserver

* And it is all set..

# Django Quick setup

Only to be used after doing Django Setup Steps

1. activate virtual environment
- Windows: .\venv\Scripts\activate
- Linux / macOS: source venv/bin/activate

2. pip install -r requirements.txt

3. move to ...\OpenFinAL\django_backend. run "python manage.py runserver"

# When adding new dependacys
Whenever you need to run pip install make sure to add the library to the requirements.txt [file](requirements.txt)
