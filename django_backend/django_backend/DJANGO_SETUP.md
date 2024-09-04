# Django Setup Steps:

1. First, create an environment using following command in your vs code terminal 
(file location should be : ...\AutoProphet\django_backend>):

* For Windows:
- To create a virtual environment : python -m venv venv
- To activate virtual environment : .\venv\Scripts\activate

* For Linux / macOS:
- To create a virtual environment : python3 -m venv venv
- To activate virtual environment : source venv/bin/activate

2. Then, install dependencies using below code:
- pip install -r requirements.txt

3. then create .env file in your django_backend > django_backend > django_backend location which should contain below information:
    DATABASE_NAME=mydatabase 
    DATABASE_USER=myuser
    DATABASE_PASSWORD=mypassword
    DATABASE_HOST=localhost
    DATABASE_PORT=3306
- Change those dummy values with the actual values. 

* You may ask me why we have three same folders with same name in hierarchy. Well, the main folder is what I created and other two has been created by django (i.e. Django creates project when we use command django-admin startproject demo_name and it will create project named demo_name with a folder inside it named as demo_name.)

4. Now, make sure your file location in your terminal is ...\AutoProphet\django_backend\\django_backend> then start hitting below commands one by one:
- python manage.py makemigrations
- python manage.py migrate
- python manage.py runserver

* And it is all set..
