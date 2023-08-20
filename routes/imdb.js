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

router.get('/list/:n',async(req,res)=>{
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const n =req.params.n
    const url = `https://www.imdb.com/search/title/?groups=top_1000&sort=user_rating,desc&count=10&start=${(n*10+1)}&ref_=adv_nxt`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const listItems = $(".lister-list .lister-item.mode-advanced .lister-item-content");
        const movies = [];
        listItems.each((idx, el) => {
          const movie = { title: "",desc:"",rank:parseInt(n)*10+(idx+1),year:"",stars:"",genre:[],id:"" };
          movie.title = $(el).children("h3.lister-item-header").children("a").text().trim();
          movie.desc = $(el).children("p.text-muted").last().text().trim();
          movie.genre = $(el).children("p.text-muted").children("span.genre").text().trim().split(',')
          movie.year = $(el).children("h3.lister-item-header").children("span.lister-item-year").text().replace('(','').replace(')','')
        movie.id = $(el).parent().find('img.loadlate').attr('data-tconst');
          movie.stars =$(el).children("div.ratings-bar").children("div.inline-block.ratings-imdb-rating").attr("data-value")
          movies.push(movie);
        });
        res.json({movies:movies})
      } catch (err) {
        console.error(err);
      }
})

router.get('/movie/:id',async(req,res)=>{
    const url = `https://www.imdb.com/title/${req.params.id}/?ref_=adv_li_i`
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const movie = { directors: [], img: "", reviews: "" };
        const dir = $('div.sc-410d722f-1 ul.ipc-metadata-list div.ipc-metadata-list-item__content-container ul').first()
        const dirList = $(dir).children('li')
        dirList.each((idx, el) => {
            movie.directors.push($(el).children('a').text())
        })
        movie.reviews = $('div.sc-bde20123-3').html()
        const img = $('img.ipc-image').attr('srcset')
        movie.img = img.split(' ')
        res.json({movie:movie})
    } catch (err) {
        console.error(err);
    }
})


module.exports = router