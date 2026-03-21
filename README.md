## Running the frontend
### 1. Navigate to the frontend folder `cd ./frontend/`
### 2. Then start the server `$env:HTTPS="false"; $env:HOST="localhost"; npm start`

## Installing new frontend modules
### 1. Navigate to the frontend folder `cd ./frontend/`
### 2. Then install the module `npm install x`

---

## Running the backend
### 1. Navigate to the backend folder `cd ./backend/`
### 2. Start the server `fastapi dev ./server.py`

## Installing current python packages
### 1. Navigate to the backend folder `cd ./backend/`
### 2. Install from requirements `pip install -r ./requirements.txt`
### 2.1 Should also install fastapi[standard] which isnt in requirements `pip install 'fastapi[standard]'`

## Installing new python packages
### 1. Navigate to the backend folder `cd ./backend/`
### 2. Install the new package `pip install x`

## Entering a virtual environment (for backend)
### 1. Navigate to the backend folder `cd ./backend/`
### 2. Start the venv `python3 -m venv venv`
### 3. Open the venv `source venv/bin/activate`


### this app will be design mainly for the resolution of `375 x 812`


## EXPO INSTRUCTIONS:
### 1. Run `ipconfig` in terminal and find your host's IPV4 address
### 2. Navigate to `server.py` in backend folder and set the host argument to the IPV4 address in the uvicorn.run()
### 3. Run the `server` file through python interpreter, don't need to use fastapi dev command
### ----
### 4. Navigate to the `network.js` file in frontend/config folder and set serverHost = IPV4:8000, set reactHost = IPV4:3000
### 5. Run the frontend from the terminal using `$env:HTTPS="true"; $env:HOST="INSERT IP ADDRESS HERE"; $env:PORT="3000"; npm start`
### 5.1 People accessing the website will however need to go through advanced settings to continue to the site, since its using HTTPS but still unsafe.


