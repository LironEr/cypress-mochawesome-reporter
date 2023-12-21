Feature: Test 1

    Scenario: pass
        When I visit "site/index.html"
        Then The list has 4 items

    Scenario: fail
        When I visit "site/index.html"
        Then The list has 5 items
