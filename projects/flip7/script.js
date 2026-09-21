function IsNullOrUndefined(x) {
    return x == null;
}

class Singleton {
    static instance = null
    constructor() {
        this.instance = this;
    }

    static Get() {
        if(IsNullOrUndefined(this.instance)) {
            console.log("Be sure to create the singleton before getting it.")
            return null;
        }
        return this.instance;
    }
}

class ScoreList {
    constructor() {
        this.score = 0;
        this.scoreHistory = [];
    }
    AddScore(score) {
        this.scoreHistory.push(score);
        this.UpdateTotalScore();
    }
    UpdateTotalScore() {
        let total = 0;
        for(const score of this.scoreHistory)
            total += score;
        this.score = total;
    }
}

class SimpleDiv {
    /**
     * @param {Node} parentNode
     */
    constructor(parentNode = null) {
        this.mainDiv = document.createElement('div');
        if(IsNullOrUndefined(parentNode)) return this;

        this.parentNode = parentNode;
        this.parentNode.appendChild(this.mainDiv);
    }
}

class StyleDiv extends SimpleDiv {
    /**
     * @param {Node} parentNode
     * @param {string} style
     */
    constructor(parentNode, style = "") {
        super(parentNode);
        this.mainDiv.style.cssText = style;
        this.style = this.mainDiv.style;
    }
}

class NameDiv extends StyleDiv {
    constructor(parentNode, name, style = "") {
        super(parentNode, style);

        this.nameDiv = document.createElement('div');
        this.mainDiv.appendChild(this.nameDiv);
        this.nameDiv.textContent = name;
    }

    UpdateName(name) {
        this.nameDiv.textContent = name;
    }
}

class ScoreDiv extends StyleDiv {
    constructor(parentNode, style = "") {
        super(parentNode, style);

        this.totalScoreDiv = document.createElement('div');
        this.mainDiv.appendChild(this.totalScoreDiv);
        this.totalScoreDiv.textContent = "0";
    }

    /**
     * @param {ScoreList} ScoreList
     */
    UpdateScore(ScoreList) {
        this.totalScoreDiv.textContent = ScoreList.score;

        //Clear score history
        for(let i = this.mainDiv.children.length; i > 1; i--)
            this.mainDiv.removeChild(this.mainDiv.children[i]);
        //Set score history
        for(let i = 0; i < ScoreList.scoreHistory.length; i++) {
            const scoreDiv = document.createElement('div');
            this.mainDiv.appendChild(scoreDiv);
            scoreDiv.textContent = ScoreList.scoreHistory[i];
        }
    }
}


class PlayerDiv extends StyleDiv {
    /**
     * @param {Node} parentNode
     * @param {string} style
     * @param {Player} player
     */
    constructor(parentNode, player, style = "") {
        super(parentNode, style);

        this.player = player;
        this.nameDiv = new NameDiv(this.mainDiv, player.name, "");
        this.scoreDiv = new ScoreDiv(this.mainDiv, "");
    }

    UpdateScore() {
        this.scoreDiv.UpdateScore(this.player.scoreList)
    }
    UpdateName() {
        this.nameDiv.UpdateName(this.player.name)
    }
    SetName(name) {
        this.player.name = name
        this.UpdateName();
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.scoreList = new ScoreList();
    }

    AddScore(score) {
        this.scoreList.AddScore(score);
    }
}

class Scoreboard extends Singleton {

    constructor() {
        //Data
        super(); //super = class mère
        this.players = [];

        //html
        this.mainDiv = document.createElement('div');
        document.body.appendChild(this.mainDiv);
        this.mainDiv.style.display = "flex";
        this.mainDiv.style.flexDirection = "row";
        this.mainDiv.style.gap = "1rem";

        this.playerDivs = [];
    }

    /**
     * @param {Player} player
     */
    AddPlayer(player) {
        if(IsNullOrUndefined(player))
            console.log("Player added to ScoreBoard is undefined :"+player);
        this.players.push(player);

        const nPlayerDiv = new PlayerDiv(this.mainDiv, player, "");
        nPlayerDiv.UpdateScore()
        nPlayerDiv.style.background = "var(--light)";
        nPlayerDiv.style.borderRadius = "10px";
        nPlayerDiv.style.padding = "0.25rem";
        nPlayerDiv.style.minWidth = "5rem";
        nPlayerDiv.style.minHeight = "5rem";
        nPlayerDiv.style.display = "flex";
        nPlayerDiv.style.flexDirection = "column";
        nPlayerDiv.style.alignItems = "center";

        nPlayerDiv.nameDiv.style.background = "var(--orange)";
        nPlayerDiv.nameDiv.style.color = "white";
        nPlayerDiv.nameDiv.style.borderRadius = "5px";
        nPlayerDiv.nameDiv.style.minWidth = "100%";
        nPlayerDiv.nameDiv.style.minHeight = "2rem";
        nPlayerDiv.nameDiv.style.display = "flex";
        nPlayerDiv.nameDiv.style.alignItems = "center";
        nPlayerDiv.nameDiv.style.justifyContent = "center";

        nPlayerDiv.scoreDiv.style.display = "flex";
        nPlayerDiv.scoreDiv.style.flexDirection = "column";
        nPlayerDiv.scoreDiv.style.alignItems = "center";
        nPlayerDiv.scoreDiv.totalScoreDiv.style.fontWeight = "bold";
        nPlayerDiv.scoreDiv.totalScoreDiv.style.marginTop = "0.25rem";
        nPlayerDiv.scoreDiv.totalScoreDiv.style.marginBottom = "0.25rem";


        this.playerDivs.push(nPlayerDiv);
    }

    UpdateScores() {
        for(const pDiv of this.playerDivs)
            pDiv.UpdateScore();
    }
}





document.addEventListener('DOMContentLoaded', () => {

    const scoreboard = new Scoreboard();

    const p1 = new Player("Marc");
    p1.AddScore(50);
    p1.AddScore(250);
    p1.AddScore(-100);
    scoreboard.AddPlayer(p1);
    const p2 = new Player("Hehe man");
    p2.AddScore(-50);
    p2.AddScore(110);
    p2.AddScore(100);
    scoreboard.AddPlayer(p2);
    const p3 = new Player("Player3");
    scoreboard.AddPlayer(p3);
})