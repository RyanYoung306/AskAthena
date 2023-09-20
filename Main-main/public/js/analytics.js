async function getPos(){
  const value = await fetch(window.location.origin + '/userPositive');
  const data = await value.json();
  const globalScore = data[0]['count(*)'];
  // console.log(globalScore);
  return globalScore;
}

async function getNeg(){
  const value = await fetch(window.location.origin + '/userNegative');
  const data = await value.json();
  const globalScore = data[0]['count(*)'];
  // console.log(globalScore);
  return globalScore;
}


// Load google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

// Draw the chart and set the chart values
async function drawChart() {

  const PosScore= await getPos();
  const NegScore= await getNeg();
  let QAnswered = NegScore + PosScore
  const OverallScore=PosScore - NegScore;
  var data = google.visualization.arrayToDataTable([
  ['Task', 'User feed back'],
  ['Positive', PosScore],
  ['Negative', NegScore],
]);

  // Optional; add a title and set the width and height of the chart
  var options = {
    legend:'right',
    title:"response Satisfaction rate " + "\n Queries answered: " + QAnswered + "\n Positive: " + PosScore + "\n Negative: " + NegScore + "\n Overall score: " + OverallScore,
    width:600,
    height:600,
    backgroundColor:'transparent',
    pieStartAngle: 100,
    is3D: true,
    colors:['#00FF00','#FF0000'],
    chartArea: {
      left:10,
      bottom:30
    },
    titleTextStyle: {
      color: 'white',
      fontSize: 15,
      bold: true
    },
  };

  // Display the chart inside the <div> element with id="piechart"
  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chart.draw(data, options);
}


