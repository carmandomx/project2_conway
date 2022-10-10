# Project II

Welcome! This repo is used to deliver a P.R., the actual workflow repo is [here](https://tabex94.github.io/LIFEfromzero)

## Team members

| Career | Name | eMail |
| --- | --- | --- |
| SalesForce | José Alonso De La Cruz Arias | jose.delacruz@itksquare.edu.mx |

## Assignation 

Please use this format for your User Stories assignations

| User Stories     |Done |
| ---------------- | :--: |
| 1. As a user, whenever I navigate to the website and see an empty grid with the option to let the user set up the initial configuration. |  X   |
| 2. If the game is paused I can resume it. |  X   | 
| 3. I can clear the board. |  X   | 
| 4. I can click a 'Randomize' button that will generate an initial configuration for the game to play and this can only be done when the games has not yet started.|  X   |
| 5. I can see the amount of generation has passed since the start of the game. |  X   | 
| 6. I can click a button that would set the game back to the initial state (how the website initially loads in). |  X   | 

# Live demo

Please include here a link to your [live demo](https://tabex94.github.io/LIFEfromzero)

# Requeriments
You need to use the same version of node that we use in class and no external dependices can be used. This means no frameworks or libraries.

# Note
I made a slighly modification to the behavior of the random button. You can set a new random array even in execution-time! I made it in order to improve user experience by leting the user put new cells when the game is running. You'll find this feature is funnier when you use it in combination with the dinamic speed! Also you have 25% of probabilities that the random button show's you a different way to randomize the array, try adding even more cells! 

# About the making of this game!

Here I put some screenshots to give an idea of how certain feaures was reached.

First I'm going to count the neightboorhood of a single cell using this draft as support


![image](https://user-images.githubusercontent.com/113391047/193979527-4758b5a6-565e-46c3-af11-0499e9dea100.png)
image Made in excel

The Building workflow of the program was sketched to find those task who can runs independly 

In spanish for sharing purposes

![da2890a1-fadb-4a34-8271-bf2006c2b77b](https://user-images.githubusercontent.com/113391047/194459133-24ce8c38-bb3a-431d-ba30-12dd5dcfb380.jpg)


![LOGICCHECK](https://user-images.githubusercontent.com/113391047/194477110-aeb8b1e3-77ae-4094-be30-b4bb32cbbc58.png)

To calc color, we need to desing our non-linear functions

![color settings](https://user-images.githubusercontent.com/113391047/194753863-ff457a42-a4e7-4cdb-968f-41c543dbad8a.png)

I used a graphic calculator tool
So I can easly control and see diferent variations for rgb values

![image](https://user-images.githubusercontent.com/113391047/194755636-d2e87ce9-d7fb-41af-9c25-4e7750349409.png)

