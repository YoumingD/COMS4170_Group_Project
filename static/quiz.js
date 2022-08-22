$( document ).ready(function() {
    // set prev button
	if (curr_page == 1) {
		disable_prev();
	} else {
		activate_prev_btn_onclick();
	}
	// set next button
	if (curr_page == db_size) {
		change_next_btn_to_finish()
	} else {
		activate_next_btn_onclick();
	}
	
	// set question buttons
	if (content["type"] == "choice_one") {
		// create multiple choice
		createMultipleChoiceOptions(content["options"]);
	} else if (content["type"] == "drag") {
		resizeLayoutForDragDrop();
		// create drag and drop
		createDropOptions(content["options"]);
		createDragOptions(content["options"]);
	} else {
		// create more than one choice
	}

});

function showCorrectFeedback(){
	$("#result_feedback").empty();
	$("#result_feedback").append("<span>Correct!</span>");
	$("#result_feedback").css("color", "green");
	if (content["type"] === "drag" && content["media"]){
		$("#result_feedback").css("float", "left");
		$("#result_feedback").addClass("ml-5");
	}
};

function showIncorrectFeedback(){
	$("#result_feedback").empty();
	$("#result_feedback").append("<span id='answerFeedback' class='answerFeedback'>Incorrect</span>");
	$("#result_feedback").css("color", "red");
	if (content["type"] === "drag"){
		let corrAnsRowDiv = document.createElement('div');
		corrAnsRowDiv.setAttribute("class", "row justify-content-center");
		let answerFeedback = document.getElementById("answerFeedback");
		let correcFeedback = document.createElement('pre');
		correcFeedback.setAttribute("class", "greenC");
		answerFeedback.appendChild(correcFeedback);
		correcFeedback.innerHTML = "Correct Answer Below!";
		for(let idx = 0; idx < content["answer"].length; idx++) {
			let fieldset = document.createElement('fieldset');
			fieldset.setAttribute("class", "field_s");
			let legend = document.createElement('legend');
			legend.setAttribute("class", "legend_s");
			legend.innerHTML = (idx + 1).toString();
			fieldset.appendChild(legend);
			let corrAnsColDiv = document.createElement('div');
			corrAnsRowDiv.appendChild(corrAnsColDiv);
			corrAnsColDiv.setAttribute("class", "col");
			let opIdx = content["answer"][idx];
			let img = document.createElement('img');
			img.setAttribute("class", "fit_ans")
			img.src = content["options"][opIdx - 1]["media"];
			fieldset.appendChild(img);
			corrAnsColDiv.appendChild(fieldset);
		}
		let resFeed = document.getElementById("result_feedback");
		resFeed.appendChild(corrAnsRowDiv);
		let mapImg = document.getElementById("sign_image");
		if(mapImg) {
			mapImg.setAttribute("class", "map img-fluid red_img");
		}
	}
};


function checkMultipleChoiceAnswers(button){
	let correctAnswer = content['answer'];
	let userChoice = $(button).attr("data-id");
	if (userChoice == correctAnswer) {
		showCorrectFeedback();
	} else {
		showIncorrectFeedback();
	}
	$(`#button_${correctAnswer}`).css("border-color", "green");
	$(`#button_${correctAnswer}`).css("border-width", "thick");
	$(`#button_${correctAnswer}`).css("background-color", "green");
}

function createMultipleChoiceOptions(optionsList) {
	let questionDiv = document.getElementById("ques_int_wrapper");
	for (option of optionsList) {
		let newDiv = document.createElement('div');
		newDiv.setAttribute("class", "col-3 pt-4 pb-4")
		let btn = document.createElement("button");
		btn.innerHTML = option["text"];
		btn.setAttribute("data-id", option["id"])
		btn.setAttribute("id", `button_${option["id"]}`);
		btn.setAttribute("onclick",`checkMultipleChoiceAnswers(this); record_answer_to_backend(this)`);
		btn.setAttribute("class","col text-center btn btn-primary");
		newDiv.appendChild(btn);
		questionDiv.appendChild(newDiv);
	}
}

function resizeLayoutForDragDrop(){
	$("#top_question_row").addClass("h-50");
	if (content["media"]) {
		$("#top_col").addClass("change_top_col");
		$("#top_row").addClass("change_top_row");
		$(".main_border").addClass("change_main_border");
		$(".map").addClass("change_map_height");
		$(".map_div").addClass("change_map_div");
		$("#top_container").addClass("change_top_container_height");
		$("#ques_int_wrapper").removeClass("m-1");
		$("#ques_int_wrapper").addClass("change_ques_wrapper_height");
		$(".head_container").addClass("lower_height");
	}
}

function createDropOptions(optionsList) {

	let questionDiv = document.getElementById("ques_int_wrapper");
	// questionDiv.innerHTML += "Drag sign here in correct order, limited to four moves";
	//drag_place

	let dropPlace = document.createElement('div');
	dropPlace.setAttribute("class", "col-12  drop_options_div row center");
	questionDiv.appendChild(dropPlace);
	numberOfAnswers = content['answer'].length;
	for(var itr = 1; itr < numberOfAnswers+1; itr++) {
		let dropOptions = document.createElement('div');
		let optionsIdx = itr.toString();
		dropOptions.setAttribute("id", "uanswers_" + optionsIdx);
		dropPlace.appendChild(dropOptions);

		if(drag_options[itr.toString()] != "-1") {
			dropOptions.setAttribute("class", "margin_check_lr dop col");
			let newDiv = document.createElement('div');
			newDiv.setAttribute("class", "drag_options");
			let opIdx = drag_options[itr.toString()];
			newDiv.setAttribute("data-value", optionsList[opIdx - 1]["id"])
			let img = document.createElement('img');
			img.setAttribute("class", "fit")
			img.src = optionsList[opIdx - 1]["media"];
			newDiv.appendChild(img);
			dropOptions.appendChild(newDiv);
		} else {
			dropOptions.setAttribute("class", "drag_place margin_lr dop col center top_bottom_padding options_margin");
			let backText = document.createElement('p');
			backText.innerHTML = "Drop Here";
			backText.setAttribute("class", "watermark");
			dropOptions.appendChild(backText);
		}
	}

	$( ".drag_place" ).droppable({
        accept: ".drag_options",
		activeClass: "highop",
        drop: function( _, ui ) {
			
			$(this).html("");
			let idx = $(this).attr('id').split("_")[1];
            let val = ui.draggable.data().value;
			let classes = $(this).attr('class').split(" ");
			let cidx = classes.indexOf("drag_place");
			classes.splice(cidx, 1);
			$(this).attr("class", classes.join(" "));
			
			for(key in drag_options) {
				if(drag_options[key] == val) {
					drag_options[key] = "-1";
					document.getElementById("ques_int_wrapper").innerHTML = "";
					drag_options[idx] = val.toString();
					createDropOptions(optionsList);
					createDragOptions(optionsList);
					break;
				}
			}
			
			drag_options[idx] = val.toString();
			document.getElementById("ques_int_wrapper").innerHTML = "";
			createDropOptions(optionsList);
			createDragOptions(optionsList);
			// for(let itr = 1; itr < 5; itr++) {
			// 	if(drag_options[itr.toString()] == "-1") return
			// }
			record_answer_to_backend(this, "drag");
			// if(curr_page == 10) {
			// 	location.href='/result';
			// }
			// else {
			// 	location.href=`/quiz/${curr_page+1}`
			// }
        }
    });
}


function checkDragDropAnswers(){
	let userChoice = [];
	let correctAnswer = content['answer']
	let numberOfAnswers = content['answer'].length
	for(var idx = 1; idx < numberOfAnswers + 1; idx++) {
		userChoice.push(drag_options[idx.toString()]);
	}
	if (userChoice.toString() == correctAnswer.toString()) {
		showCorrectFeedback();
	} else {
		showIncorrectFeedback();
	}

};

function resetDragDrop(){
	drag_options = {
        "1": "-1",
        "2": "-1",
        "3": "-1",
        "4": "-1"
    };
	document.getElementById("ques_int_wrapper").innerHTML = "";
	createDropOptions(content["options"]);
	createDragOptions(content["options"]);
};

function createDragOptions(optionsList) {

	let questionDiv = document.getElementById("ques_int_wrapper");
	// questionDiv.innerHTML += "Drag sign here in correct order, limited to four moves";
	//drag_place
	
	let newSubmitResetDiv = document.createElement('div');
	newSubmitResetDiv.setAttribute("id", "submit_reset_div col-3 center");
	questionDiv.appendChild(newSubmitResetDiv);
	
	let dragOptions = document.createElement('div');
	dragOptions.setAttribute("class", "drag_options_div p-0 col-8 ml-5 center");
	questionDiv.appendChild(dragOptions);

	let submitButton = document.createElement('button');
	submitButton.innerHTML = "Submit";
	submitButton.setAttribute("id", "submitBtn");
	submitButton.setAttribute("class", "col text-center btn btn-primary dragBtns");
	submitButton.setAttribute("onclick",`checkDragDropAnswers(); record_answer_to_backend(this, "drag")`);

	let resetButton = document.createElement('button');
	resetButton.innerHTML = "Reset";
	resetButton.setAttribute("class", "col text-center btn mt-1 btn-primary dragBtns");
	resetButton.setAttribute("onclick",`resetDragDrop();`);

	newSubmitResetDiv.appendChild(submitButton);
	newSubmitResetDiv.appendChild(resetButton);
	
	for (option of optionsList) {
		let present = false;
		for(idx in drag_options) {
			if(drag_options[idx] == option["id"]) {
				present = true;
				break;
			}
		}
		if(present) continue;
		let newDiv = document.createElement('div');
		newDiv.setAttribute("class", "drag_options margin_2");
		newDiv.setAttribute("data-value", option["id"])
		let img = document.createElement('img');
		img.setAttribute("class", "dop")
		img.src = option["media"];
		newDiv.appendChild(img);
		dragOptions.appendChild(newDiv);
	} 
 
	$( ".drag_options" ).draggable({ 
        revert: "invalid",
        stack: ".drag_options"
    });

	$( ".drag_options_div" ).droppable({
        accept: ".drag_options",
		activeClass: "lowop",
        drop: function( _, ui ) {
            let val = ui.draggable.data().value;
			for(key in drag_options) {
				if(drag_options[key] == val) {
					drag_options[key] = "-1";
					document.getElementById("ques_int_wrapper").innerHTML = "";
					createDropOptions(optionsList);
					createDragOptions(optionsList);
				}
			}
			record_answer_to_backend(this, "drag");
		}
    });
}

let timer = 0;
function updateTimer() {
	timer = timer + 1;
	$('#timer').text(timer)
	setTimeout(updateTimer, 1000);
}

function activate_prev_btn_onclick(){
	$('#prev_btn').attr("onclick",`location.href='/quiz/${curr_page-1}'; send_timestamp_to_backend()`);
}

function activate_next_btn_onclick(){
	$('#next_btn').attr("onclick",`location.href='/quiz/${curr_page+1}'; send_timestamp_to_backend()`);
}

function disable_prev(){
	$('#prev_btn').hide();
}

function change_next_btn_to_finish() {
	$('#next_btn').attr("onclick",`location.href='/result'; send_timestamp_to_backend()`);
	$('#next_btn').html("Finish Quiz");
	$('#next_btn').addClass("quiz_end_btn");
}

function record_answer_to_backend(button, type = "choice_one") {
	let timestamp_data = {}
	if(type == "choice_one") {
		timestamp_data = {
			"id": content["id"],
			"options_id": $( button ).attr("data-id"),
			"options": [button.innerHTML],
			"timestamp": timer,
		}    
	} else if(type == "drag") {
		let q_options = [];
		for(var idx = 1; idx < content["options"].length + 1; idx++) {
			q_options.push(drag_options[idx.toString()]);
		}
		timestamp_data = {
			"id": content["id"],
			"options": q_options,
			"timestamp": timer,
		}
	}

    $.ajax({
        type: "POST",
        url: "/record_answer",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(timestamp_data),
        success: function(result){
			console.log('ajax call successful')
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

function send_timestamp_to_backend() {
    let timestamp_data = {
		"id": content["id"],
		"timestamp": timer,
	}         
    $.ajax({
        type: "POST",
        url: "/update_timestamp",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(timestamp_data),
        success: function(result){
			console.log('ajax call successful')
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

updateTimer();
