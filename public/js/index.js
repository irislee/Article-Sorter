document.body.style.backgroundColor = "pink";

var currentDate = new Date();
var numClicks = 0;
var articlesPerPage = 10;
var dataSet;
var loaded = 0;
var table = document.getElementById('articles');

function dateDiff(articleDate, currentDate) {
  var t1 = new Date(articleDate).getTime();
  var t2 = currentDate.getTime();
  var diff = t2-t1;
  var daysMs = (24*3600*1000);
  var hoursMs = (3600*1000);
  var minutesMs = (60*1000);

  var days = parseInt((diff/daysMs), 10);
  var hours = parseInt((diff/hoursMs % 24), 10);
  var minutes = parseInt((diff/minutesMs % 60), 10);

  var difference = days + ' days ' + hours + ' hours and ' + minutes + ' minutes ago';
  return difference;
}

function showData(data) {
  for (var i = numClicks * articlesPerPage; i < articlesPerPage * (numClicks + 1); i++) {
    var row = table.insertRow(-1);

    // Insert new cells (<td> elements) at the "new" <tr> element:
    var title = row.insertCell(0);
    var name = row.insertCell(1);
    var words = row.insertCell(2);
    var submitted = row.insertCell(3);

    // Add text to new cells:
    title.innerHTML = data[i].title;
    name.innerHTML = data[i].profile.first_name + ' ' + data[i].profile.last_name;
    words.innerHTML = data[i].words;
    submitted.innerHTML = dateDiff(data[i].publish_at, currentDate);
  };
}

var request = new XMLHttpRequest();

request.open('GET', 'http://localhost:3000/data/articles.json', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {

    dataSet = JSON.parse(request.responseText);
    showData(dataSet);
    
  } else {
    // We reached our target server, but it returned an error

  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send(); 


function loadMore() {

  numClicks += 1;

  if (numClicks * 10 >= dataSet.length && loaded == 1) {
    document.getElementById('noMoreData').innerHTML = "No more articles to load.";
  }
  
  else if (numClicks * 10 >= dataSet.length && loaded == 0) {
    loaded = 1;
    var xmlhttp = new XMLHttpRequest();
    var url = 'http://localhost:3000/data/more-articles.json';

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var data2 = JSON.parse(xmlhttp.responseText);
        dataSet = dataSet.concat(data2);
        showData(dataSet);
      }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
  }

  else {
    showData(dataSet);
  }
}

var sortByWordsCicks = 0;

function sortByWords(){
  sortByWordsCicks += 1;

  if (sortByWordsCicks % 2 == 0) {
    dataSet.sort(function(a, b) {
      return a.words - b.words;
    });
  }

  else {
    dataSet.sort(function(a, b) {
      return b.words - a.words;
    });
  }
  
  while(table.rows.length > 1) {
    table.deleteRow(1);
  }

  showData(dataSet);
}
