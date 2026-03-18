from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
# import datetime
import csv





TEST_DATA_PATH = "./test-data.csv"
STEP_INDEX = 9
METER_DISTANCE_INDEX = 11
CALORIES_INDEX = 12

TIME_INDEX = 4
TIMEZONE_INDEX = 13



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
    # check that the category is an accepted one
    if req.category not in ['steps', 'distance_m', 'calories']: return

    data: dict = {'data': 0.0, 'time': None}
    with open(TEST_DATA_PATH, newline='') as file:
        reader = csv.reader(file, delimiter=',', quotechar='|')
        for row in reader:
            try:
                data['time'] = datetime.fromisoformat(row[TIME_INDEX]).replace(tzinfo=req.start_date.tzinfo)
                if data['time'] < req.start_date: continue
                elif data['time'] > req.end_date: break

                elif req.category == 'steps':
                    data['data'] = int(row[STEP_INDEX])
                elif req.category == 'distance_m':
                    data['data'] = float(row[METER_DISTANCE_INDEX])
                elif req.category == 'calories':
                    data['data'] = float(row[CALORIES_INDEX])

                yield data
            except Exception as e:
                print(e)
                continue







# i am going to try do notifications for here on



