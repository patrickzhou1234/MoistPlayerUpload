const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const fs = require('fs');


function get_line(filename, line_no, callback) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");
 
    if(+line_no > lines.length){
      throw new Error('File end reached without finding line');
    }
 
    callback(null, lines[+line_no]);
}

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.post('/upload', (req, res) => {
  var YoutubeUrl = req.body.YoutubeUrl;
  var title = req.body.title;
  lineref = null;
  ytdl(YoutubeUrl, { filter: 'audioonly' })
  .pipe(fs.createWriteStream('./public/tracks/'+title+'.mp3'));
  
  get_line('./public/script.js', 0, function(err, line){
      lineref = line;
  });

  fs.readFile('./public/script.js', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(lineref, lineref.substring(0, lineref.length-2)+", '"+title+"'"+lineref.substring(lineref.length-2, lineref.length));
  
    fs.writeFile('./public/script.js', result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });
  
  res.redirect('../');
});

server.listen(3000);
