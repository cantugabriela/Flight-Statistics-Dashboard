# Import Dependencies
import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///db/flights_data.sqlite", encoding='utf8')

# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(engine, reflect=True)

session = Session(engine)
flight_data = pd.read_sql("SELECT * FROM flights_data",engine)
# Save references to each table
# Samples_Metadata = Base.classes.sample_metadata
# Samples = Base.classes.samples

@app.route("/")
def index():
    """Return the homepage."""
  
    return render_template("index.html")


@app.route("/top_airports")
def airports():
    airports_data = pd.read_sql("SELECT airport_name,arr_flights FROM flights_data",engine)
    airport_grouped = airports_data.groupby(["airport_name"])
    top_airports = airport_grouped['arr_flights'].sum()
    top_airports = top_airports.sort_values(ascending = False)
    topten_airports = top_airports.head(10)
    top_airport_names = topten_airports.to_dict()
    return jsonify(top_airport_names)
    
# @app.route("/monthly_count/<month>")
# def month_count(month):
#     airports_data = pd.read_sql("SELECT airport_name,arr_flights,month,Latitude,Longitude FROM flights_data WHERE airport IN ('ATL', 'DFW', 'SFO', 'ORD', 'DEN', 'LAX', 'PHX', 'HOU', 'LAS', 'MSP')",engine)
#     month = int(month)
#     test_data = airports_data.loc[airports_data['month']== month,:]
#     grouped_airports = test_data.groupby(['airport_name'])
#     total_flights_month = grouped_airports['arr_flights'].sum()  
#     airport_lat = grouped_airports["Latitude"].unique()
#     airport_lng = grouped_airports["Longitude"].unique()
#     total_df = pd.DataFrame({"total_flights":total_flights_month,"latitude":airport_lat,"longitude":airport_lng})
#     converted_data = total_df.to_dict()
#     return jsonify(converted_data)
@app.route("/monthly_count/<month>")
def month_count(month):
    airports_lat_lng = pd.read_sql("SELECT  airport_name,Latitude,Longitude,month,sum(arr_flights) sum_arr_flights FROM flights_data WHERE airport IN ('ATL', 'DFW', 'SFO', 'ORD', 'DEN', 'LAX', 'PHX', 'HOU', 'LAS', 'MSP') group by airport_name,month,Latitude,Longitude",engine)
    airports_lat_lng = airports_lat_lng.set_index('airport_name')
    month = int(month)
    print(month)
    test_data = airports_lat_lng.loc[airports_lat_lng['month']== month,:]
    air_dict = test_data.to_dict('index')
    print(air_dict)
    return jsonify(air_dict)



if __name__ == "__main__":
    app.run()
