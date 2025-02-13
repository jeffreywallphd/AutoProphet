# Model Training Requirements

* You should have compatible GPU in your system to train the models or else it won't work you will have to install cuda libraries on your system.
* You will also need to put Hugging Face and Wandb API keys in django_backend's API key like shown below

        DATABASE_NAME=Your_MYSQL_Database_Name   
        DATABASE_USER=mis4000cob_appdev
        DATABASE_PASSWORD=............................
        DATABASE_HOST=mis4000.cob.mtu.edu
        DATABASE_PORT=3306
        WANDB_API_KEY=5................................
        HF_API_KEY=h...................................
        

* After everything just hit python manage.py runserver to run the UI though initially you will get some module not found errors and you will have to install those module one by one using command pip install module_name.

* Once you are done with it you will be able to run the UI successfully.