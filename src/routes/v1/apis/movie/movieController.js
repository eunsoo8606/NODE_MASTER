/* - 해당 미들웨어 설치 필요
   - npm i axios cheerio selenium-webdriver/chrome chromedriver --save
   - selenium-webdriver/chrome or chromedriver 는 아마 -g 로 태그 넣어서 설치
   - 환경변수로 지정해놔야 크롬이랑 로컬이랑 연동되어 조작 가능 
*/
const express = require('express');
const router  = express.Router();

//미들웨어 require
const axios                     = require('axios');
const cheerio                   = require('cheerio');
const {Builder, By, Key, until} = require('selenium-webdriver'); 
const chrome                    = require('selenium-webdriver/chrome');
const chromedriver              = require('chromedriver');

//--headless , --no-sandbox 설정하면 브라우저 열지 않음.
//설정 주입.
chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

//크롭 option 객체 생성.
const chromeOptions = new chrome.Options();
chromeOptions.addArguments('--headless');
chromeOptions.addArguments('--no-sandbox');
const url = 'https://www.lottecinema.co.kr/NLCHS/Movie/List?flag=1';


router.get('/',(req,res)=>{
    (async function example() { 
        //크롬 브라우저 기본 셋팅
        let driver = await new Builder().forBrowser('chrome').withCapabilities(chromeOptions).build();
        var movieList = new Array();
    try { 
        //크롬 브라우저 OPEN
        await driver.get(url); 
        //특정 ELEMENT LOAD될때까지 대기 10초로 설정.
        await driver.wait(until.elementsLocated(By.css('#contents')),10000);
        //특정 엘리먼트 값 추출
        var num_info  = await driver.findElements(By.className('num_info'));
        var tit_info  = await driver.findElements(By.className('tit_info'));
        var rate_info = await driver.findElements(By.className('rate_info'));
        var star_info = await driver.findElements(By.className('star_info'));
        //XPATH 를 통하여 ID 나 CLASS가 없는 태그 선택하여 값 추출
        var img = await driver.findElements(By.xpath('//*[@id="contents"]/div/ul[4]/li//img[@*]'));
    
        var movie = null;
        var j = 0;
        //JSON으로 PARSING 작업
        for (var i = 0; i < num_info.length; i++) { 
                movie = new Object();
                //순위나 TITLE 이 없는 값은 담지 않음.
                //가변배열이라 맞춰주기 위한 조건문.
                //롯데시네마에서 값을 보면 순위가 없고 AD 라는 값이 있어 해당 값이라면 값 담지 않는다.
                if(await num_info[i].getText() === "AD"){
                    j--;
                }
                else{
                    //OBJECT 에 담기
                    movie.img = await img[i].getAttribute('src');
                    movie.rank = await num_info[i].getText();
                    movie.title = await tit_info[j].getText();
                    movie.rate = await rate_info[j].getText();
                    movie.star = await star_info[j].getText();
                    //배열에 PUSH
                    movieList.push(movie);
                }
                j++;
             }
        } finally{
            //driver 닫고 결과 값 response
            driver.quit(); 
            res.send(movieList);
        } 
    })();
});

module.exports = router;