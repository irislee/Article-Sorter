document.body.style.backgroundColor = "pink";

var currentDate = new Date();
var numClicks = 0;
var articlesPerLoad = 10;
var dataSet;
var loaded = false;
var table = document.getElementById('articles');

var request = new XMLHttpRequest();

request.open('GET', 'http://localhost:3000/data/articles.json', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {

    dataSet = JSON.parse(request.responseText);
    showData();
    
  } else {
    // We reached our target server, but it returned an error
  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send(); 

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

function showData() {

  // for (var i = numClicks * articlesPerLoad; i < articlesPerLoad * (numClicks + 1); i++) {
  for (var i = numClicks*articlesPerLoad; i < articlesPerLoad * (numClicks + 1); i++) {
    var row = table.insertRow(-1);

    // Insert new cells (<td> elements) at the "new" <tr> element:
    var title = row.insertCell(0);
    var name = row.insertCell(1);
    var words = row.insertCell(2);
    var submitted = row.insertCell(3);

    console.log(numClicks);

    // Add text to new cells:
    title.innerHTML = dataSet[i].title;
    name.innerHTML = dataSet[i].profile.first_name + ' ' + dataSet[i].profile.last_name;
    words.innerHTML = dataSet[i].words;
    submitted.innerHTML = dateDiff(dataSet[i].publish_at, currentDate);
  };
}

var numOnPage = document.getElementById('articles').rows.length;



function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      if (req.status == 200) {
        var data = JSON.parse(req.responseText);
        resolve(data); 
      }
      else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    };

    req.send();
  });
}

function loadData(doMyThing) {

  get('http://localhost:3000/data/more-articles.json').then(function(response) {
    loaded = true;
    return dataSet = dataSet.concat(response);
  }).then(function() {
    doMyThing();
  });

}

function loadMore() {

  numClicks += 1;
  console.log(numClicks);
  console.log(loaded);
  if ((numClicks) * articlesPerLoad >= dataSet.length && loaded == true) {
    document.getElementById('noMoreData').innerHTML = "No more articles to load.";
  }
  
  else if (numClicks * articlesPerLoad >= dataSet.length && loaded == false) { 
    loadData(showData);
    console.log('why are you elseifing');
    //showData();
  }

  else {
    showData();
    console.log('data length' + dataSet.length);
  }
}

var sortByWordsClicks = 0;
var sortByTimeClicks = 0;

function clearTableRows() {
  while(table.rows.length > 1) {
    table.deleteRow(1);
  }
}

function loadSorted () {
  var artOnPage = numClicks;
  numClicks = 0; 
  for (var i = 0; i <= artOnPage; i++) {
    showData();
    numClicks += 1;
  };
  numClicks = artOnPage;
}

function sortWordsAZ () {
  dataSet.sort(function(a, b) {
    return a.words - b.words;
  });

  loadSorted();
}

function sortWordsZA () {
  dataSet.sort(function(a, b) {
    return b.words - a.words;
  });

  loadSorted();
}

function sortByWords (){
  if (loaded == false) {
    clearTableRows();
    loadData(sortWordsZA);
  }
  else{
    sortByWordsClicks += 1;

    if (sortByWordsClicks % 2 == 0) {
      clearTableRows();
      sortWordsZA();
    }
    else {
      clearTableRows();
      sortWordsAZ();
    }
  }
}

function sortTimeAZ () {
  dataSet.sort(function(a, b) {

    var timeA = new Date(a.publish_at);
    timeA = timeA.getTime();

    var timeB = new Date(b.publish_at);
    timeB = timeB.getTime();

    return timeA - timeB;
  });

  loadSorted();
}

function sortTimeZA () {
  dataSet.sort(function(a, b) {

    var timeA = new Date(a.publish_at);
    timeA = timeA.getTime();

    var timeB = new Date(b.publish_at);
    timeB = timeB.getTime();

    return timeB - timeA;
  });

  loadSorted();
}

function sortByTime(){
  if (loaded == false) {
    clearTableRows();
    loadData(sortWordsZA);
  }
  else {
    sortByTimeClicks += 1;

    if (sortByTimeClicks % 2 == 0) {
      clearTableRows();
      sortTimeZA();
    }

    else {
      clearTableRows();
      sortTimeAZ();
    }
  }
}
