
document.addEventListener('DOMContentLoaded', function(){

    const main = document.querySelector("main");

    const PLAYER_ROLE =
        {
            DEFENDER : 0,
            CALLED : 1,
            ATTACKER : 2
        };

    function roundToMultipleOf(x, multiple) {
        if(x === 0)
            return 0;
        return multiple * Math.round(x/multiple);
    }

    class Player {
        constructor(name) {
            this.nameElement = document.createElement('p');
            this.nameElement.style.margin = '0.25rem';
            this.nameElement.textContent = name;
            this.nameElement.style.borderRadius = '4px';
            this.nameElement.style.padding = '0.5rem';
            this.nameElement.style.color = 'white';
            this.nameElement.style.backgroundColor = '#eb5e28';
            this.nameElement.style.fontWeight = 'bold';

            this.scoreElement = document.createElement('div');

            this.ps = document.createElement('p');
            this.ps.style.margin = '0';
            this.ps.style.fontWeight = 'bold';
            this.ps.style.fontSize = '1.5rem';
            this.ps.textContent = '0';

            this.scoreElement.appendChild(this.ps);

            this.name = name;
            this.scoreList = [0];
            this.totalScore = 0;
            this.role = PLAYER_ROLE.DEFENDER;
        }
        
        resetScore() {
            
            this.totalScore = 0;
            this.ps.textContent = 0;
            while(this.scoreElement.children.length > 1)
            {
                this.scoreElement.removeChild(this.scoreElement.lastChild);
            }
        }

        addPoints(points) {
            this.scoreList.push(points);
            this.totalScore += points;
            this.ps.textContent = this.totalScore;

            const ps = document.createElement('p');
            ps.style.margin = '0';
            ps.textContent = points;

            this.scoreElement.insertBefore(ps, this.ps)
            //this.scoreElement.appendChild(ps);
        }

        setRole(role) {
            this.nameElement.style.backgroundColor = 'var(--orange)';

            switch (role) {
                case PLAYER_ROLE.DEFENDER:
                {
                    this.nameElement.style.backgroundColor = 'var(--orange)';
                    this.role = PLAYER_ROLE.DEFENDER;
                    break;
                }
                case PLAYER_ROLE.CALLED:
                {
                    this.nameElement.style.backgroundColor = 'blue';
                    this.role = PLAYER_ROLE.CALLED;
                    break;
                }
                case PLAYER_ROLE.ATTACKER:
                {
                    this.nameElement.style.backgroundColor = 'red';
                    this.role = PLAYER_ROLE.ATTACKER;
                    break;
                }
                default:
                {
                    this.nameElement.style.backgroundColor = 'var(--orange)';
                    this.role = PLAYER_ROLE.DEFENDER;
                    break;
                }
            }
        }
    }
    class Scoreboard {
        static instance = null

        constructor() {
            if (Scoreboard.instance)
                return Scoreboard.instance;
            Scoreboard.instance = this;

            this.element = document.createElement("div");
            this.element.id = 'scoreboard';
            main.appendChild(this.element);

            this.managePlayerDiv = document.createElement("div");
            this.managePlayerDiv.style.display = 'flex';
            this.managePlayerDiv.style.flexDirection = 'row';
            this.managePlayerDiv.style.alignItems = 'center';
            this.element.appendChild(this.managePlayerDiv);

            const add = document.createElement("p");
            add.id = 'add_player';
            add.style.backgroundColor = 'var(--clickable_dark)';
            add.style.color = 'white';
            add.style.fontWeight = 'bold';
            add.style.fontSize = '1.5rem';
            add.style.paddingLeft = '.5rem';
            add.style.paddingRight = '.5rem';
            add.style.borderRadius = '1.5rem';
            add.textContent = "+";

            this.img = document.createElement("img");
            this.img.src = "people.png";
            this.img.style.maxWidth = "100px";
            this.img.style.maxHeight = "100px";

            const remove = document.createElement("p");
            remove.id = 'remove_player';
            remove.textContent = "-";
            remove.style.backgroundColor = 'var(--clickable_dark)';
            remove.style.color = 'white';
            remove.style.fontWeight = 'bold';
            remove.style.fontSize = '1.5rem';
            remove.style.paddingLeft = '.7rem';
            remove.style.paddingRight = '.7rem';
            remove.style.borderRadius = '1.5rem';

            this.players = [];

            add.addEventListener('click', () => {

                if(this.players.length == 5)
                {
                    alert("Le nombre maximal de joueurs est 5.")
                    return;
                }

                const playerName = prompt("Entrez le nom du joueur :");
                if (playerName) {

                    const nPlayer = new Player(playerName);
                    scoreboard.addPlayer(nPlayer);
                    announcements.addPlayer(nPlayer);
                    ChelemManager.getInstance().buildChelemPlayerSelect();
                    TheOne.getInstance().buildTheOneSelect();
                }
            });
            remove.addEventListener('click', function() {
                const playerName = prompt("Entrez le nom du joueur à retirer :");
                if (playerName) {
                    scoreboard.removePlayer(playerName);
                    announcements.removePlayer(playerName);
                    ChelemManager.getInstance().buildChelemPlayerSelect();
                    TheOne.getInstance().buildTheOneSelect();
                }
            });

            this.managePlayerDiv.appendChild(add);
            this.managePlayerDiv.appendChild(this.img);
            this.managePlayerDiv.appendChild(remove);

            this.playerTexts = document.createElement("div");
            this.playerTexts.style.display = 'flex';
            this.playerTexts.style.flexDirection = 'row';
            this.playerTexts.style.justifyContent = 'center';
            this.playerTexts.style.margin = '0';
            this.playerTexts.style.minWidth = '100%';

            this.element.appendChild(this.playerTexts);
        }

        static getInstance() {
            if(Scoreboard.instance == null)
                Scoreboard.instance = new Scoreboard();
            return Scoreboard.instance;
        }

        getPlayerIndexByName(name) {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].name === name) {
                    return i;
                }
            }
            return -1; // Player not found
        }

        CBPlayerNameClicked(event) {
            const playerIndex = this.getPlayerIndexByName(event.target.textContent);
            if(playerIndex == -1) return;

            const thisPlayer = this.players[playerIndex];

            // Attacker
            if(this.hasAttackerDefined() == false)
            {
                this.setAttacker(playerIndex);
                return;
            }
            if(this.hasAttackerDefined() && thisPlayer.role == PLAYER_ROLE.ATTACKER)
            {
                this.clearAttacker();
                thisPlayer.setRole(PLAYER_ROLE.DEFENDER);
                return;
            }

            // Called
            if(this.players.length == 5)
            {
                if(this.hasAttackerDefined() && thisPlayer.role != PLAYER_ROLE.CALLED)
                {
                    this.setCalled(playerIndex);
                    return;
                }
                if(this.hasAttackerDefined() && thisPlayer.role == PLAYER_ROLE.CALLED)
                {
                    this.clearCalled()
                    thisPlayer.setRole(PLAYER_ROLE.DEFENDER);
                    return;
                }
            }

            // Defender
            thisPlayer.setRole(PLAYER_ROLE.DEFENDER);
        }

        addPlayer(player) {

            const pDiv = document.createElement("div");
            pDiv.style.textAlign = "center";
            pDiv.style.margin = "0";
            pDiv.style.width = "100%";
            pDiv.style.backgroundColor = "#f2f2f2";
            pDiv.style.borderRadius = "4px";
            pDiv.appendChild(player.nameElement);
            pDiv.appendChild(player.scoreElement);

            player.nameElement.addEventListener('click', (event) => {
                this.CBPlayerNameClicked(event);
                updateRecapMessages();
            });

            this.playerTexts.appendChild(pDiv);

            this.players.push(player);
        }

        removePlayer(playerName) {
            const index = this.getPlayerIndexByName(playerName);
            if (index !== -1) {
                this.players = this.players.filter(player => player.name !== index)
                this.playerTexts.removeChild(this.playerTexts.children[index]);
            }
            this.players = this.players.filter(player => player.name !== playerName);
        }

        getPlayerScore(playerName) {
            const player = this.players.find(player => player.name === playerName);
            if(!player) return 0;
            return player.totalScore;
        }
        addPlayerScore(playerName, score) {
            const playerIndex = this.getPlayerIndexByName(playerName);
            if (playerIndex !== -1) {
                const player = this.players[playerIndex];
                player.addPoints(score);
            }
        }

        hasAttackerDefined() {
            for (let i = 0; i < this.players.length; i++)
                if(this.players[i].role == PLAYER_ROLE.ATTACKER) return true;
            return false;
        }
        hasCalledDefined() {
            for (let i = 0; i < this.players.length; i++)
                if(this.players[i].role == PLAYER_ROLE.CALLED) return true;
            return false;
        }

        clearAttacker() {
            for (let i = 0; i < this.players.length; i++)
            {
                if(this.players[i].role == PLAYER_ROLE.ATTACKER)
                    this.players[i].setRole(PLAYER_ROLE.DEFENDER);
            }
        }
        clearCalled() {
            for (let i = 0; i < this.players.length; i++)
                if(this.players[i].role == PLAYER_ROLE.CALLED)
                    this.players[i].setRole(PLAYER_ROLE.DEFENDER);
        }
        setAttacker(playerIndex) {
            this.clearAttacker();
            this.players[playerIndex].setRole(PLAYER_ROLE.ATTACKER);
        }
        setCalled(playerIndex) {
            this.clearCalled();
            this.players[playerIndex].setRole(PLAYER_ROLE.CALLED);
        }
    }

    class PlayerHandfulData {
        constructor(name, role, value) {
            this.role = role;
            this.value = value;
            this.name = name;
        }
    }
    class PlayerMisereData {
        constructor(name, value) {
            this.value = value;
            this.name = name;
        }
    }
    class AnnouncementManager {

        static instance = null;

        constructor() {
            if(AnnouncementManager.instance)
                return AnnouncementManager.instance;

            AnnouncementManager.instance = this;

            this.playerHandful = [];
            this.playerMiseres = [];
        }

        static getInstance() {
            if(AnnouncementManager.instance == null)
                AnnouncementManager.instance = new AnnouncementManager();
            return AnnouncementManager.instance;
        }

        addPlayer(player) {
            this.playerHandful.push(new PlayerHandfulData(player.name, PLAYER_ROLE.DEFENDER, 0));
            this.playerMiseres.push(new PlayerMisereData(player.name, 0));

            const divAnn = document.createElement('div');
            divAnn.style.display = "flex";
            divAnn.style.flexDirection = "column";

            // Select
            // miseres
            const selectMisere = document.createElement("select");
            selectMisere.addEventListener("change", (event) => {
                this.setPlayerMiseres(player.name, parseInt(event.target.value))
            });
            divAnn.appendChild(selectMisere);

            const option0_1 = document.createElement("option");
            option0_1.textContent = "❌";
            option0_1.value = "0";
            const optionM1 = document.createElement("option");
            optionM1.textContent = "✨";
            optionM1.value = "10";
            const optionM2 = document.createElement("option");
            optionM2.textContent = "👑";
            optionM2.value = "10";
            const optionM3 = document.createElement("option");
            optionM3.textContent = "✨👑";
            optionM3.value = "20";

            selectMisere.appendChild(option0_1);
            selectMisere.appendChild(optionM1);
            selectMisere.appendChild(optionM2);
            selectMisere.appendChild(optionM3);

            //annonces
            const selectHandful = document.createElement("select");
            selectHandful.addEventListener("change", (event) => {
                this.setPlayerHandful(player.name, player.role, parseInt(event.target.value))
            });
            divAnn.appendChild(selectHandful);

            const option0_2 = document.createElement("option");
            option0_2.textContent = "❌";
            option0_2.value = "0";
            const optionP1 = document.createElement("option");
            optionP1.textContent = "✋x1";
            optionP1.value = "20";
            const optionP2 = document.createElement("option");
            optionP2.textContent = "✋x2";
            optionP2.value = "30";
            const optionP3 = document.createElement("option");
            optionP3.textContent = "✋x3";
            optionP3.value = "40";

            selectHandful.appendChild(option0_2);
            selectHandful.appendChild(optionP1);
            selectHandful.appendChild(optionP2);
            selectHandful.appendChild(optionP3);

            player.nameElement.parentNode.appendChild(divAnn);
        }

        removePlayer(playerName) {
            this.playerHandful = this.playerHandful.filter(p => p.name !== playerName);
            this.playerMiseres = this.playerMiseres.filter(p => p.name !== playerName);
        }

        setPlayerHandful(playerName, playerRole, value) {
            const data = this.playerHandful.find(p => p.name === playerName);
            data.value = value;
            data.role = playerRole;
        }
        setPlayerMiseres(playerName, value) {
            const data = this.playerMiseres.find(p => p.name === playerName);
            data.value = value;
        }
        getHandfulValue(playerName) {
            return this.playerHandful.find(player => player.name === playerName).value;
        }
        getMiseresValue(playerName) {
            return this.playerMiseres.find(player => player.name === playerName).value;
        }
        
        resetValues() {
            for(let data of this.playerMiseres)
                this.setPlayerMiseres(data.name, 0);            
            for(let data of this.playerHandful)
                this.setPlayerHandful(data.name, 0, 0);
        }

    }
    class ChelemManager {

        static instance = null;

        constructor() {
            if (ChelemManager.instance)
                return ChelemManager.instance;
            ChelemManager.instance = this;
        }

        init() {
            this.div = document.createElement("div");
            this.div.style.display = "flex";
            this.div.style.flexDirection = "row";
            this.div.style.alignItems = "center";
            main.appendChild(this.div)

            const p1 = document.createElement("p");
            p1.textContent = "Chelem pour";
            p1.style.margin = "0";
            p1.style.marginRight = "0.5rem";
            this.div.appendChild(p1)

            this.selectPlayer = document.createElement("select");
            this.selectPlayer.style.marginRight = "0.5rem";
            this.selectPlayer.addEventListener("change", (event) => {
                updateRecapMessages();
            })
            this.div.appendChild(this.selectPlayer);


            this.selectValue = document.createElement("select");
            this.selectValue.addEventListener("change", (event) => {
                updateRecapMessages();
            })
            this.div.appendChild(this.selectValue);

            const option0 = document.createElement("option");
            option0.textContent = "Aucun";
            option0.value = "0";
            const option1 = document.createElement("option");
            option1.textContent = "Réussi non annoncé";
            option1.value = "200";
            const option2 = document.createElement("option");
            option2.textContent = "Réussi et annoncé";
            option2.value = "400";
            const option3 = document.createElement("option");
            option3.textContent = "Non réussi";
            option3.value = "-200";

            this.selectValue.appendChild(option0);
            this.selectValue.appendChild(option1);
            this.selectValue.appendChild(option2);
            this.selectValue.appendChild(option3);

            const option0_2 = document.createElement("option");
            option0_2.textContent = "Personne";
            option0_2.value = "0";
            this.selectPlayer.appendChild(option0_2);

            this.buildChelemPlayerSelect();
        }

        static getInstance() {
            return ChelemManager.instance;
        }

        buildChelemPlayerSelect() {
            this.selectPlayer.innerHTML = ''; // clear

            this.selectPlayer.appendChild(new Option("Personne", "0"));

            for (const player of Scoreboard.getInstance().players) {
                this.selectPlayer.appendChild(
                    new Option(player.name, player.name)
                );
            }
        }
        
        getValue() {
            return this.selectValue.value;
        }
        
        getValuePlayerName() {
            return this.selectPlayer.value;
        }

        applyChelemPoints(teams, scores) {
            const scoreboard = Scoreboard.getInstance();
            const pIndex = scoreboard.getPlayerIndexByName(this.getValuePlayerName())
            const player = scoreboard.players[pIndex];
            const value = parseInt(this.getValue());

            if (value === 0)
                return;
            if (player === undefined)
                return;

            let team;
            let otherTeam;
            let teamScore;
            let otherScore;

            for(let i = 0; i < teams.length; i++)
            {
                for(let j = 0; j < teams[i].length; j++)
                {
                    if(teams[i][j].name !== player.name) continue;
                    let idTeam = i;
                    let idOther = -1;
                    if(i === 0)
                        idOther = 1;
                    else
                        idOther = 0;

                    team = teams[idTeam];
                    otherTeam = teams[idOther] ;
                    teamScore = scores[idTeam];
                    otherScore = scores[idOther];
                    break;
                }
            }

            for(let i = 0; i < team.length; i++) {
                if(player.name !== team[i].name) continue;
                teamScore[i] += value;
                break;
            }
            for(let i = 0; i < otherTeam.length; i++)
                otherScore[i] -= value/otherTeam.length;
        }
    }
    class TheOne {

        static instance = null;

        constructor() {
            if(TheOne.instance)
                return TheOne.instance;
            TheOne.instance = this;
        }

        static getInstance() {
            return TheOne.instance;
        }

        init() {
            this.scoreboard = Scoreboard.getInstance();

            this.div = document.createElement("div");
            this.div.style.display = "flex";
            this.div.style.flexDirection = "row";
            this.div.style.alignItems = "center";
            main.appendChild(this.div)

            const p = document.createElement("p");
            p.textContent = "Petit au bout pour";
            p.style.margin = "0";
            p.style.marginRight = "0.5rem";
            this.div.appendChild(p)

            this.selectPlayer = document.createElement("select");
            this.selectPlayer.addEventListener("change", (event) => {
                updateRecapMessages();
            })
            this.div.appendChild(this.selectPlayer);

            const option0_2 = document.createElement("option");
            option0_2.textContent = "Personne";
            option0_2.value = "0";
            this.selectPlayer.appendChild(option0_2);

            this.buildTheOneSelect();
        }

        buildTheOneSelect() {
            this.selectPlayer.innerHTML = ''; // clear

            this.selectPlayer.appendChild(new Option("Personne", "0"));

            for (const player of Scoreboard.getInstance().players) {
                this.selectPlayer.appendChild(
                    new Option(player.name, player.name)
                );
            }
        }

        getPlayerName() {
            return this.selectPlayer.value;
        }

        applyTheOne(teams, scores, contractFactor) {
            const playerName = this.getPlayerName();
            if(playerName === "0")
                return;

            console.log("player name ", playerName);

            let otherTeam;
            let teamScore;
            let playerScoreIndex;
            let otherScore;

            for(let i = 0; i < teams.length; i++)
            {
                for(let j = 0; j < teams[i].length; j++){
                    if(playerName !== teams[i][j].name) continue;

                    teamScore = scores[i];
                    playerScoreIndex = j;
                    otherTeam = teams[i] === teams[0] ? teams[1] : teams[0];
                    otherScore = scores[i] === scores[0] ? scores[1] : scores[0];
                }
            }

            const theOneValue = 10 * contractFactor;

            teamScore[playerScoreIndex] += theOneValue * otherTeam.length;
            for(let i = 0; i < otherTeam.length; i++) {
                otherScore[i] -= 10 * contractFactor;
            }
        }
    }

    class NumberInput {
        constructor(elementID, min, max, step = 1, initialValue = 0, parentNode = null){
            this.input = document.createElement("input");
            if(parentNode === null || parentNode === undefined)
                document.body.querySelector("main").appendChild(this.input);
            else
                parentNode.appendChild(this.input);

            this.input.type = "number";
            this.input.min = min.toString();
            this.input.max = max.toString();
            this.input.step = step.toString();
            this.input.value = initialValue.toString();
        }

        getValue() {
            return parseInt(this.input.value);
        }
        setValue(newValue) {
            this.input.value = newValue.toString();
        }
    }
    class Slider {
        constructor(elementId, name, min, max, step = 1, initialValue = 0) {
            this.divElement = document.createElement("div");
            this.divElement.style.backgroundColor = "var(--clickable_light)";

            const divTop = document.createElement("div");
            divTop.style.display = "flex";
            divTop.style.flexDirection = "row";
            divTop.style.justifyContent = "center";
            this.divElement.appendChild(divTop);

            this.label = document.createElement("label");
            this.label.htmlFor = elementId;
            this.label.style.display = "flex";
            this.label.style.alignItems = "center";
            this.label.style.textAlign = "center";
            this.label.style.gap = "0.5rem";

            divTop.appendChild(this.label);

            this.span = [];
            if(Array.isArray(name)) {
                this.label.style.display = "flex";
                this.label.style.flexDirection = "row";
                this.label.style.gap = "5rem";

                for(let i = 0; i < name.length; i++)
                {
                    const labelDiv = document.createElement("div");
                    this.label.appendChild(labelDiv);
                    labelDiv.style.display = "flex";
                    labelDiv.style.flexDirection = "column";

                    const span = document.createElement("span")
                    this.span.push(span);
                    span.id = name[i].toLowerCase()+i.toString();

                    const textNode = document.createTextNode((i == 0 ? "" : " ") +name[i]+" ");
                    labelDiv.appendChild(textNode);

                    this.label.style.fontWeight = "bold";
                    this.label.style.fontSize = "1.5rem";
                    labelDiv.appendChild(span);

                }
            }
            else {
                const span = document.createElement("span")
                this.span.push(span);
                span.id = name.toLowerCase();
                this.label.appendChild(document.createTextNode(name+" "));
                this.label.style.fontWeight = "bold";
                this.label.style.fontSize = "1.5rem";
                this.label.appendChild(span);
            }

            const divButton = document.createElement("div");
            this.divElement.appendChild(divButton);
            divButton.style.display = "flex";
            divButton.style.flexDirection = "row";
            divButton.style.backgroundColor = "var(--clickable_light2)";
            divButton.style.borderRadius = "10px";

            this.sub = document.createElement("button");
            this.sub.style.fontSize = "1.5rem";
            this.sub.style.fontWeight = "bold";
            this.sub.style.margin = "0";
            this.sub.style.borderTopLeftRadius = "10px";
            this.sub.style.borderBottomLeftRadius = "10px";
            this.sub.style.borderTopRightRadius = "0px";
            this.sub.style.borderBottomRightRadius = "0px";

            this.sub.textContent = "-";
            this.sub.addEventListener('click', () => {
                this.input.stepDown();
                updateRecapMessages();
            });
            divButton.appendChild(this.sub);
            this.add = document.createElement("button");
            this.add.style.fontSize = "1.5rem";
            this.add.style.fontWeight = "bold";
            this.add.style.margin = "0";
            this.add.style.borderTopLeftRadius = "0px";
            this.add.style.borderBottomLeftRadius = "0px";
            this.add.style.borderTopRightRadius = "10px";
            this.add.style.borderBottomRightRadius = "10px";
            this.add.textContent = "+";

            this.add.addEventListener('click', () => {
                this.input.stepUp();
                updateRecapMessages();
            });


            this.input = document.createElement("input");
            this.input.min = min;
            this.input.max = max;
            this.input.type = "range";
            this.input.className = "custom-slider";
            this.input.step = step.toString();
            this.input.value = initialValue.toString();
            this.input.style.width = '100%';
            this.input.style.margin = '0';
            this.input.addEventListener('input', updateRecapMessages);

            divButton.appendChild(this.sub);
            divButton.appendChild(this.input);
            divButton.appendChild(this.add);

            main.appendChild(this.divElement);
        }
        getValue() {
            return parseInt(this.input.value);
        }
        setValue(value) {
            this.input.value = value;
            updateRecapMessages();
        }
        setValueText(value) {
            if (Array.isArray(value)) {
                for(let i = 0; i < value.length; i++)
                {
                    if (this.span[i]) {
                        this.span[i].textContent = value[i].toString();
                    }
                }
            } else {
                this.span[0].textContent = value;
            }
        }
    }
    class InputSelect {

        constructor(name, valueNames) {
            this.divElement = document.createElement("div");
            document.querySelector("main").appendChild(this.divElement);
            this.divElement.style.display = "flex";
            this.divElement.style.flexDirection = "row";
            this.divElement.style.backgroundColor = "#f2f2f2";
            this.divElement.style.borderRadius = "4px";

            // clair #f2f2f2
            // foncé #5c5c5c

            this.text = document.createElement("p");
            this.divElement.appendChild(this.text);
            this.text.textContent = name;
            this.text.style.fontWeight = "bold";
            this.text.style.fontSize = "1.5rem";

            this.select = document.createElement("select");
            this.select.id = name.toLowerCase();
            this.select.addEventListener("change", () => {
                updateRecapMessages();
            })
            this.divElement.appendChild(this.select);
            this.select.style.width = "100%";
            this.select.style.fontWeight = "bold";
            this.select.style.fontSize = "1.5rem";

            for(let i = 0; i < valueNames.length; i++) {
                const option = document.createElement("option");
                option.textContent = valueNames[i];
                option.value = i.toString();
                this.select.appendChild(option);
            }
        }

        getValue() {
            return parseInt(this.select.value);
        }
        setValue(value) {
            this.select.value = value;
            updateRecapMessages();
        }
        setValueText(value) {
            //todo
        }
    }

    function createTexts() {
        const win_text = document.createElement("p");
        win_text.id = "win_text";
        const score_text = document.createElement("p");
        score_text.id = "score_text";
        score_text.textContent = "Déplace les jauges pour obtenir un score.";
        const summary_text = document.createElement("p");
        summary_text.id = "summary_text";

        main.appendChild(win_text);
        main.appendChild(score_text);
        main.appendChild(summary_text);
    }

    function createButton(id, text) {
        const button = document.createElement("button")
        button.id = id;
        button.style.marginRight = "0.5rem";
        button.textContent = text;
        main.appendChild(button);
    }
    
    function createRulesText() {
        let div = document.createElement("div");
        div.id = "rules_text";
        div.style.margin = "0";
        main.appendChild(div);

        let p1 = document.createElement("p");
        div.appendChild(p1);
        p1.innerHTML += "Le prenant ne peut appeler qu'à 5 joueurs.";
        p1.innerHTML += '</br>';
        p1.innerHTML += "Valeurs des contrats selon la FFT: 25, 50, 100, 150.";
        p1.innerHTML += '</br>';
        p1.innerHTML += 'Une "annonce" est définie comme un pseudo contrat supplémentaire qui doit être annoncé au cours de la première volée.';
        p1.innerHTML += '</br>';
        p1.innerHTML += "Une annonce n'affecte pas les coéquipiers de l'annonceur, uniquement les adervsaires et l'annonceur.";
        p1.innerHTML += '</br>';
        p1.innerHTML += "La valeur d'une poignée est comptée comme 'valeur de la poignée' x 'nombre d'aversaires'.";
        p1.innerHTML += "Pour les poignées, il couviendra de montrer le nombre d'atouts corresdpondant à la poignée avavnt que l'annonceur ne joue sa première carte. ";
        p1.innerHTML += "L'excuse ne peut être montrée pour la poignée que si l'annonceur n'a pas d'autre atout à montrer. ";
        p1.innerHTML += "Le nombre d'atouts nécessaires pour annoncer des poignées change en fonction du nombre de joueurs et des règles appliquées, à vous de choisir.";
        p1.innerHTML += '</br>';
        p1.innerHTML += "Les misères sont indépendantes du résultat de la partie, ce sont des points garantis.";
        p1.innerHTML += '</br>';
        p1.innerHTML += "Le petit au bout est indépendant du résultat de la partie. Il donne à son preneur '10' x 'facteur du contrat' x 'taille de l'équipe adverse'.";
        p1.innerHTML += '</br>';
        p1.innerHTML += "Valeurs des annonces (misères) : 10, 10, 20.";
        p1.innerHTML += '</br>';
        p1.innerHTML += "Valeurs des annonces (poignées) : 20, 30, 40.";
        p1.innerHTML += '</br>';
        p1.innerHTML += "Valeurs des Chelems : -200(raté), 200(non annoncé), 400(réussi).";
        p1.innerHTML += '</br>';
        p1.innerHTML += "Un Chelem n'affecte pas les coéquipiers de l'annonceur.";
        p1.innerHTML += '</br>';
        p1.innerHTML += "Toutes la valeurs décrites sont arrondies en fonction du nombre de joueurs et de la situation.";
        p1.innerHTML += '</br>';
        p1.innerHTML += "Les règles présentées sont vouées à être modifiées.";
    }

    function createCustomRulesInputs() {

        const div = document.createElement("div");
        document.querySelector("main").appendChild(div);

        const p = document.createElement("p");
        div.appendChild(p);
        p.style.margin = "0";
        p.textContent = "Facteur des contrats (la valeur de la mise est 25)";

        const divInputs = document.createElement("div");
        div.appendChild(divInputs);
        divInputs.id = 'contract_factors';
        divInputs.style.display = "flex";
        divInputs.style.flexDirection = "row";

        const divInputLabel = [];
        for(let i = 0; i < 4; i++) {
            const nDiv = document.createElement("div");
            divInputs.appendChild(nDiv);

            nDiv.style.display = "flex";
            nDiv.style.flexDirection = "column";
            nDiv.style.textAlign = "center";
            nDiv.style.width = "100px";

            const p = document.createElement("p");
            p.style.margin = "0";
            nDiv.appendChild(p);
            divInputLabel.push(nDiv);
        }

        divInputLabel[0].children[0].textContent = "Petite/Pousse"
        const takeFacInput = new NumberInput('take_fac', 1, 10, 1, 1, divInputLabel[0]);
        divInputLabel[1].children[0].textContent = "Garde"
        const GuardFacInput = new NumberInput('guard_fac', 1, 10, 1, 2, divInputLabel[1]);
        divInputLabel[2].children[0].textContent = "Garde sans"
        const GuardWFacInput = new NumberInput('guard_without_fac', 1, 10, 1, 4, divInputLabel[2]);
        divInputLabel[3].children[0].textContent = "Garde contre"
        const GuardAFacInput = new NumberInput('guard_against_fac', 1, 10, 1, 6, divInputLabel[3]);

        return [takeFacInput, GuardFacInput, GuardWFacInput, GuardAFacInput];
    }

    const chelem = new ChelemManager();
    const theOne = new TheOne();
    const scoreboard = new Scoreboard();
    const announcements = new AnnouncementManager();

    const contractFactor = [1, 2, 4, 6];

    const contractSelect = new InputSelect("Contrat", ["Petite","Garde","Garde Sans","Garde Contre"]);
    contractSelect.divElement.style.marginTop = "2rem";
    const oudlerSelect = new InputSelect("Bouts", ["0","1","2","3"]);
    const scoreSlider = new Slider('score_slider', ["Attaque", "Défense"],0, 91, 1, 0);
    scoreSlider.divElement.style.marginBottom = "2rem";

    chelem.init(scoreboard);
    theOne.init(scoreboard);

    createTexts();
    
    createButton("add_points", "Appliquer les points");
    createButton("reset_points", "Repartir de 0");

    createRulesText();

    const factorsInputs = createCustomRulesInputs();
    document.getElementById('contract_factors').addEventListener('click', function() {
        for(let i = 0; i < factorsInputs.length; i++) {
            contractFactor[i] = factorsInputs[i].getValue();
        }
    })

    const winText = document.getElementById("win_text");
    const scoreText = document.getElementById('score_text');
    const summaryText = document.getElementById('summary_text');

    for(let i = 0; i < 5; i++) {
        let nPlayer = new Player("Joueur"+(i+1));
        scoreboard.addPlayer(nPlayer);
        announcements.addPlayer(nPlayer);
        chelem.buildChelemPlayerSelect();
        theOne.buildTheOneSelect();
    }

    contractSelect.setValue(0)
    oudlerSelect.setValue(0);
    scoreSlider.setValue(0);
    updateRecapMessages();

    function hasAttackWin() {
        let oudlerCount = oudlerSelect.getValue();
        let cardScore = scoreSlider.getValue();
        if(oudlerCount === 0 && cardScore >= 56) {
            return true;
        } if(oudlerCount === 1 && cardScore >= 51) {
            return true;
        } if(oudlerCount === 2 && cardScore >= 41) {
            return true;
        } if(oudlerCount === 3 && cardScore >= 36) {
            return true;
        }
        return false;
    }
    function hasPlayerWin(player) {

        let isAttacker = false;
        if(player.role == PLAYER_ROLE.ATTACKER || player.role == PLAYER_ROLE.CALLED)
            isAttacker = true;

        if(isAttacker && hasAttackWin())
            return true;
        if(isAttacker == false && hasAttackWin() == false)
            return true;

        return false;
    }

    function getRoundScore() {
        return scoreSlider.getValue();
    }
    function getTargetScoreForAttacker() {
        switch (oudlerSelect.getValue()) {
            case 0:
                return 56;
            case 1:
                return 51;
            case 2:
                return 41;
            case 3:
                return 36;
            default:
                return 0;
        }
    }
    function getDiffTargetScore() {
        return getRoundScore() - getTargetScoreForAttacker();
    }

    function getContractValue() {
        let contractIndex = contractSelect.getValue();
        const diff = getDiffTargetScore();
        if(diff > 0)
            return (diff + 25) * contractFactor[contractIndex];
        else
            return (diff - 25) * contractFactor[contractIndex];
    }

    function addContractToPlayer(team, scores, contractValue) {

        const teamFac = hasPlayerWin(team[0]) ? 1 : -1 ;

        for(let player of team) {
            switch(player.role)
            {
                case PLAYER_ROLE.DEFENDER:
                {
                    let contractRepartition = 0;
                    if(scoreboard.hasCalledDefined())
                        contractRepartition = teamFac*contractValue*1.5/team.length;
                    else
                        contractRepartition = teamFac*contractValue/team.length;
                    scores.push(contractRepartition);
                    break;
                }
                case PLAYER_ROLE.CALLED:
                {
                    const contractRepartition = teamFac*contractValue/2;
                    scores.push(contractRepartition);
                    break;
                }
                case PLAYER_ROLE.ATTACKER:
                {
                    const contractRepartition = teamFac*contractValue;
                    scores.push(contractRepartition);
                    break;
                }
            }

        }
    }

    function ComputePoints() {

        const scoreboard = Scoreboard.getInstance();
        const announcements = AnnouncementManager.getInstance();
        const chelem = ChelemManager.getInstance();
        const theOne = TheOne.getInstance();

        if(scoreboard == null || announcements == null ||chelem == null)
            return;

        let contractValue = getContractValue();
        let contractAbsValue = Math.abs(contractValue);
        let defenderCount = 0;
        for (const player of scoreboard.players) {
            if(player.role == PLAYER_ROLE.DEFENDER)
                defenderCount++;
        }

        if(scoreboard.hasCalledDefined())
            contractAbsValue = roundToMultipleOf(contractAbsValue, 6);
        else
            contractAbsValue = roundToMultipleOf(contractAbsValue, defenderCount);

        const loseTeam = [];
        const winTeam = [];
        for(const player of scoreboard.players) {
            if(hasPlayerWin(player))
            {
                winTeam.push(player);
                continue;
            }
            loseTeam.push(player);
        }

        const loseScores = [];
        const winScores = [];
        const teams = [loseTeam, winTeam];
        const scores  = [loseScores, winScores];

        //Contrats
        if(loseTeam.length > 0)
            addContractToPlayer(loseTeam, loseScores, contractAbsValue);
        if(winTeam.length > 0)
            addContractToPlayer(winTeam, winScores, contractAbsValue);

        //Annonces
        // Poignées perdues
        for(let i = 0; i < loseTeam.length; i++) {
            let player = loseTeam[i];
            const handful = announcements.getHandfulValue(player.name);
            loseScores[i] -= handful*winTeam.length;
            for(j = 0; j < winTeam.length; j++) {
                winScores[j] += handful;
            }
        }
        // Poignées réussies
        for(let i = 0; i < winTeam.length; i++) {
            let player = winTeam[i];
            const handful = announcements.getHandfulValue(player.name);
            winScores[i] += handful*(loseTeam.length !== 0 ? loseTeam.length : 1);
            for(let j = 0; j < loseTeam.length; j++) {
                loseScores[j] -= handful;
            }
        }
        // Misères
        for(let i = 0; i < 2; i++) {
            let team = teams[i];
            let score = scores[i];
            let otherTeam = ((teams[i] === teams[0]) ? teams[1] : teams[0])
            let otherScore = ((scores[i] === scores[0]) ? scores[1] : scores[0])
            for(let j = 0; j < team.length; j++) {
                let player = team[j];
                let misere = announcements.getMiseresValue(player.name);
                if(scoreboard.hasCalledDefined())
                    misere = roundToMultipleOf(misere, 6)
                else
                    misere = roundToMultipleOf(misere, (otherTeam.length !== 0 ? otherTeam.length : 1));
                score[j] += misere;
                for(let k = 0; k < otherTeam.length; k++) {
                    otherScore[k] -= misere/ (otherTeam.length !== 0 ? otherTeam.length : 1);
                }
            }
        }

        // Chelem
        chelem.applyChelemPoints(teams, scores);

        // petit
        theOne.applyTheOne(teams, scores, contractFactor[contractSelect.getValue()]);

        return [teams, scores];
    }

    // text and slider
    function updateSliderTextValues() {
        scoreSlider.setValueText([scoreSlider.getValue(), 91 - scoreSlider.getValue()]);
    }

    function updateRecapMessages() {

        updateSliderTextValues();

        const retValue = ComputePoints();

        let attackerScore = 0;
        if(retValue !== undefined)
        {
            const [teams, scores] = retValue;
            for(let i = 0; i < teams.length; i++) {
                for(let j = 0; j < teams[i].length; j++) {
                    const player = teams[i][j];
                    if(player.role !== PLAYER_ROLE.ATTACKER) continue;
                    attackerScore = scores[i][j];
                    break;
                }
            }
        }

        if (hasAttackWin()) {
            winText.textContent = "Victoire de l'attaque.";
            scoreText.textContent = "Score de " + scoreSlider.getValue() + " pour " + oudlerSelect.getValue() + " bouts.";
            summaryText.textContent = "Points pour le preneur : " + attackerScore;
        } else {
            winText.textContent = "Victoire de la défense.";
            scoreText.textContent =  "Score de " + scoreSlider.getValue() + " pour " + oudlerSelect.getValue() + " bouts.";
            summaryText.textContent = "Points pour le preneur : " + attackerScore;
        }
    }

    function resetSliders() {
        contractSelect.setValue(0);
        oudlerSelect.setValue(0);
        scoreSlider.setValue(0);
        announcements.resetValues()

        document.querySelectorAll("select").forEach(function(el) {
            el.selectedIndex = 0;
        })

        updateRecapMessages();

        winText.textContent = "";
        scoreText.textContent = "Déplace les jauges pour obtenir un score.";
    }

    //Add points
    document.getElementById('add_points').addEventListener('click', function() {
        if(scoreboard.hasAttackerDefined() === false)
        {
            alert("Veuillez définir un attaquant avant d'appliquer les points.");
            return;
        }
        if(scoreboard.players.length < 3)
        {
            alert("Le nombre minimal de joueurs est 3.");
            return;
        }


        // add to score
        const [teams, scores] = ComputePoints();
        for(let i = 0; i < teams.length; i++)
        {
            for(let j = 0; j < teams[i].length; j++)
            {
                scoreboard.addPlayerScore(teams[i][j].name, scores[i][j]);
            }
        }

        resetSliders();
        scoreboard.clearAttacker();
        scoreboard.clearCalled();
    });

    document.getElementById('reset_points').addEventListener('click', function() {
        for(let p of scoreboard.players)
            p.resetScore();
        resetSliders();
    });
})