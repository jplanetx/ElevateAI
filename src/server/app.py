from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from notion_client import Client

app = Flask(__name__)
CORS(app)
load_dotenv()

notion = Client(auth=os.getenv('NOTION_API_KEY'))
database_id = os.getenv('NOTION_DATABASE_ID')

@app.route('/api/notion/tasks', methods=['GET'])
def get_tasks():
    try:
        response = notion.databases.query(database_id=database_id)
        return jsonify(response['results'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)