# Waste Wise Eats

A recipe app that starts from what is already in your kitchen. List the ingredients you have on hand and get matching recipes back, aimed at cutting down food waste one meal at a time.

## Features

- Search recipes by the ingredients you already have, through the Spoonacular API
- User accounts, so favorite recipes can be saved
- A Django REST API backend paired with a React frontend

## Tech stack

- Backend: Django, Django REST Framework
- Frontend: React

## Running locally

Backend:

```
python -m venv venv
venv\Scripts\activate
pip install django djangorestframework django-cors-headers requests python-dotenv
python manage.py migrate
python manage.py runserver
```

Create a `.env` file with your Spoonacular API key and a Django secret key.

Frontend:

```
cd frontend
npm install
npm start
```
