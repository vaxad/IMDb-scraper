// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const axios = require("axios");
const cheerio = require("cheerio");

// URL of the page we want to scrape

// Async function which scrapes the data
async function scrapeImdb({ url, rank }) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const movie = { title: "", desc: "", directors: [], img: "", link: url, stars: "", reviews: "", genre: [], rank: rank.replace('.','') };
        movie.title = $('span.sc-afe43def-1').text()
        movie.desc = $('p.sc-466bb6c-3').children('span.sc-466bb6c-1').text()
        const dir = $('div.sc-410d722f-1 ul.ipc-metadata-list div.ipc-metadata-list-item__content-container ul').first()
        const dirList = $(dir).children('li')
        dirList.each((idx, el) => {
            movie.directors.push($(el).children('a').text())
        })
        const genreList = $('div.ipc-chip-list__scroller a')
        genreList.each((idx, el) => {
            movie.genre.push($(el).children('span.ipc-chip__text').text())
        })
        movie.stars = $('span.sc-bde20123-1').text()
        movie.reviews = $('div.sc-bde20123-3').html()
        const img = $('img.ipc-image').attr('srcset')
        movie.img = img.split(' ')
        return movie
    } catch (err) {
        console.error(err);
    }
}

module.exports = scrapeImdb