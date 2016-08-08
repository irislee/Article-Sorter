document.body.style.backgroundColor = "pink";


var request = new XMLHttpRequest();
// request.open('GET', '/my/url', true);
request.open('GET', 'http://localhost:3000/data/articles.json', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    
    var data = JSON.parse(request.responseText);

    // function timeStamp() {
    //   var now = new Date();
    //   var date = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
    //   var time = [now.getHours(), now.getMinutes(), now.getSeconds() ];
    //   return date.join("-") + " " + time.join(":");
    // }

    var currentDate = new Date();

    function timeDiff(articleDate, currentDate) {
      var publishDate = new Date(articleDate);
      var diff = new Date(currentDate - publishDate);
      var yearDiff   = diff.getUTCFullYear() - 1970;
      var monthDiff  = diff.getUTCMonth();
      var dayDiff    = diff.getUTCDate() - 1;
      var hourDiff   = diff.getUTCHours();
      var minuteDiff = diff.getUTCMinutes();
      var secondDiff = diff.getUTCSeconds();

      var difference = yearDiff + ' years ' + monthDiff + ' months ' + dayDiff + ' days ' + hourDiff + ' hours ' + minuteDiff + ' minutes and ' + secondDiff + ' seconds ago';

      return difference;
    }

    for (var i = 0; i < data.length; i++) {
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
      submitted.innerHTML = timeDiff(data[i].publish_at, currentDate);

    };

    // document.getElementById("title").innerHTML = data[0].title;
    
  } else {
    // We reached our target server, but it returned an error

  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send(); 