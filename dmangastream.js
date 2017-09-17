#!/bin/node
var fs = require('fs');
var os = require('os');
var request = require('request');
var cheerio = require('cheerio');
const execSync = require('child_process').execSync;
const args = process.argv;

function getMangaPage(page){
  request('https://images-onepick-opensocial.googleusercontent.com/gadgets/proxy?container=a&url='+encodeURIComponent(page), function (error, response, body) {
  console.log(page);
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var arr = [];
      next = $('.next').find('a').attr('href');
      var img = $('.page').find('img').attr('src');
      var name = $('.btn').text().replace(/( )/gm,"").replace(/(\r\n|\n|\r)/gm,"_")+'.png';
      if(img !== undefined)
      {
        if(img.charAt(0)!=='h')
          img='http:'+img;
        var cmd='wget -O '+name+' "https://images-onepick-opensocial.googleusercontent.com/gadgets/proxy?container=a&url='+encodeURIComponent(img)+'"';
        execSync(cmd);
        execSync('convert '+name+' '+name);
      }else process.exit(0);
      if(next === undefined)
        process.exit(0);
      getMangaPage(next);
    } else {
      console.log('Failed to download: '+page);
      process.exit(0);
    }
  });
}

getMangaPage(args[2]);

