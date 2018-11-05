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


    


# @app.route("/top_airlines")
# def names():
#     flight_data = pd.read_sql("SELECT * FROM flights_data",engine)
#     flight_data_carrier =flight_data.groupby(['carrier_name'])
#     top_airlines = flight_data_carrier['arr_del15'].mean()
#     top_airlines = top_airlines.sort_values(ascending = False)
#     topten = top_airlines.head(10)
#     top = topten.to_dict()
   
#     return (top)
@app.route("/top_airports")
def airports():
    airports_data = pd.read_sql("SELECT airport_name,arr_flights FROM flights_data",engine)
    airport_grouped = airports_data.groupby(["airport_name"])
    top_airports = airport_grouped['arr_flights'].sum()
    top_airports = top_airports.sort_values(ascending = False)
    topten_airports = top_airports.head(10)
    top_airport_names = topten_airports.to_dict()
    return jsonify(top_airport_names)


if __name__ == "__main__":
    app.run()
