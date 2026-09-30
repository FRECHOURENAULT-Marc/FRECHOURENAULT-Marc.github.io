import {Game} from'./framework.js';

class Flip7PlayerManager extends Game.PlayerManager
{
    constructor() {
        super();
        Flip7PlayerManager.instance = this;

        this.cardList = [];
        this.addedPlayers = [];
        this.round = 1;

        this.mainDiv = document.createElement("div");
        document.body.appendChild(this.mainDiv);

        this.mainDiv.style.display = "none";
        this.mainDiv.style.flexDirection = "column";
        this.mainDiv.style.position = "fixed";
        this.mainDiv.style.top = "60%";
        this.mainDiv.style.left = "1rem";
        this.mainDiv.style.width = "calc(100% - 2rem)";
        this.mainDiv.style.height = "20rem";

        this.mainDiv.style.background = "var(--light)";

        this.cardsDiv = document.createElement("div");
        this.mainDiv.appendChild(this.cardsDiv);

        this.cardsDiv.style.display = "grid";
        this.cardsDiv.style.gridTemplateColumns = "repeat(5, 1fr)";
        this.cardsDiv.style.gridTemplateRows = "repeat(4, 1fr)";

        for(let i = -2; i < 13; i++)
        {
            const cardDiv = document.createElement("div");
            this.cardsDiv.appendChild(cardDiv);

            cardDiv.style.display = "flex";
            cardDiv.style.justifyContent = "center";
            cardDiv.style.alignItems = "center";
            cardDiv.style.marginTop = "0.25rem";
            cardDiv.style.marginBottom = "0.25rem";
            cardDiv.style.marginLeft = "0.5rem";
            cardDiv.style.marginRight = "0.5rem";
            cardDiv.style.height = "4rem";
            //mettre une image si possible

            cardDiv.style.border = "1px solid black";

            cardDiv.classList.add("font_large");
            cardDiv.textContent = i.toString();


            cardDiv.addEventListener("click", () => this.SelectCard(cardDiv) );
        }

        this.bottomDiv = document.createElement("div");
        this.mainDiv.appendChild(this.bottomDiv);
        this.bottomDiv.style.display = "flex";
        this.bottomDiv.style.flexDirection = "row";
        this.bottomDiv.style.justifyContent = "center";
        this.bottomDiv.style.alignItems = "center";
        this.bottomDiv.style.gap = "10rem";

        this.validDiv = document.createElement("div");
        this.bottomDiv.appendChild(this.validDiv);

        this.validDiv.textContent = "Valider les points";
        this.validDiv.style.display = "flex";
        this.validDiv.style.justifyContent = "center";
        this.validDiv.style.alignItems = "center";

        this.validDiv.addEventListener("click", () => {

            let score = 0;
            for(let i = 0; i < this.cardList.length; i++) {
                score += parseInt(this.cardList[i]);
            }

            if(this.addedPlayers.find(p => p == this.actualPlayer)) {
                const sList = this.actualPlayer.scoreList
                sList.scoreHistory[sList.scoreHistory.length - 1] = score;
                sList.UpdateTotalScore();
            }
            else {
                this.AddScoreToPlayer(this.actualPlayer.name, score);
                this.addedPlayers.push(this.actualPlayer);
            }

            const playersDivs = Game.Scoreboard.Get().playerDivs
            for(let i = 0; i < playersDivs.length; i++)
                playersDivs[i].scoreDiv.historySize = 0;

            Game.Scoreboard.Get().UpdateScores();

            this.UpdateNonAddedScoreThisRound();
            this.UpdateAddedScoreThisRound();

        });

        this.nextDiv = document.createElement("div");
        this.bottomDiv.appendChild(this.nextDiv);

        this.nextDiv.textContent = ">";
        this.nextDiv.addEventListener("click", () => {
            this.round++;
            this.addedPlayers = [];
            this.UpdateNonAddedScoreThisRound();
        });

    }

    /**
     *
     * @param cardDiv {HTMLDivElement}
     * @constructor
     */
    SelectCard(cardDiv) {
        const isSelected = cardDiv.style.backgroundColor ? true : false;

        if(isSelected == false)
            this.cardList.push(i);
        else
            this.cardList = this.cardList.filter(number => number != i);

        cardDiv.style.backgroundColor =
            isSelected ? "" : "var(--light-red)";
    }

    ClearSelectedCards() {
        this.cardList = [];
        for(let i = 0; i < this.cardsDiv.children.length; i++) {
            const cardDiv = this.cardsDiv.children[i];
            cardDiv.style.backgroundColor = "";
        }
    }

    UpdateAddedScoreThisRound() {
        for(let i = 0; i < this.addedPlayers.length; i++) {
            const p = this.addedPlayers[i];
            const pDiv= Game.Scoreboard.Get().GetPlayerDiv(p.name);
            pDiv.scoreDiv.totalScoreDiv.textContent = p.scoreList.score + " ("+this.round+")";
        }
    }
    UpdateNonAddedScoreThisRound() {
        for(let i = 0; i < this.players.length; i++) {
            const p = this.players[i];
            const pDiv= Game.Scoreboard.Get().GetPlayerDiv(p.name);
            pDiv.scoreDiv.totalScoreDiv.textContent = p.scoreList.score + " ("+(this.round - 1)+")";
        }
    }

    SelectPlayer(name)
    {
        super.SelectPlayer(name);

        this.ClearSelectedCards();

        this.mainDiv.style.display = "flex";
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const pManager = new Flip7PlayerManager();
    const scoreboard = new Game.GridScoreboard();

    const p1 = pManager.CreatePlayer("Marc");
    const p2 = pManager.CreatePlayer("Hehe man");
    const p3 = pManager.CreatePlayer("Player3");
    const p4 = pManager.CreatePlayer("Player4");
    const p5 = pManager.CreatePlayer("Player5");
    scoreboard.AddPlayer(p1);
    scoreboard.AddPlayer(p2);
    scoreboard.AddPlayer(p3);
    scoreboard.AddPlayer(p4);
    scoreboard.AddPlayer(p5);

    if(scoreboard instanceof Game.GridScoreboard)
    {
        scoreboard.SetSize(3, 4);

        for(let i = 0; i < 10; i++) {
            const p = pManager.CreatePlayer("Generate" + i);
            scoreboard.AddPlayer(p);
        }
    }
    scoreboard.UpdateScores();



})

