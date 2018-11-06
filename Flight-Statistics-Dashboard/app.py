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

@app.route("/years")
def years():
    years = pd.read_sql("SELECT year FROM flights_data",engine)
    year_list = years['year'].unique()
    return jsonify(year_list.tolist())


# @app.route("/topflights2018")
# def topflights2018():
#     """Return a list of sample names with their average delay time."""
#     flight_data = pd.read_sql("SELECT * FROM flights_data",engine)
#     flight_data_delay = flight_data[[ "year", "carrier_name", "arr_delay"]]
#     flight_data_delay_carrier = flight_data_delay.loc[(flight_data_delay['year'] == 2018), :]
#     flight_data_delay_grouped = flight_data_delay_carrier.groupby(['carrier_name'])
#     top_flights = flight_data_delay_grouped["arr_delay"].mean()
#     flights_2018 = top_flights.to_dict()
#     return jsonify(flights_2018)

    
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