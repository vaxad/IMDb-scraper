const express = require('express')
const cheerio = require("cheerio");
const router = express.Router()
const scrapImdb2 = require('../scrapImdb2')
const scrapeMovie = require('../scrapeImdb')
const old = require('../imdb-old')
const axios = require("axios");

router.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // res.write(': go\n\n');
    try {
        const url = "https://www.imdb.com/search/title/?groups=top_100&sort=user_rating,desc";

        // res.write(`data: ${url}\n\n`);
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
            }
        });

        // res.write(`movies: [\n\n`);
        const $ = cheerio.load(data);
        const listItems = $(".lister-list .lister-item.mode-advanced .lister-item-content");
        for (const el of listItems) {
            const rank = $(el).children('h3.lister-item-header').children("span.lister-item-index").text()
            const link = "https://www.imdb.com" + $(el).children("h3.lister-item-header").children("a").attr("href");
            // res.write(`data: ${link}\n\n`);
            const movie = await (scrapeMovie({ url: link, rank: rank }))
            res.write(`data:${JSON.stringify(movie)}\n\n`);
        }
        res.write('data:stop')
        res.end();
    } catch (err) {
        res.write(`err: ${err}`)
        res.end();
    }
    res.end();
})

router.get('/test', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.write(': start\n\n');
        res.write("data\n");
        await new Promise(resolve => setTimeout(resolve, 1000));
        res.write("data\n");
        await new Promise(resolve => setTimeout(resolve, 1000));
        res.write("data\n");
        await new Promise(resolve => setTimeout(resolve, 1000));
        res.write("data\n");
        await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {

    }
})

router.get('/top1000/:n', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const n = req.params.n?req.params.n:'0'
    // res.write(': go\n\n');
    try {
        const url = `https://www.imdb.com/search/title/?groups=top_1000&sort=user_rating,desc&count=100&start=${n}01&ref_=adv_nxt`;

        // res.write(`data: ${url}\n\n`);
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
            }
        });

        // res.write(`movies: [\n\n`);
        const $ = cheerio.load(data);
        const listItems = $(".lister-list .lister-item.mode-advanced .lister-item-content");
        for (const el of listItems) {
            const rank = $(el).children('h3.lister-item-header').children("span.lister-item-index").text()
            const link = "https://www.imdb.com" + $(el).children("h3.lister-item-header").children("a").attr("href");
            // res.write(`data: ${link}\n\n`);
            const movie = await (scrapeMovie({ url: link, rank: rank }))
            res.write(`data:${JSON.stringify(movie)}\n\n`);
        }
        res.write('data:stop')
        res.end();
    } catch (err) {
        res.write(`err: ${err}`)
        res.end();
    }
    res.end();
})

//https://www.imdb.com/search/title/?groups=top_1000&sort=user_rating,desc&count=100&start=101&ref_=adv_nxt
//https://www.imdb.com/search/title/?groups=top_1000&sort=user_rating,desc&count=100&start=201&ref_=adv_nxt


module.exports = router