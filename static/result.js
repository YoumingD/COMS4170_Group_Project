google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Task', 'score'],
        ['correct', correct],
        ['wrong', wrong]
    ]);
    document.getElementById("correct_answers").innerHTML += " " + correct
    document.getElementById("wrong_answers").innerHTML +=" " + wrong
    var options = {
        'width':400,
        'height':400,
        slices: {
            0: { color: 'green' },
            1: { color: 'red' }
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
}
