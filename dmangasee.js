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

      var img = $('.CurImage').attr('src');

      var name = $('title').text().replace(/( )/gm,"_")+'.png';
      if(img !== undefined)
      {
        if(img.charAt(0)!=='h')
          img='http:'+img;
        var cmd='wget -O '+name+' "https://images-onepick-opensocial.googleusercontent.com/gadgets/proxy?container=a&url='+encodeURIComponent(img)+'"';
        var nextpage=$('.PageSelect option:selected').next().first().text().split(' ').pop();
        var nextchapter;
        if(nextpage)
        	nextchapter = $('.CurChapter').first().text();
        else{
        	nextpage=1;
        	nextchapter=$('.ChapterSelect option:selected').next().first().text().split(' ').pop();
        }
        execSync(cmd);
        execSync('convert '+name+' '+name);
      }else process.exit(0);
      var next = "/read-online/"+$(".IndexName").val()+"-chapter-"+nextchapter+"-page-"+nextpage+".html";
      if(next === undefined)
        process.exit(0);
      else {
        var href = url.parse(page);
        next = url.parse(next);
        next = href.protocol+"//"+href.host+next.path;
        if(nextchapter === '')
          process.exit(0);
        getMangaPage( next);
      }
    } else {
      console.log('Failed to download: '+page);
      process.exit(0);
    }
  });
}

getMangaPage(args[2]);

