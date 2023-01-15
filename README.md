# NBA Stats API

This project is a simple React Web-application for consuming an API that calculates NBA player stats. The application allows the user to search for a specific player and then calculates the top five performances of that player in each stat category that season. This application utilizes API-NBA which is hosted through RapidAPI here: https://rapidapi.com/api-sports/api/api-nba/

## Homepage

Upon opening this web-application, the user will see this homepage:

![nba api homepage 1](https://user-images.githubusercontent.com/13879568/212551884-69c95630-f278-43a9-a2ee-0acfb997ef6c.PNG)


### Searching for a player with Lastname, Season, and Team ID

This API allows searches for a specific player through different methods. The first method is using the player's lastname, season, and their team id number. API-NBA uses a specific legend for the team id numbers so this is given to the user in the bottom of the webpage.

![nba api homepage 2](https://user-images.githubusercontent.com/13879568/212551936-b9493910-324c-45c6-9a44-34fc9c0d0bce.PNG)

When the user searches for a specific player, the Web-Applications makes HTTP requests to the API server and displays the top five performances of the searched player in each stat category.

![nba api srch 3](https://user-images.githubusercontent.com/13879568/212552254-06f56a8c-09bc-42c6-8fe3-bc7770dc242d.PNG)

### Multiple Search Results

When multiple players with the same name are present on the team, this Web-App uses conditional rendering to render the multiple search results instead of an individual player's stats. The app also shows the ID numbers of each specific player so that the user can do an ID search for their selected player.

![nba api srch 4](https://user-images.githubusercontent.com/13879568/212552609-100e1540-a80a-4fda-b17d-5658087d1446.PNG)


### Searching for a player with ID Number and Season

Once a player's ID number has been retreived, the user can directly search for their desired player using the "ID Search" button.

![nba api srch 5](https://user-images.githubusercontent.com/13879568/212552743-ecc1b7ff-905c-498a-8d31-69f1d0dc02ec.PNG)


