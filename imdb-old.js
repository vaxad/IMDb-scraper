// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const pretty = require("pretty");

// URL of the page we want to scrape
const url = "https://www.imdb.com/search/title/?groups=top_100&sort=user_rating,desc";

// Async function which scrapes the data
async function scrapeImdb() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const listItems = $(".lister-list .lister-item.mode-advanced .lister-item-content");
    
    const movies = [];
    listItems.each((idx, el) => {
      const movie = { title: "", desc: "", directors:"", img:"",link:"" };
      movie.title = $(el).children("h3.lister-item-header").children("a").text().trim();
      movie.desc = $(el).children("p.text-muted").last().text().trim();
      movie.directors = $(el).children("p").children("a").first().text().trim();
      movie.img = $(el).parent().find('img.loadlate').attr('src');
      movie.link="https://www.imdb.com"+$(el).children("h3.lister-item-header").children("a").attr("href");
      movies.push(movie);
    });
    return movies
  } catch (err) {
    console.error(err);
  }
}

module.exports=scrapeImdb