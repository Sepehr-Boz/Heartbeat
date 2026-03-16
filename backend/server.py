from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from datetime import datetime, timedelta
from calendar import monthrange
import csv
import random
from enum import Enum

#scheduler
from apscheduler.schedulers.background import BackgroundScheduler




# TEST_DATA_PATH = "./test-data.csv"
# STEP_INDEX = 9
# METER_DISTANCE_INDEX = 11
# CALORIES_INDEX = 12

# TIME_INDEX = 4
# TIMEZONE_INDEX = 13



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



def lerp(a: float, b: float, t: float):
    return a * (1.0 - t) + (b * t)


# min and max values used for generating the random data points
STEPS_MIN = 0
STEPS_MAX = 500
DISTANCE_MIN = 0
DISTANCE_MAX = 30
CALORIES_MIN = 2
CALORIES_MAX = 20
HEARTRATE_MIN = 60
HEARTRATE_MAX = 160


class DataGrouping(str, Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"
    yearly = "yearly"

class DataGroupingMode(str, Enum):
    sum = "sum"
    mean = "mean"

class DataRequestParams(BaseModel):
    category: str
    min_date: datetime | None = None
    max_date: datetime | None = None
    uid: str
    group: DataGrouping | None = None
    mode: DataGroupingMode | None = None


# TODO: try and speed up this function by asyncing it/threading it with multiple random instances?
# TODO: maybe use a random instance for every month?


# TODO: add some variation based on the min and max values based on the user id seed?


@app.post("/get_data/")
def get_data(req: DataRequestParams):
    print(req)
    print(req.group)


    # check that the category is an accepted one
    if req.category not in ['steps', 'distance_m', 'calories', 'heartrate']: return

    check_against_min_date: bool = req.min_date != None
    check_against_max_date: bool = req.max_date != None

    mode: DataGroupingMode = DataGroupingMode.sum if req.mode is None else req.mode

    rand_seed: int = hash(req.uid)
    generator: random.Random = random.Random()
    generator.seed(rand_seed)

    curr_date: datetime = datetime.now()
    start_date: datetime = datetime(curr_date.year, 1, 1)
    if check_against_min_date:
        start_date = start_date.replace(tzinfo=req.min_date.tzinfo)
    end_date: datetime = datetime(curr_date.year + 1, 1, 1)
    if check_against_max_date:
        end_date = end_date.replace(tzinfo=req.min_date.tzinfo)
    date_increment: datetime = timedelta(minutes=30)

    all_data: list[dict] = [
        {
            'data': 0.0,
            'time': start_date
        }
    ]

    # loop through all the dates form start_date to the clamped max_date generating new random data points in increments
    while True:
        data: dict = {
            'data': 0.0,
            'time': all_data[-1]['time'] + date_increment
        }
        data['data'] = generator.triangular(
            low= (STEPS_MIN if req.category == "steps"
            else DISTANCE_MIN if req.category == "distance_m"
            else CALORIES_MIN if req.category == "calories"
            else HEARTRATE_MIN)
            + lerp(
                (STEPS_MIN if req.category == "steps"
                else DISTANCE_MIN if req.category == "distance_m"
                else CALORIES_MIN if req.category == "calories"
                else HEARTRATE_MIN),
                (STEPS_MAX if req.category == "steps"
                else DISTANCE_MAX if req.category == "distance_m"
                else CALORIES_MAX if req.category == "calories"
                else HEARTRATE_MAX),
                (data['time'].hour if data['time'].hour <= 12 else 12 - (data['time'].hour - 12)) / 12),

            high= (STEPS_MAX if req.category == "steps"
            else DISTANCE_MAX if req.category == "distance_m"
            else CALORIES_MAX if req.category == "calories"
            else HEARTRATE_MAX)
            * lerp(0, 1, (data['time'].hour if data['time'].hour <= 12 else 12 - (data['time'].hour - 12)) / 12),

            mode= lerp(
                a= (STEPS_MAX if req.category == "steps"
                else DISTANCE_MAX if req.category == "distance_m"
                else CALORIES_MAX if req.category == "calories"
                else HEARTRATE_MAX),

                b= (STEPS_MAX if req.category == "steps"
                else DISTANCE_MAX if req.category == "distance_m"
                else CALORIES_MAX if req.category == "calories"
                else HEARTRATE_MAX),

                t= (data['time'].hour if data['time'].hour <= 12 else 12 - (data['time'].hour - 12)) / 12
            )
        )
        all_data.append(data)

        if check_against_min_date and data['time'] < req.min_date:
            print("skipping", data)
            # pop to ensure that only 1 element is kept because we don't care about the elements before the clamped time
            all_data.pop(0)
            continue
        elif (check_against_max_date and data['time'] > req.max_date) or data['time'] > end_date:
            break
        else:
            # check if theres a grouping param and if so then group based on it
            if req.group is None:
                yield data
            else:
                # compare the last and first elements times, if passed the 'threshold' of the grouping increment then group all the
                # elements into one and yield it
                first_dp_time: datetime = all_data[0]['time']
                last_dp_time: datetime = all_data[-1]['time']
                dif_time: timedelta = last_dp_time - first_dp_time
                grouped_data: dict = {
                    'data': 0,
                    'time': None
                }
                # timedelta only has attributes microseconds, seconds, days.
                # so to check for 1 hour need to calculate how many seconds, and for 1 month need to calculate how many days
                if req.group == DataGrouping.daily and dif_time.seconds > (1 * 60 * 60):
                    grouped_data['time'] = first_dp_time.replace(minute=0, second=0, microsecond=0)
                    if mode == DataGroupingMode.sum:
                        grouped_data['data'] = sum([x['data'] for x in all_data])
                    elif mode == DataGroupingMode.mean:
                        num_elems: int = len(all_data)
                        grouped_data['data'] = sum([x['data'] / num_elems for x in all_data])
                    all_data.clear()
                    # need to append the data back to all_data as the list having at least one element is required to get the next time
                    # for the next element
                    all_data.append(data)
                    yield grouped_data
                elif req.group == DataGrouping.weekly and dif_time.days >= 1:
                    grouped_data['time'] = first_dp_time.replace(hour=0, minute=0, second=0, microsecond=0)
                    if mode == DataGroupingMode.sum:
                        grouped_data['data'] = sum([x['data'] for x in all_data])
                    elif mode == DataGroupingMode.mean:
                        num_elems: int = len(all_data)
                        grouped_data['data'] = sum([x['data'] / num_elems for x in all_data])
                    all_data.clear()
                    all_data.append(data)
                    yield grouped_data
                elif req.group == DataGrouping.monthly and dif_time.days >= 7:
                    grouped_data['time'] = first_dp_time.replace(hour=0, minute=0, second=0, microsecond=0)
                    if mode == DataGroupingMode.sum:
                        grouped_data['data'] = sum([x['data'] for x in all_data])
                    elif mode == DataGroupingMode.mean:
                        num_elems: int = len(all_data)
                        grouped_data['data'] = sum([x['data'] / num_elems for x in all_data])
                    all_data.clear()
                    all_data.append(data)
                    yield grouped_data
                elif req.group == DataGrouping.yearly and dif_time.days > monthrange(first_dp_time.year, first_dp_time.month)[1]:
                    grouped_data['time'] = first_dp_time.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                    if mode == DataGroupingMode.sum:
                        grouped_data['data'] = sum([x['data'] for x in all_data])
                    elif mode == DataGroupingMode.mean:
                        num_elems: int = len(all_data)
                        grouped_data['data'] = sum([x['data'] / num_elems for x in all_data])
                    all_data.clear()
                    all_data.append(data)
                    yield grouped_data
    
    # after breaking out check if have any elements still and if grouping still
    # if so then group the data again and release the rest of the elements
    first_dp_time: datetime = all_data[0]['time']
    last_dp_time: datetime = all_data[-1]['time']
    grouped_data: dict = {
        'data': 0,
        'time': None
    }
    # dont check if theres a complete hour/day/month passed because if not then it will not display any data at all, and instead we will still
    # want the data for the last 50 minutes or so rather than hour
    if req.group == DataGrouping.daily:
        grouped_data['time'] = first_dp_time.replace(minute=0, second=0, microsecond=0)
        if mode == DataGroupingMode.sum:
            grouped_data['data'] = sum([x['data'] for x in all_data])
        elif mode == DataGroupingMode.mean:
            num_elems: int = len(all_data)
            grouped_data['data'] = sum([x['data'] / num_elems for x in all_data])
        all_data.clear()
        yield grouped_data
    elif req.group == DataGrouping.weekly:
        grouped_data['time'] = first_dp_time.replace(hour=0, minute=0, second=0, microsecond=0)
        if mode == DataGroupingMode.sum:
            grouped_data['data'] = sum([x['data'] for x in all_data])
        elif mode == DataGroupingMode.mean:
            num_elems: int = len(all_data)
            grouped_data['data'] = sum([x['data'] / num_elems for x in all_data])
        all_data.clear()
        yield grouped_data
    elif req.group == DataGrouping.monthly:
        grouped_data['time'] = first_dp_time.replace(hour=0, minute=0, second=0, microsecond=0)
        if mode == DataGroupingMode.sum:
            grouped_data['data'] = sum([x['data'] for x in all_data])
        elif mode == DataGroupingMode.mean:
            num_elems: int = len(all_data)
            grouped_data['data'] = sum([x['data'] / num_elems for x in all_data])
        all_data.clear()
        yield grouped_data
    elif req.group == DataGrouping.yearly:
        grouped_data['time'] = first_dp_time.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if mode == DataGroupingMode.sum:
            grouped_data['data'] = sum([x['data'] for x in all_data])
        elif mode == DataGroupingMode.mean:
            num_elems: int = len(all_data)
            grouped_data['data'] = sum([x['data'] / num_elems for x in all_data])
        all_data.clear()
        yield grouped_data




# class GetDataRequest(BaseModel):
#     category: str
#     start_date: datetime | None = None
#     end_date: datetime | None = None

# @app.post("/data/")
# def get_data(req: GetDataRequest):
#     # check that the category is an accepted one
#     if req.category not in ['steps', 'distance_m', 'calories']: return

#     data: dict = {'data': 0.0, 'time': None}
#     with open(TEST_DATA_PATH, newline='') as file:
#         reader = csv.reader(file, delimiter=',', quotechar='|')
#         for row in reader:
#             try:
#                 data['time'] = datetime.fromisoformat(row[TIME_INDEX]).replace(tzinfo=req.start_date.tzinfo)
#                 if data['time'] < req.start_date: continue
#                 elif data['time'] > req.end_date: break

#                 elif req.category == 'steps':
#                     data['data'] = int(row[STEP_INDEX])
#                 elif req.category == 'distance_m':
#                     data['data'] = float(row[METER_DISTANCE_INDEX])
#                 elif req.category == 'calories':
#                     data['data'] = float(row[CALORIES_INDEX])

#                 yield data
#             except Exception as e:
#                 print(e)
#                 continue



# ! WHEN RUNNING DURING THE EXPO RUN USING UVICORN INSTEAD WITH A HARDCODED HOST IP
# ! THEN IN THE FRONTEND HARDCODE THE IPS SO THAT THEY ALL DIRECT TO THIS INSTEAD OF LOCALHOST
# ! BECAUSE NEED TO HOST THE SERVER OVER A NETWORK FOR THE EXPO
# if __name__ == "__main__":
#     uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)


# i am going to try do notifications for here on



