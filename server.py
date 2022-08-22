import json
import copy
from multiprocessing.sharedctypes import Value
from flask import Flask
from flask import render_template, redirect, url_for, make_response
from flask import Response, request, jsonify

learn_content_db = {
    "1": {
		"id": "1",
		"sign_name": "North",
		"image": "/static/assets/north.png",
		"video": "https://www.signingsavvy.com/media/mp4-ld/8/8805.mp4",
		"text": ""
	},
    "2": {
		"id": "2",
		"sign_name": "South",
		"image": "/static/assets/south.png",
		"video": "https://www.signingsavvy.com/media/mp4-ld/30/30700.mp4",
		"text": ""
	},
    "3": {
		"id": "3",
		"sign_name": "East",
		"image": "/static/assets/east.png",
		"video": "https://www.signingsavvy.com/media/mp4-ld/6/6863.mp4",
		"text": ""
	},
    "4": {
		"id": "4",
		"sign_name": "West",
		"image": "/static/assets/west.png",
		"video": "https://www.signingsavvy.com/media/mp4-ld/29/29597.mp4",
		"text": ""
	},
    "5": {
		"id": "5",
		"sign_name": "Left",
		"image": "/static/assets/left.png",
		"video": "https://www.signingsavvy.com/media/mp4-ld/22/22625.mp4",
		"text": ""
	},
    "6": {
		"id": "6",
		"sign_name": "Right",
		"image": "/static/assets/right.png",
		"video": "https://www.signingsavvy.com/media/mp4-ld/22/22624.mp4",
		"text": ""
	},
    "7": {
		"id": "7",
		"sign_name": "Straight",
		"image": "/static/assets/straight.png",
		"video": "https://www.signingsavvy.com/media/mp4-ld/22/22392.mp4",
		"text": ""
	},
    "8": {
		"id": "8",
		"sign_name": "Turn",
		"image": "/static/assets/turn.png",
		"video": "https://www.signingsavvy.com/media/mp4-ld/22/22400.mp4",
		"text": "The sign for turn has multiple variations."
	},
    "9": {
		"id": "9",
		"sign_name": "Forward",
		"image": "/static/assets/forward.png",
		"video": "https://www.signingsavvy.com/media/mp4-ld/30/30456.mp4",
		"text": ""
	},
    "10": {
		"id": "10",
		"sign_name": "Back",
		"image": "/static/assets/back.png",
		"video": "https://www.signingsavvy.com/media/mp4-ld/29/29150.mp4",
		"text": ""
	},
    "11": {
		"id": "11",
		"sign_name": "Cross Street/Intersection",
		"image": "/static/assets/intersection.png",
		"video": "https://www.signingsavvy.com/media/mp4-ld/28/28272.mp4",
		"text": ""
	},
    "12": {
		"id": "12",
		"sign_name": "Walk",
		"image": "/static/assets/walk.png",
		"video": "https://www.signingsavvy.com/media/mp4-ld/23/23052.mp4",
		"text": "The sign for walk has multiple variations."
	},
    "13": {
		"id": "13",
		"sign_name": "Before",
		"image": "/static/assets/before.png",
		"video": "https://www.signingsavvy.com/media/mp4-ld/28/28590.mp4",
		"text": "The sign for before has multiple variations."
	}
}

quiz_content_db = {
    "1": {
		"id": "1",
		"question": "What does the following sign mean?",
		"media": "/static/assets/intersection.png",
		"type": "choice_one", # ["choice_one", "choice_many", "drag_and_drop"]
		"options": [
      		{
				"id": "1",
				"media": "",
				"text": "Cross Street/intersection",
			},{
				"id": "2",
				"media": "",
				"text": "West",
			},{
				"id": "3",
				"media": "",
				"text": "Before",
			},{
				"id": "4",
				"media": "",
				"text": "Right",
			}
		],
		"answer": "1"
	},
    "2": {
		"id": "2",
		"question": "What does the following sign mean?",
		"media": "/static/assets/turn.png",
		"type": "choice_one",
		"options": [
			{
				"id": "1",
				"media": "",
				"text": "Cross Street/intersection",
			},{
				"id": "2",
				"media": "",
				"text": "Turn",
			},{
				"id": "3",
				"media": "",
				"text": "North",
			},{
				"id": "4",
				"media": "",
				"text": "Right",
			}
		],
		"answer": "2"
	},
    "3": {
		"id": "3",
		"question": "What does the following sign mean?",
		"media": "/static/assets/south.png",
		"type": "choice_one",
		"options": [
			{
				"id": "1",
				"media": "",
				"text": "North",
			},{
				"id": "2",
				"media": "",
				"text": "West",
			},{
				"id": "3",
				"media": "",
				"text": "South",
			},{
				"id": "4",
				"media": "",
				"text": "Before",
			}
		],
		"answer": "3"
	},
    "4": {
		"id": "4",
		"question": "What does the following sign mean?",
		"media": "/static/assets/straight.png",
		"type": "choice_one",
		"options": [
			{
				"id": "1",
				"media": "",
				"text": "Straight",
			},{
				"id": "2",
				"media": "",
				"text": "West",
			},{
				"id": "3",
				"media": "",
				"text": "Before",
			},{
				"id": "4",
				"media": "",
				"text": "North",
			}
		],
		"answer": "1"
	},
    "5": {
		"id": "5",
		"question": "What does the following sign mean?",
		"media": "/static/assets/north.png",
		"type": "choice_one",
		"options": [
			{
				"id": "1",
				"media": "",
				"text": "South",
			},{
				"id": "2",
				"media": "",
				"text": "West",
			},{
				"id": "3",
				"media": "",
				"text": "North",
			},{
				"id": "4",
				"media": "",
				"text": "Right",
			}
		],
		"answer": "3"
	},
    "6": {
		"id": "6",
		"question": "How to do the sign for walk straight?",
		"media": "",
		"type": "drag",
		"options": [
			{
				"id": "1",
				"media": "/static/assets/left.png",
				"text": "",
			},{
				"id": "2",
				"media": "/static/assets/straight.png",
				"text": "",
			},{
				"id": "3",
				"media": "/static/assets/walk.png",
				"text": "",
			},{
				"id": "4",
				"media": "/static/assets/right.png",
				"text": "",
			}
		],
		"answer": ["3", "2"] # array join in JS or change this to array backend
	},
    "7": {
		"id": "7",
		"question": "How to give direction to turn right at the intersection?",
		"media": "",
		"type": "drag",
		"options": [
			{
				"id": "1",
				"media": "/static/assets/intersection.png",
				"text": "",
			},{
				"id": "2",
				"media": "/static/assets/turn.png",
				"text": "",
			},{
				"id": "3",
				"media": "/static/assets/left.png",
				"text": "",
			},{
				"id": "4",
				"media": "/static/assets/right.png",
				"text": "",
			}
		],
		"answer": ["2","4","1"] # array join in JS or change this to array backend
	},
    "8": {
		"id": "8",
		"question": "How to get from Columbia’s 116th & Broadway entrance to Lululemon?",
		"media": "/static/assets/q8_map.png",
		"type": "drag",
		"options": [
			{
				"id": "1",
				"media": "/static/assets/intersection.png",
				"text": "",
			},{
				"id": "2",
				"media": "/static/assets/turn.png",
				"text": "",
			},{
				"id": "3",
				"media": "/static/assets/left.png",
				"text": "",
			},{
				"id": "4",
				"media": "/static/assets/north.png",
				"text": "",
			}
		],
		"answer": ["1", "2", "3"] # array join in JS or change this to array backend
	},
    "9": {
		"id": "9",
		"question": "How to get from the Flatiron Building to the National Museum of Mathematics?",
		"media": "/static/assets/q9_map.png",
		"type": "drag",
		"options": [
			{
				"id": "1",
				"media": "/static/assets/walk.png",
				"text": "",
			},{
				"id": "2",
				"media": "/static/assets/turn.png",
				"text": "",
			},{
				"id": "3",
				"media": "/static/assets/right.png",
				"text": "",
			},{
				"id": "4",
				"media": "/static/assets/north.png",
				"text": "",
			}
		],
		"answer": ["1", "4", "2", "3"] # array join in JS or change this to array backend
	},
    "10": {
		"id": "10",
		"question": "How to get from White Horse Tavern to Dante’s?",
		"media": "/static/assets/q10_map.png",
		"type": "drag",
		"options": [
			{
				"id": "1",
				"media": "/static/assets/intersection.png",
				"text": "",
			},{
				"id": "2",
				"media": "/static/assets/walk.png",
				"text": "",
			},{
				"id": "3",
				"media": "/static/assets/left.png",
				"text": "",
			},{
				"id": "4",
				"media": "/static/assets/south.png",
				"text": "",
			}
		],
		"answer": ["2", "4"] # array join in JS or change this to array backend
	}
}

# Keep track of user answers and update scores
reset_user_quiz_activity = {
    "1": {
		"options": [
		],
		"score": 0,
		"timestamp": ""
	},
    "2": {
		"options": [
		],
		"score": 0,
		"timestamp": ""
	},
    "3": {
		"options": [
		],
		"score": 0,
		"timestamp": ""
	},
    "4": {
		"options": [
		],
		"score": 0,
		"timestamp": ""
	},
    "5": {
		"options": [
		],
		"score": 0,
		"timestamp": ""
	},
    "6": {
		"options": [
		],
		"timestamp": "",
		"score": 0
	},
    "7": {
		"options": [
		],
		"timestamp": "",
		"score": 0
	},
    "8": {
		"options": [
		],
		"timestamp": "",
		"score": 0
	},
    "9": {
		"options": [
		],
		"timestamp": "",
		"score": 0
	},
    "10": {
		"options": [
		],
		"timestamp": "",
		"score": 0
	}
}

user_quiz_activity = {
    "1": {
		"options": [
		],
		"score": 0,
		"timestamp": ""
	},
    "2": {
		"options": [
		],
		"score": 0,
		"timestamp": ""
	},
    "3": {
		"options": [
		],
		"score": 0,
		"timestamp": ""
	},
    "4": {
		"options": [
		],
		"score": 0,
		"timestamp": ""
	},
    "5": {
		"options": [
		],
		"score": 0,
		"timestamp": ""
	},
    "6": {
		"options": [
		],
		"timestamp": "",
		"score": 0
	},
    "7": {
		"options": [
		],
		"timestamp": "",
		"score": 0
	},
    "8": {
		"options": [
		],
		"timestamp": "",
		"score": 0
	},
    "9": {
		"options": [
		],
		"timestamp": "",
		"score": 0
	},
    "10": {
		"options": [
		],
		"timestamp": "",
		"score": 0
	}
}

# Keep track of user activites on learning page

user_learning_activity = {
    "1": {
		"timestamp": ""
	},
    "2": {
		"timestamp": ""
	},
    "3": {
		"timestamp": ""
	},
    "4": {
		"timestamp": ""
	},
    "5": {
		"timestamp": ""
	},
    "6": {
		"timestamp": ""
	},
    "7": {
		"timestamp": ""
	},
    "8": {
		"timestamp": ""
	},
    "9": {
		"timestamp": ""
	},
    "10": {
		"timestamp": ""
	},
    "11": {
		"timestamp": ""
	},
    "12": {
		"timestamp": ""
	},
    "13": {
		"timestamp": ""
	}
}

app = Flask(__name__)

@app.route('/')
def home():
	return render_template('home.html')

@app.route('/learn/<learn_page>')
def learn(learn_page = 1):
	content = learn_content_db[learn_page]
	db_size = len(learn_content_db) #used to calculate when next button should go to quiz
	return render_template('learn.html', content = content, db_size = db_size)

@app.route('/update_timestamp', methods = ['POST'])
def update_timestamp():
	global user_learning_activity
	
	json_data = request.get_json()
	print("updating timestamp")
	print(json_data)
	id = json_data['id']
	new_time = json_data['timestamp']
	user_learning_activity[id]["timestamp"] = new_time
	print(user_learning_activity[id])
	response = jsonify(success=True)
	return response

@app.route('/record_answer', methods = ['POST'])
def record_answer():
	global user_quiz_activity
	
	json_data = request.get_json()
	print("updating timestamp")
	print(json_data)
	id = json_data['id']
	new_time = json_data['timestamp']
	user_quiz_activity[id]["timestamp"] = new_time
	new_options = json_data['options']
	if quiz_content_db[id]["type"] == "choice_one":
		options_id = json_data['options_id']
		user_quiz_activity[id]["options"] = new_options
		if quiz_content_db[id]["answer"] == options_id:
			user_quiz_activity[id]["score"] = 1
		else:
			user_quiz_activity[id]["score"] = 0
	elif quiz_content_db[id]["type"] == "drag":
		try:
			while True:
				new_options.remove('-1')
		except ValueError:
			pass
		user_quiz_activity[id]["options"] = new_options
		#print(new_options)
		#print(quiz_content_db[id]["answer"])
		if quiz_content_db[id]["answer"] == new_options:
			user_quiz_activity[id]["score"] = 1
		else:
			user_quiz_activity[id]["score"] = 0
	response = jsonify(success=True)
	print(user_quiz_activity)
	return response

@app.route('/quiz/reset')
@app.route('/quiz/reset/<redirect_t>')
def quiz_reset(redirect_t = "quiz"):
    global user_quiz_activity
    
    user_quiz_activity = copy.deepcopy(reset_user_quiz_activity)
    return redirect("/" if redirect_t == "home" else "/quiz/1")
    
@app.route('/quiz/<question_num>')
def quiz(question_num = 1):
	content = quiz_content_db[question_num]
	db_size = len(quiz_content_db)
	return render_template('quiz.html', content = content, db_size = db_size, user_activiy = user_quiz_activity[question_num])

@app.route('/quiz_response/<question_num>', methods=['POST'])
def quiz_response(question_num = 1):
    # similar logic
    json_data = request.get_json()
    user_quiz_activity[question_num]["options"] = json_data["options"]
    return jsonify(result = "success")

@app.route('/result')
def result():
    total_score = len(list(user_quiz_activity.keys()))
    correct = 0
    for idx in user_quiz_activity:
        if user_quiz_activity[idx]["score"] == 1:
            correct += 1
    return render_template('result.html', total_score = total_score, correct = correct)

if __name__ == '__main__':
   app.run(debug = True)