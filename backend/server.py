from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
# import datetime
import csv


TEST_STEPCOUNT_PATH = "./test-step-data.csv"
STEP_INDEX = 9
STEP_STARTTIME_INDEX = 4
STEP_TIMEZONE_INDEX = 13



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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




class GetDataRequest(BaseModel):
    category: str
    start_date: datetime | None = None
    end_date: datetime | None = None



# TODO: take in datetime/time interval and group together datapoints into a single point at each interval
# TODO: for example, if a day is passed then it groups all points within the same day into one point and returns that one single point
@app.post("/data/")
def get_data(req: GetDataRequest):
    all_data: list[dict] = []
    if req.category == "steps":
        # read data from the path and parse each row into a dictionary
        # if the time is between the start and end then yield it otherwise ignore
        with open(TEST_STEPCOUNT_PATH, newline='') as f:
            reader = csv.reader(f, delimiter=',', quotechar='|')
            data: dict = {'data': 0, 'time': 0}
            for row in reader:
                try:
                    time: datetime = datetime.fromisoformat(row[STEP_STARTTIME_INDEX])
                    time = time.replace(tzinfo=req.start_date.tzinfo)

                    if time < req.start_date: 
                        print(time, "rejected")
                        continue
                    elif time > req.end_date: break
                    else:
                        print(time, "accepted")
                        data: dict = {
                            'data': int(row[STEP_INDEX]), 
                            'time': time
                        }
                        all_data.append(data)
                        # yield data


                except Exception as e:
                    print(e)
                    continue

            return all_data

    else:
        pass