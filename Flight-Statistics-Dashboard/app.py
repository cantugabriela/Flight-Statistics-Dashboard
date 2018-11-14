# Import Dependencies
import os
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine,inspect

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
#import csv,sqlite

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/flights_data.sqlite"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
# Samples_Metadata = Base.classes.sample_metadata
# Samples = Base.classes.samples



engine = create_engine("sqlite:///db/flights_data.sqlite", encoding='utf8')
conn = engine.connect()
session = Session(engine)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/data/")
def data():
    """Visit data."""
    return render_template("data.html")

@app.route("/summary/")
def summary():
    """Visit summary."""
    return render_template("summary.html")

@app.route("/years")
def years():
    years = pd.read_sql("SELECT year FROM flights_data",engine)
    year_list = years['year'].unique()
    return jsonify(year_list.tolist())

    


@app.route("/topflights2018")
def topflights2018():
    """Return a list of sample names with their average delay time."""
    flight_data = pd.read_sql("SELECT * FROM flights_data",engine)
    flight_data_delay = flight_data[[ "year", "carrier_name", "arr_delay"]]
    flight_data_delay_carrier = flight_data_delay.loc[(flight_data_delay['year'] == 2018), :]
    flight_data_delay_grouped = flight_data_delay_carrier.groupby(['carrier_name'])
    top_flights = flight_data_delay_grouped["arr_delay"].mean()
    flights_2018 = top_flights.to_dict()
    flights_2018 = sorted(flights_2018.items(), key=lambda t: t[1])
    return jsonify(flights_2018)

@app.route("/topflights/<Inputyear>")
def topflights(Inputyear):
    """Return a list of sample names with their average delay time."""
    flight_data = pd.read_sql("SELECT * FROM flights_data",engine)
    flight_data_delay = flight_data[[ "year", "carrier_name", "arr_delay"]]
    #flight_data_delay["year"] = str(flight_data_delay["year"])
    Inputyear = int(Inputyear)
    flight_data_delay_carrier = flight_data_delay.loc[(flight_data_delay['year'] == Inputyear), :]
    flight_data_delay_grouped = flight_data_delay_carrier.groupby(['carrier_name'])
    top_flights = flight_data_delay_grouped["arr_delay"].mean()
    #top_flights = top_flights.sort_values(ascending = False)
    #topflights = list(np.ravel(top_flights))
    top_flights = top_flights.to_dict()
    top_flights = sorted(top_flights.items(), key=lambda t: t[1])
    return jsonify(top_flights)

@app.route("/topflightsName/<Airport>/<Inputyear>")
def topflightsName(Airport, Inputyear):
    """Return a list of sample names with their average delay time."""
    flight_data = pd.read_sql("SELECT * FROM flights_data",engine)
    flight_data_delay = flight_data[[ "year", "airport_name", "carrier_name", "arr_delay"]]
    #flight_data_delay["year"] = str(flight_data_delay["year"])
    flight_data_delay = flight_data_delay.replace("Dallas/Fort Worth, TX: Dallas/Fort Worth International", "Dallas Fort Worth International")
    flight_data_delay = flight_data_delay.replace("Houston, TX: George Bush Intercontinental/Houston", "George Bush Intercontinental Houston")
    flight_data_delay = flight_data_delay.replace("Atlanta, GA: Hartsfield-Jackson Atlanta International", "Hartsfield Jackson Atlanta International")
    Inputyear = int(Inputyear)
    #Inputyear = 2018
    flight_data_delay_carrier = flight_data_delay.loc[(flight_data_delay['year'] == Inputyear)&(flight_data_delay['airport_name'] == Airport), :]
    flight_data_delay_grouped = flight_data_delay_carrier.groupby(['carrier_name'])
    top_flights = flight_data_delay_grouped["arr_delay"].mean()
    top_flightsName = top_flights.to_dict()
    top_flightsName = sorted(top_flightsName.items(), key=lambda t: t[1])
    return jsonify(top_flightsName)


@app.route("/topflightsAll")
def topflightsAll():
    """Return a list of sample names with their average delay time."""
    flight_data = pd.read_sql("SELECT * FROM flights_data",engine)
    flight_data_delay = flight_data[[ "year", "carrier_name", "arr_delay"]]
    #flight_data_delay_carrier = flight_data_delay.loc[(flight_data_delay['year'] == Inputyear), :]
    flight_data_delay_grouped = flight_data_delay.groupby(['carrier_name'])
    top_flights = flight_data_delay_grouped["arr_delay"].mean()
    #topflights = list(np.ravel(top_flights))
    top_flights_list = top_flights.to_dict()
    return jsonify(top_flights_list)


# @app.route("/top_airports")
# def airports():
#     airports_data = pd.read_sql("SELECT airport_name,arr_flights FROM flights_data",engine)
#     airport_grouped = airports_data.groupby(["airport_name"])
#     top_airports = airport_grouped['arr_flights'].sum()
#     top_airports = top_airports.sort_values(ascending = False)
#     topten_airports = top_airports.head(10)
#     top_airport_names = topten_airports.to_dict()
#     return jsonify(top_airport_names)

@app.route("/top_airports")
def airports():
    airports_data = pd.read_sql("SELECT airport_name,arr_flights FROM flights_data",engine)
    airports_data = airports_data.replace("Dallas/Fort Worth, TX: Dallas/Fort Worth International", "Dallas Fort Worth International")
    airports_data = airports_data.replace("Houston, TX: George Bush Intercontinental/Houston", "George Bush Intercontinental Houston")
    airports_data = airports_data.replace("Atlanta, GA: Hartsfield-Jackson Atlanta International", "Hartsfield Jackson Atlanta International")
    airport_grouped = airports_data.groupby(["airport_name"])
    top_airports = airport_grouped['arr_flights'].sum()
    top_airports = top_airports.sort_values(ascending = False)
    topten_airports = top_airports.head(10)
    top_airport_names = topten_airports.to_dict()
    return jsonify(top_airport_names)
    
@app.route("/monthly_count/<month>")
def month_count(month):
   airports_lat_lng = pd.read_sql("SELECT  airport_name,Latitude,Longitude,month,sum(arr_flights) sum_arr_flights,(sum(arr_del15)/sum(arr_flights))*100 del_pct FROM flights_data WHERE airport IN ('ATL', 'DFW', 'SFO', 'ORD', 'DEN', 'LAX', 'PHX', 'HOU', 'LAS', 'MSP') group by airport_name,month,Latitude,Longitude",engine)
   airports_lat_lng = airports_lat_lng.set_index('airport_name')
   month = int(month)
   print(month)
   test_data = airports_lat_lng.loc[airports_lat_lng['month']== month,:]
   air_dict = test_data.to_dict('index')
   print(air_dict)
   return jsonify(air_dict)

@app.route("/monthly_count_canc_div/<month>")
def month_counts(month):
   airports_lat_lngs = pd.read_sql("SELECT  airport_name,Latitude,Longitude,month,sum(arr_flights) sum_arr_flights,(sum(arr_del15)/sum(arr_flights))*100 del_pct ,sum(arr_cancelled) sum_arr_canc,sum(arr_diverted) sum_arr_div FROM flights_data WHERE airport IN ('ATL', 'DFW', 'SFO', 'ORD', 'DEN', 'LAX', 'PHX', 'HOU', 'LAS', 'MSP') group by airport_name,month,Latitude,Longitude",engine)
   airports_lat_lngs = airports_lat_lngs.set_index('airport_name')
   months = int(month)
   print(months)
   test_datas = airports_lat_lngs.loc[airports_lat_lngs['month']== months,:]
   air_dicts = test_datas.to_dict('index')
   print(air_dicts)
   return jsonify(air_dicts)


if __name__ == "__main__":
    app.run()



