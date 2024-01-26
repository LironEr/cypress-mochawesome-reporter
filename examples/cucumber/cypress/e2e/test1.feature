Feature: Test 1
    Background:
        When I visit "site/index.html"

    Scenario: pass
        Then The list has 4 items

    Scenario: fail
        Then The list has 5 items

    Scenario Outline: pass with examples
        Then The list has more than <num> items

        Examples:
            | num |
            | 1   |
            | 2   |
            | 3   |
