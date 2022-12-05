const { I } = inject();

const elements = {
    btn_search: {id: 'search'},
    btn_submit: {id: 'submit'},
    filter_area: { id:"searchLocation" },
    filter_radius: { id: "radius" },    
    filter_minPrice:{ id: "minPrice" },
    filter_maxPrice:{ id: "maxPrice" },
    filter_minBeds: { id: "minBedrooms" },
    filter_maxBeds: { id: "maxBedrooms" },
    filter_sortBy: {id : "sortType"}
};

const filter = async (listingInfo) => {
    
    listingInfo.listingType === 'buy' ? await I.amOnPage('https://www.rightmove.co.uk/property-for-sale.html') : await I.amOnPage('https://www.rightmove.co.uk/property-to-rent.html');

    await I.seeElement(elements.btn_search);
    await I.fillField(elements.filter_area, listingInfo.area)
    await I.click(elements.btn_search);

    await I.seeElement(elements.filter_radius);
    await I.selectOption(elements.filter_radius, listingInfo.searchRadius);
    await I.selectOption(elements.filter_minPrice, listingInfo.minPrice);
    await I.selectOption(elements.filter_maxPrice, listingInfo.maxPrice);
    await I.selectOption(elements.filter_minBeds, listingInfo.minBedrooms);
    await I.selectOption(elements.filter_maxBeds, listingInfo.maxBedrooms);

    await I.click(elements.btn_submit);

    await I.seeElement(elements.filter_sortBy);
    await I.selectOption(elements.filter_sortBy, listingInfo.sortedBy);

    return await I.grabCurrentUrl();
}

module.exports = {
    filter
}