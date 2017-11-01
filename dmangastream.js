#!/bin/node
var fs = require('fs');
var os = require('os');
var url = require('url');
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

      var img = $('.page').find('img').attr('src');
      var name = $('.hidden-sm').text().replace(/( )/gm,"")+$('.btn-primary').text().replace(/( )/gm,"").replace(/(\r\n|\n|\r)/gm,"_")+'.png';
      if(img !== undefined)
      {
        if(img.charAt(0)!=='h')
          img='http:'+img;
        var cmd='wget -O '+name+' "https://images-onepick-opensocial.googleusercontent.com/gadgets/proxy?container=a&url='+encodeURIComponent(img)+'"';
        execSync(cmd);
        execSync('convert '+name+' '+name);
      }else process.exit(0);
      var next = $('.next').find('a').attr('href');
      if(next === undefined)
        process.exit(0);
      else {
        var href = url.parse(page);
        next = url.parse(next);
        next = href.protocol+"//"+href.host+next.path;
        getMangaPage( next);
      }
    } else {
      console.log('Failed to download: '+page);
      process.exit(0);
    }
  });
}

getMangaPage(args[2]);

