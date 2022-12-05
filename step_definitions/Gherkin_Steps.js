const { I, zoopla, rightmove } = inject();
const assert = require('chai').assert

Given('I am a customer looking to {string} in {string}', async (listingType, area) => {
    listingInfo = {
        "listingType" : listingType, 
        "area" : area
    }
});

Given('The price range is between {string} and {string} per {string}', async (minPrice, maxPrice, duration) => {
    listingInfo['minPrice'] = minPrice
    listingInfo['maxPrice'] = maxPrice
    listingInfo['duration'] = duration ? duration : "month"
});

Given('The price range is between {string} and {string}', async (minPrice, maxPrice) => {
    listingInfo['minPrice'] = minPrice
    listingInfo['maxPrice'] = maxPrice
});

Given('The radius is {string} miles', async (searchRadius) => {
    listingInfo['searchRadius'] = searchRadius
});

Given('I want between {string} and {string} bedrooms', async (minBedrooms, maxBedrooms) => {
    listingInfo['minBedrooms'] = minBedrooms
    listingInfo['maxBedrooms'] = maxBedrooms
});

Given('I want the listing to be {string}', async (furnished) => {
    listingInfo['furnished'] = furnished === "any" ? "" : furnished
});


//call script to execute on page
When('I look for {string} listings in {string} sorted by {string}', async (featured, site, sortedBy) => {
    listingInfo['featured'] = featured
    listingInfo['sortedBy'] = sortedBy

    if (site === "zoopla"){
       listingURL = await zoopla.filter(listingInfo)
    } else {
        listingURL = await rightmove.filter(listingInfo)
    }
    
});


//verify that registration was successful based on result
Then('I should be able to successfully view the listing in position {string}', async (listingNum) => {
    await zoopla.grabResult(listingURL, listingNum)
});
