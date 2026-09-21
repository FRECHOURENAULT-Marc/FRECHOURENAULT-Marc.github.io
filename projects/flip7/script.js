function IsNullOrUndefined(x) {
    return x == null;
}

class Singleton {
    static instance = null;

    constructor() {
        this.constructor.instance = this;
    }

    static Get() {
        if (IsNullOrUndefined(this.instance)) {
            console.log(
                `Be sure to create the singleton before getting ${this.name}.`
            );
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
        for(let i = this.mainDiv.children.length-1; i > 0; i--)
            this.mainDiv.removeChild(this.mainDiv.children[i]);

        //Set score history
        for(let i = 0; i < ScoreList.scoreHistory.length; i++) {
            const scoreDiv = document.createElement('div');
            this.mainDiv.insertBefore(scoreDiv, this.totalScoreDiv)
            scoreDiv.textContent = ScoreList.scoreHistory[i];
        }
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
    SetName(name) {
        this.name = name;
    }
}

class PlayerDiv extends StyleDiv {
    /**
     * @param {Node} parentNode
     * @param {string} name
     * @param {string} style
     */
    constructor(parentNode, name, style = "") {
        super(parentNode, style);

        this.onClick = null;

        this.mainDiv.addEventListener('click', () => {
            this.onClick();
        })

        this.nameDiv = new NameDiv(this.mainDiv, name, "");
        this.scoreDiv = new ScoreDiv(this.mainDiv, "");
    }

    /**
     * @param {Player} player
     */
    UpdateScore(player) {
        this.scoreDiv.UpdateScore(player.scoreList)
    }
    /**
     * @param {Player} player
     */
    UpdateName(player) {
        this.nameDiv.UpdateName(player.name)
    }
    /**
     * @param {Player} player
     */
    Update(player) {
        this.UpdateScore(player);
        this.UpdateName(player);
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
        this.mainDiv.style.gap = "0.25rem";

        this.playerDivs = [];
        this.actualPlayerIDShown = 0;
        this.CountPlayerDivShown = 999;
    }

    RemovePlayerDiv(index) {
        this.mainDiv.removeChild(this.mainDiv.children[index]);
        this.playerDivs.splice(index, 1);
    }

    /**
     * @return {PlayerDiv}
     */
    GetPlayerDiv(name) {
        for(const pDiv of this.playerDivs) {
            if(pDiv.nameDiv.mainDiv.textContent == name)
                return pDiv;
        }

        console.error("No players found in Scoreboard with name '" + name + "'");
        return null;
    }

    SetMaxDivShown(number) {
        this.CountPlayerDivShown = number;
        if(this.mainDiv.children.length <= number)
            return;

        this.actualPlayerIDShown = this.mainDiv.children.length - number;
        for(let i = this.actualPlayerIDShown-1; i >= 0; i--)
            this.RemovePlayerDiv(i);

    }

    ShowNext() {
        this.RemovePlayerDiv(0);

        this.actualPlayerIDShown++;

        if (this.actualPlayerIDShown >= this.players.length)
            this.actualPlayerIDShown = 0;

        const lastIDShown =
            (this.actualPlayerIDShown + this.CountPlayerDivShown) % this.players.length;

        this.AddPlayerDiv(this.players[lastIDShown].name);
    }

    AddPlayerDiv(name) {
        const nPlayerDiv = new PlayerDiv(this.mainDiv, name, "");
        nPlayerDiv.onClick = () => {
            PlayerManager.Get().SelectPlayer(name);
        }

        nPlayerDiv.style.background = "var(--light)";
        nPlayerDiv.style.borderRadius = "10px";
        nPlayerDiv.style.paddingLeft = "0.25rem";
        nPlayerDiv.style.paddingRight = "0.25rem";
        nPlayerDiv.style.width = "100%";
        nPlayerDiv.style.display = "flex";
        nPlayerDiv.style.flexDirection = "column";
        nPlayerDiv.style.alignItems = "center";

        nPlayerDiv.nameDiv.style.background = "var(--orange)";
        nPlayerDiv.nameDiv.style.color = "white";
        nPlayerDiv.nameDiv.mainDiv.classList.add("font_large");
        nPlayerDiv.nameDiv.style.borderRadius = "5px";
        nPlayerDiv.nameDiv.style.margin = "0.25rem";
        nPlayerDiv.nameDiv.style.width = "100%";
        nPlayerDiv.nameDiv.style.height = "2rem";
        nPlayerDiv.nameDiv.style.display = "flex";
        nPlayerDiv.nameDiv.style.alignItems = "center";
        nPlayerDiv.nameDiv.style.justifyContent = "center";
        nPlayerDiv.nameDiv.style.marginBottom = "0.5rem";

        nPlayerDiv.scoreDiv.style.display = "flex";
        nPlayerDiv.scoreDiv.style.flexDirection = "column";
        nPlayerDiv.scoreDiv.style.alignItems = "center";
        nPlayerDiv.scoreDiv.totalScoreDiv.classList.add("font_heavy");
        nPlayerDiv.scoreDiv.totalScoreDiv.style.marginBottom = "0.25rem";

        this.playerDivs.push(nPlayerDiv);
        nPlayerDiv.Update(PlayerManager.Get().GetPlayer(name));
    }

    /**
     * @param {Player} player
     */
    AddPlayer(player) {
        if(IsNullOrUndefined(player))
            console.log("Player added to ScoreBoard is undefined :"+player);
        this.players.push(player);

        this.AddPlayerDiv(player.name);
    }

    UpdateScores() {
        const players = PlayerManager.Get().players;

        for(let i = 0; i < players.length; i++) {
            const p = players[i];
            const pDiv = this.playerDivs[i];
            pDiv.Update(p);
        }
    }

    HighLightPlayer(name, color) {
        const pDiv = this.GetPlayerDiv(name);
        pDiv.mainDiv.style.background = color;
    }
}

class PlayerManager extends Singleton {
    constructor() {
        super();

        this.players = [];
        this.actualPlayer = null;
    }

    /**
     * @param {string} name
     * @return {Player}
     */
    GetPlayer(name) {
        for(const p of this.players) {
            if(p.name == name)
                return p;
        }
        console.error("No players found in PlayerManager with name '" + name + "'");
        return null;
    }

    CreatePlayer(name) {
        const p = new Player(name);
        this.players.push(p);
        return p;
    }

    AddScoreToPlayer(name, score) {
        const p = this.GetPlayer(name);
        p.AddScore(score);
    }

    ClearSelect() {
        if(this.actualPlayer)
            Scoreboard.Get().HighLightPlayer(this.actualPlayer.name, "var(--light)");
    }
    SelectPlayer(name) {
        this.ClearSelect();
        this.actualPlayer = this.GetPlayer(name);
        Scoreboard.Get().HighLightPlayer(this.actualPlayer.name, "var(--light-red)");
    }
}



document.addEventListener('DOMContentLoaded', () => {

    const pManager = new PlayerManager();
    const scoreboard = new Scoreboard();

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

    p1.AddScore(50);
    p1.AddScore(250);
    p1.AddScore(-100);
    p2.AddScore(-50);
    p2.AddScore(110);
    p2.AddScore(100);

    scoreboard.UpdateScores();
    scoreboard.SetMaxDivShown(4);

    const b1 = document.createElement("button");
    b1.textContent = "Next";
    document.body.appendChild(b1);
    b1.addEventListener("click", () => { scoreboard.ShowNext(); });
})