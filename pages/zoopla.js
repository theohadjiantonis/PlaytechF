const puppeteer = require('puppeteer');

const elements = {
    filter_toRent: '[id="radix-4-trigger-to-rent"]',
    filter_area: '[class="c-voGFy"]',
    filter_radius: '[id="desktop_radius-filter"]',
    filter_bedrooms: '[id="AnyBeds_testId"]', 
    filter_minBeds: '[id="beds_min"]',
    filter_maxBeds: '[data-testid="max_beds_testid"]',
    filter_priceRange: '[data-testid="any_price"]',
    filter_pricePer: '[data-testid="desktop_price_frequency-filter-select"]',
    filter_minPrice:'[data-testid="min_price"]',
    filter_maxPrice:'[data-testid="max_price"]',
    extraFilters:'[data-testid="search-results-header_filters-button"]',
    filter_furnishedDrop: '[id="radix-id-699155291-6"]',
    filter_partFurnished: '[id="part_furnished"]',
    filter_furnished: '[id="furnished"]',
    filter_unfurnished: '[id="unfurnished"]',
    filter_sortBy: '[id="sort-order-dropdown"]',
    btn_search_homePage: '[data-testid="search-btn"]',
    btn_search_searchPage: '[data-testid="search-button"]',
    btn_updateResults: '[aria-live="polite"]',
    btn_cookies: '#save',
    cookies_iframe: 'div#gdpr-consent-tool-wrapper iframe'
};

const filter = async (listingInfo) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [ 
            '--start-maximized',
          ]
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://www.zoopla.co.uk',{ waitUntil: 'networkidle2' });

    try{
        const cookieFrame = await page.waitForSelector(elements.cookies_iframe);
        const frame = await cookieFrame.contentFrame();
        const cookieBtn = await frame.$(elements.btn_cookies);
        await cookieBtn.click();

        //if we are looking for rentals 
        if (listingInfo.listingType === "rent")
        {
            await page.click(elements.filter_toRent);
        }
        
        await page.focus(elements.filter_area);
        await page.keyboard.type(listingInfo.area);
        await page.keyboard.press('Enter');

        //check if we landed on the next page
        await page.waitForSelector(elements.filter_radius);

        //seach area filter 
        //because dropdown list is generated using JS and is not a static list we need to scrape the site and find the element to select based on its value
        if (listingInfo.searchRadius){
            let optionValue = await page.$$eval('option', (options, listingInfo) => options.find(o => o.value === listingInfo.searchRadius)?.value, listingInfo);
            await page.select(elements.filter_radius, optionValue);
        };

        //bedrooms filter
        if (listingInfo.minBedrooms){
            await page.click(elements.filter_bedrooms);
            let optionValue = await page.$$eval('option', (options, listingInfo) => options.find(o => o.value === listingInfo.minBedrooms)?.value, listingInfo);
            await page.select(elements.filter_minBeds, optionValue);
        };

        if (listingInfo.maxBedrooms){
            //we only expand the bedrooms dropdown if we didn't expand it before hand
            !listingInfo.minBedrooms && await page.click(elements.filter_bedrooms);
            let optionValue = await page.$$eval('option', (options, listingInfo) => options.find(o => o.value === listingInfo.maxBedrooms)?.value, listingInfo);
            await page.select(elements.filter_maxBeds, optionValue);
        };
        //price range filter
        //minPrice
        if (listingInfo.minPrice){
            
            await page.click(elements.filter_priceRange);
            let optionValue = await page.$$eval('option', (options, listingInfo) => options.find(o => o.value == listingInfo.minPrice)?.value, listingInfo);
            await page.select(elements.filter_minPrice, optionValue);
        };

        //maxPrice
        if (listingInfo.maxPrice){
            //we only expand the price dropdown if we didn't expand it before hand
            !listingInfo.minPrice && await page.click(elements.filter_priceRange);
            let optionValue = await page.$$eval('option', (options, listingInfo) => options.find(o => o.value == listingInfo.maxPrice)?.value, listingInfo);
            await page.select(elements.filter_maxPrice, optionValue);
        };

        //Price Per
        if (listingInfo.duration){
            //we only expand the price dropdown if we didn't expand it before hand
            !listingInfo.minPrice && await page.click(elements.filter_bedrooms);
            let optionValue = await page.$$eval('option', (options, listingInfo) => options.find(o => o.innerText == listingInfo.duration)?.value, listingInfo);
            await page.select(elements.filter_pricePer, optionValue);
        };
        //furnished filter, if furninshed is any/empty we skip
        if(listingInfo.furnished != '' && listingInfo.furnished != undefined){
            await page.click(elements.extraFilters);
            const [furnishedbtn] = await page.$x("//button[contains(., 'Furnished')]")
            await furnishedbtn.click();
            if(listingInfo.furnished === 'furnished'){
                await page.click(elements.filter_furnished)
            }else if(listingInfo.furnished === 'part furnished'){
                await page.click(elements.filter_partFurnished)
            }else if(listingInfo.furnished === 'unfurnished'){
                await page.click(elements.filter_unfurnished)
            }
            await page.click(elements.btn_updateResults)
        }

        await page.waitForSelector(elements.btn_search_searchPage);
        //wrap this all in a promise so we wait for navigation to end before moving to returning the url
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click(elements.btn_search_searchPage)
          ]);
          
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            optionValue = await page.$$eval('option', (options, listingInfo) => options.find(o => o.innerText == listingInfo.sortedBy)?.value, listingInfo),
            await page.select(elements.filter_sortBy, optionValue)
          ]);

        return await page.url();
    }finally{
        await browser.close();
    }
};

const grabResult = async (listingURL, listingNum) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [ 
            '--start-maximized',
          ]
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 2560, height: 1440 });
    await page.goto(listingURL,{ waitUntil: 'networkidle2' });

    try{
        let listings;
        if (listingURL.includes('zoopla')){
            const cookieFrame = await page.waitForSelector(elements.cookies_iframe);
            const frame = await cookieFrame.contentFrame();
            const cookieBtn = await frame.$(elements.btn_cookies);
            await cookieBtn.click();
            listings = await page.$x('//*[contains(@id,"listing_")]')
        } else {
            listings = await page.$x('//*[contains(@id,"property-")]')
            if(listingNum == 0){
                listingNum = parseInt(listingNum) + 1
            }
        }
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            listings[listingNum].click()
          ]);
        await page.screenshot({ path: `${Math.random() }.passed.png`})
    }finally{
        await browser.close();
    }
};

module.exports = {
    filter,
    grabResult
}