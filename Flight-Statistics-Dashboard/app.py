# Import Dependencies
import os
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine,inspect
from sqlalchemy import *

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)


#################################################
# Database Setup
#################################################

# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/flights_data.sqlite"
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flights_data.sqlite'
# # app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)

engine = create_engine('sqlite:///test.sqlite')
meta = MetaData()
meta.reflect(bind=engine)


Flight_data = meta.tables['flights_data']

print(Flight_data)
@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/years")
def years():
    session = Session(engine)
    query = session.query(Flight_data.columns.year).all()
    print(type(query))
    # year_list = pd.read_sql_query(query, conn=engine)
    # print(year_list)
    # year_list = year_list['year'].unique()
    # print(year_list)
    # session.close()

    output = []
    for x in query:
        if x not in output:
            output.append(x)
    print(output)
    return jsonify(output)


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