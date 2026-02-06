# Domain glossary

## Tournament (Tourney)

A competition container where a group of users play a selected game mode over a selected sport.

## Tournament admin

A user with administration rights for a tournament. Exact capabilities are TBD.

## Game mode

A set of rules and UI flows defining how users play inside a tournament.
Examples: ScorePrediction, Draft (FUT Draft-style).

## Canonical IDs

Game mode IDs (stable, non-localized):

-   scorePrediction (display name: ScorePrediction)
-   draft (display name: Draft)

Sport IDs (stable, non-localized):

-   football
-   basketball
-   esports

## Sport

A category of events/matches used by game modes.
Examples: football, basketball, esports.

## Match / Event

A sport-specific contest instance used as input for gameplay (e.g. a football match).

## Matchday

A grouping of matches/events by time period (e.g. a round/week).

## ScorePrediction (formerly Bets)

A game mode where users predict outcomes/scores for matches.
Canonical gameModeId: scorePrediction.

## Prediction / Pick

A user-submitted a prediction for a specific match.

## Ranking

An ordered list of users in a tournament computed from game mode rules.

## Draft

A planned game mode where users pick players/items to form a roster (FUT Draft-style). Detailed rules TBD.
