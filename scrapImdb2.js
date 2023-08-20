// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const axios = require("axios");
const cheerio = require("cheerio");
const scrapeMovie = require('./scrapeImdb')

const url = "https://www.imdb.com/search/title/?groups=top_100&sort=user_rating,desc";

async function scrapeImdb() {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const listItems = $(".lister-list .lister-item.mode-advanced .lister-item-content");
        const moviesPromises = [];

        listItems.each(async (idx, el) => {
            const rank = $(el).children('h3.lister-item-header').children("span.lister-item-index").text()
            const link = "https://www.imdb.com" + $(el).children("h3.lister-item-header").children("a").attr("href");
            moviesPromises.push(scrapeMovie({ url: link, rank: rank }))
        });
        const movies = await Promise.all(moviesPromises)

        return movies
    } catch (err) {
        console.error(err);
    }
}

module.exports = scrapeImdb