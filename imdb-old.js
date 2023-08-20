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
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    const listItems = $(".lister-list .lister-item.mode-advanced .lister-item-content");
    
    // console.log(listItems.html());
    // Stores data for all movies
    const movies = [];
    // Use .each method to loop through the li we selected
    listItems.each((idx, el) => {
      // Object holding data for each movie/jurisdiction
      const movie = { title: "", desc: "", directors:"", img:"",link:"" };
      // Select the text content of a and span elements
      
        // console.log(pretty($.html()));
      // Store the textcontent in the above object
      movie.title = $(el).children("h3.lister-item-header").children("a").text().trim();
      movie.desc = $(el).children("p.text-muted").last().text().trim();
      movie.directors = $(el).children("p").children("a").first().text().trim();
      movie.img = $(el).parent().find('img.loadlate').attr('src');
      movie.link="https://www.imdb.com"+$(el).children("h3.lister-item-header").children("a").attr("href");
      // Populate movies array with movie data
      movies.push(movie);
    });
    // Logs movies array to the console
    return movies
    // Write movies array in movies.json file
  } catch (err) {
    console.error(err);
  }
}

module.exports=scrapeImdb