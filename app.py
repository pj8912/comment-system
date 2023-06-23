from flask import Flask, render_template, request, jsonify
import json
import mysql.connector
import os 
from dotenv import load_dotenv

app = Flask(__name__)

app.secret_key = "SECRET"

load_dotenv()

HOST = os.environ.get("DB_HOST")
USERNAME = os.environ.get("DB_USERNAME")
PWD = os.environ.get("DB_PWD")
DBNAME = os.environ.get("DB_NAME")


cnx = mysql.connector.connect(user=USERNAME, password=PWD, host=HOST, database=DBNAME)
cursor = cnx.cursor()


app.use_static_route = True


from datetime import date
today = date.today()
day = today.day
month_word = today.strftime("%B")
year = today.year
#today's date
todays_date = str(day)+' '+month_word+' '+str(year)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload/post', methods=['POST'])
def upload_post():
    new_data =  request.json['post_data'] 
    sql = "INSERT INTO posts(post_data, created_date, parent_post_id) VALUES(%s, %s, NULL)"
    cursor.execute(sql,(new_data,todays_date))
    cnx.commit()
    if cursor.rowcount > 0:
        return jsonify({"status":1})
    else:
        return jsonify({"status" : 0,"message":"failed!"})
    

@app.route('/allcomments')
def get_all_comments():
    sql = "SELECT * FROM posts ORDER BY created_at DESC"
    cursor.execute(sql)
    results = cursor.fetchall()
    postsArray = []
    if results:
        for row in results:
            postObj = {
                'post' : row[1]
            }
            postsArray.append(postObj)
        return jsonify({"status":1 ,"posts":postsArray})
    else:
        return jsonify({"status" : 0,"message":"failed!"})

if __name__ == "__main__":
    app.run(debug=True, port=1500)
