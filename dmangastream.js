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
  var href = url.parse(page);
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var arr = [];

      var img = $('.page').find('img').attr('src');
      var hrefArr = href.path.split('/');
      var name = hrefArr[2]+'_'+hrefArr[3]+'_page_'+hrefArr[5]+'.png';
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

