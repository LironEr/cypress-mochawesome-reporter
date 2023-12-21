Feature: Test 1

    Scenario: pass
        When I visit "site/index.html"
        Then The list has 4 items

    Scenario: fail
        When I visit "site/index.html"
        Then The list has 5 items

    Scenario Outline: pass with examples
        When I visit "site/index.html"
        Then The list has more than <num> items

        Examples:
            | num |
            | 1   |
            | 2   |
            | 3   |
