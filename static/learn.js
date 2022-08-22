$( document ).ready(function() {
    // set prev button
	if (curr_page == 1) {
		disable_prev();
	} else {
		activate_prev_btn_onclick();
	}
	// set next button
	if (curr_page == db_size) {
		change_next_btn_to_quiz()
	} else {
		activate_next_btn_onclick();
	}
});

let hours = 0;
let minutes = 0
let seconds = 0;
function updateTimer() {
	seconds = seconds + 1
	if (seconds == 60) {
		minutes += 1
		seconds = 0;
	}
	if (minutes == 60){
		hours += 1;
		minutes = 0;
	}
	let seconds_formatted = (seconds).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
	let minutes_formatted = (minutes).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
	let hours_formatted = (hours).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
	$('#timer').text(`${hours_formatted}:${minutes_formatted}:${seconds_formatted}`);
	setTimeout(updateTimer, 1000);
}

function activate_prev_btn_onclick(){
	console.log("activate_prev_btn_onclick");
	$('#prev_btn').attr("onclick",`location.href='/learn/${curr_page-1}'; send_timestamp_to_backend()`);
}

function activate_next_btn_onclick(){
	console.log("activate_next_btn_onclick");
	$('#next_btn').attr("onclick",`location.href='/learn/${curr_page+1}'; send_timestamp_to_backend()`);
}

function disable_prev(){
	console.log("disable_prev");
	$('#prev_btn').hide();
}

function change_next_btn_to_quiz() {
	console.log("change_next_btn_to_quiz");
	$('#next_btn').attr("onclick",`location.href='/quiz/1'; send_timestamp_to_backend()`);
	$('#next_btn').html("Start Quiz!");
	$('#next_btn').addClass("quiz_start_btn");
}

function send_timestamp_to_backend() {
    let timestamp_data = {
		"id": content["id"],
		"timestamp": timer,
	}         
	console.log(timer);

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
