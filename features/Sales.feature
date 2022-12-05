Feature: Sale listings

Scenario: Find first sales listing in zoopla
    #Specify site to look in and type of listing e.g rent/sale and zoopla/rightmove etc.
    Given I am a customer looking to "buy" in "London" 
    And The price range is between "100000" and "2000000"
    And The radius is "1" miles
    And I want between "3" and "4" bedrooms
    #Specify search parameters (featured/non-featured, area, search radius, price range, no. of bedrooms, property type, date range, Under Offer & Sold STC option)
    When I look for "non-featured" listings in "zoopla" sorted by "Most recent"
    #Specify which listing you want to see
    Then I should be able to successfully view the listing in position '0'


Scenario: Find first rent listing in rightmove
    #Specify site to look in and type of listing e.g rent/sale and zoopla/rightmove etc.
    Given I am a customer looking to "rent" in "London" 
    And The price range is between "1000" and "2000"
    And The radius is "1.0" miles
    And I want between "3" and "4" bedrooms
    #Specify search parameters (featured/non-featured, area, search radius, price range, no. of bedrooms, property type, date range, Under Offer & Sold STC option)
    When I look for "non-featured" listings in "rightmove" sorted by "Newest Listed"
    #Specify which listing you want to see
    Then I should be able to successfully view the listing in position '0'