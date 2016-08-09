document.body.style.backgroundColor = "pink";

var currentDate = new Date();
var j = 0;
var numclicks = 0;
var articlesPerPage = 10;
var dataSet;
var loaded = 0;

function dateDiff(articleDate, currentDate) {
  var t1 = new Date(articleDate).getTime();
  var t2 = currentDate.getTime();

  var days = parseInt((t2-t1)/(24*3600*1000));
  var hours = parseInt((t2-t1)/(3600*1000)%24);
  var minutes = parseInt((t2-t1)/(60*1000)%60);

  var difference = days + ' days ' + hours + ' hours and ' + minutes + ' minutes ago';
  return difference;
}

function showData(data) {
  for (var i = numclicks * articlesPerPage; i < articlesPerPage * (numclicks + 1); i++) {
    var table = document.getElementById('articles');

    var row = table.insertRow(-1);

    // Insert new cells (<td> elements) at the "new" <tr> element:
    var title = row.insertCell(0);
    var name = row.insertCell(1);
    var words = row.insertCell(2);
    var submitted = row.insertCell(3);

    // Add some text to the new cells:
    title.innerHTML = data[i].title;
    name.innerHTML = data[i].profile.first_name + ' ' + data[i].profile.last_name;
    words.innerHTML = data[i].words;
    submitted.innerHTML = dateDiff(data[i].publish_at, currentDate);
    // console.log(i);
  };
}

var request = new XMLHttpRequest();

request.open('GET', 'http://localhost:3000/data/articles.json', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    
    var data = JSON.parse(request.responseText);
    dataSet = data;
    showData(data);
    
  } else {
    // We reached our target server, but it returned an error

  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send(); 


function loadMore() {

  numclicks += 1;

  if (numclicks * 10 >= dataSet.length && loaded == 1) {
    document.getElementById('noMoreData').innerHTML = "No more articles to load.";
  }
  
  else if (numclicks * 10 >= dataSet.length && loaded == 0) {
    loaded = 1;

    var request = new XMLHttpRequest();

    request.open('GET', 'http://localhost:3000/data/more-articles.json', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        dataSet = dataSet.concat(data);
        showData(dataSet);
      } else {
        // We reached our target server, but it returned an error
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
    };

    request.send();
  }

  else {
    showData(dataSet);
  }
}
