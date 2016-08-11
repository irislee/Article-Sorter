var currentDate = new Date();
var numClicks = 0;
var articlesPerLoad = 10;
var dataSet;
var loaded = false;
var table = document.getElementById('articles');
var sortByWordsClicks = 0;
var sortByTimeClicks = 0;

var request = new XMLHttpRequest();

request.open('GET', 'http://localhost:3000/data/articles.json', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    dataSet = JSON.parse(request.responseText);
    updateArticlesNum();
    showData();
    if (typeof(Storage) !== "undefined") {

      if(localStorage.sortStatus == "wordsAZ"){
        clearTableRows();
        loadData(sortWordsAZ);
        sortByWordsClicks = 1;
      }
      else if(localStorage.sortStatus == "wordsZA"){
        clearTableRows();
        loadData(sortWordsZA);
        sortByWordsClicks = 1;
      }
      else if(localStorage.sortStatus == "timeAZ"){
        clearTableRows();
        loadData(sortTimeAZ);
        sortByTimeClicks = 1;
      }
      else if(localStorage.sortStatus == "timeZA"){
        clearTableRows();
        loadData(sortTimeZA);
        sortByTimeClicks = 1;
      }
    } 
    else {
      alert("Sorry, your browser does not support web storage...");
    }
  } else {
    // We reached our target server, but it returned an error
  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send(); 

function updateArticlesNum() {
  var string = '<th colspan="2" id="updateArticlesNum">UNPUBLISHED ARTICLES ' + ' (' + dataSet.length + ')' + '</th>';
  var el = document.getElementById('updateArticlesNum');
  el.outerHTML = string;
}

// window.onscroll = function(){
//   var btn = document.createElement('button');
//   var node = document.createTextNode('Scroll to Top');
//   btn.appendChild(node);
//   document.body.appendChild(btn);  
// };

if (window.pageYOffset > 0) {
  console.log('hi!');
}

function scrollToTop() {
  window.scrollTo(0,0);
}

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

  for (var i = numClicks*articlesPerLoad; i < articlesPerLoad * (numClicks + 1); i++) {
    var row = table.insertRow(-1);

    // Insert new cells (<td> elements) at the "new" <tr> element:
    var image = row.insertCell(0)
    var title = row.insertCell(1);
    var name = row.insertCell(2);
    var words = row.insertCell(3);
    var submitted = row.insertCell(4);

    // article link
    var link = '<a href ="' + dataSet[i].url + '" target="_blank">';
    var linkEnd = '</a>';

    // Add text to new cells:
    image.innerHTML = link + '<img width="100" height="63" src="' + dataSet[i].image + '" >' + linkEnd;
    title.innerHTML = link + dataSet[i].title + linkEnd;
    name.innerHTML = dataSet[i].profile.first_name + ' ' + dataSet[i].profile.last_name;
    words.innerHTML = dataSet[i].words;
    submitted.innerHTML = dateDiff(dataSet[i].publish_at, currentDate);

  };
}

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
  }).then(function() {
    updateArticlesNum();
  });

}

function loadMore() { 
  numClicks += 1;

  if (numClicks * articlesPerLoad >= dataSet.length && loaded == true) {

    var para = document.createElement('p');
    // para.setAttribute('id', 'messageLoaded');
    var node = document.createTextNode('No more articles to load.');
    para.appendChild(node);

    var element = document.getElementById('messageArea');
    var child = document.getElementById('load');
  
    element.replaceChild(para,child);
  }

  else if ((numClicks * articlesPerLoad) >= dataSet.length && loaded == false) {
    loadData(showData);
  }

  else {
    showData();
  }
}

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
    // numClicks += 1;
  };
  numClicks = artOnPage;
}

function sortWordsAZ () {
  localStorage.sortStatus = "wordsAZ"; 
  dataSet.sort(function(a, b) {
    return a.words - b.words;
  });

  loadSorted();
}

function sortWordsZA () {
  localStorage.sortStatus = "wordsZA";
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
  localStorage.sortStatus = "timeAZ";
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
  localStorage.sortStatus = "timeZA";
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
    loadData(sortTimeZA);
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