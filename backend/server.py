from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import datetime
import csv


TEST_STEPCOUNT_PATH = "./test-step-data.csv"
RUN_STEP_INDEX = 2
WALK_STEP_INDEX = 3
STEP_STARTTIME_INDEX = 4



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"]
)


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/test")
def test():
    return "hello"

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}





# TODO: change the start and end to be of datetime types and only return data points inbetween those times
@app.get("/data/{category}")
def get_data(category: str, start = None, end = None):
    count: int = 0
    if category == "stepcount":
        # read data from the path and parse each row into a dictionary
        # if the time is between the start and end then yield it otherwise ignore
        with open(TEST_STEPCOUNT_PATH, newline='') as f:
            reader = csv.reader(f, delimiter=',', quotechar='|')
            for row in reader:
                try:
                    data: dict = {
                        'steps': int(row[RUN_STEP_INDEX]) + int(row[WALK_STEP_INDEX]), 
                        'time': row[STEP_STARTTIME_INDEX]
                    }

                    yield data

                    # ! TESTING WITH A SMALL DATASET
                    count += 1
                    if count > 5:
                        break


                except Exception:
                    continue

    else:
        pass