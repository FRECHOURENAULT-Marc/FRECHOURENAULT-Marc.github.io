
document.addEventListener('DOMContentLoaded', function(){

    const main = document.querySelector("main");

    const PLAYER_ROLE =
        {
            DEFENDER : 0,
            CALLED : 1,
            ATTACKER : 2
        };

    function roundToMultipleOf(x, multiple) {
        return multiple * Math.round(x/multiple);
    }

    class Player {
        constructor(name, playerNumber) {
            this.nameElement = document.createElement('p');
            this.nameElement.id = 'p' + playerNumber;
            this.nameElement.style.margin = '0';
            this.nameElement.textContent = name;
            
            this.scoreElement = document.createElement('div');

            this.ps = document.createElement('p');
            this.ps.id = 'ps' + playerNumber + '_0';
            this.ps.style.margin = '0';
            this.ps.style.fontWeight = 'bold';
            this.ps.textContent = '0';

            this.scoreElement.appendChild(this.ps);

            this.name = name;
            this.scoreList = [0];
            this.totalScore = 0;
            this.role = PLAYER_ROLE.DEFENDER;
        }
        
        resetScore() {
            
            this.totalScore = 0;
            this.ps.textContent = this.totalScore;
            for(let i = 1; i < this.scoreElement.children.length; i++)
            {
                let score = this.scoreElement.children[i];
                this.scoreElement.removeChild(score);
            }
        }

        addPoints(points, playerNumber) {
            this.scoreList.push(points);
            this.totalScore += points;
            this.ps.textContent = this.totalScore;

            const ps = document.createElement('p');
            ps.id = 'ps' + playerNumber + "-" + this.scoreList.length;
            ps.style.margin = '0';
            ps.textContent = points;

            this.scoreElement.appendChild(ps);
        }

        setRole(role) {
            this.nameElement.style.color = 'black';
            this.nameElement.style.fontWeight = 'normal';

            switch (role) {
                case PLAYER_ROLE.DEFENDER:
                {
                    this.nameElement.style.color = 'black';
                    this.nameElement.style.fontWeight = 'normal';
                    this.role = PLAYER_ROLE.DEFENDER;
                    break;
                }
                case PLAYER_ROLE.CALLED:
                {
                    this.nameElement.style.color = 'blue';
                    this.nameElement.style.fontWeight = 'bold';
                    this.role = PLAYER_ROLE.CALLED;
                    break;
                }
                case PLAYER_ROLE.ATTACKER:
                {
                    this.nameElement.style.color = 'red';
                    this.nameElement.style.fontWeight = 'bold';
                    this.role = PLAYER_ROLE.ATTACKER;
                    break;
                }
                default:
                {
                    this.nameElement.style.color = 'black';
                    this.nameElement.style.fontWeight = 'normal';
                    this.role = PLAYER_ROLE.DEFENDER;
                    break;
                }
            }
        }
    }
    class Scoreboard {
        constructor() {
            this.element = document.createElement("div");
            this.element.id = 'scoreboard';

            main.appendChild(this.element);

            const add = document.createElement("p");
            add.id = 'add_player';
            add.textContent = "Ajouter un joueur";
            const remove = document.createElement("p");
            remove.id = 'remove_player';
            remove.textContent = "Supprimer un joueur";

            this.players = [];

            add.addEventListener('click', () => {

                if(this.players.length == 5)
                {
                    alert("Le nombre maximal de joueurs est 5.")
                    return;
                }

                const playerName = prompt("Entrez le nom du joueur :");
                if (playerName) {

                    const nPlayer = new Player(playerName, this.players.length);
                    scoreboard.addPlayer(nPlayer);
                    announcements.addPlayer(nPlayer);
                }
            });
            remove.addEventListener('click', function() {
                const playerName = prompt("Entrez le nom du joueur à retirer :");
                if (playerName) {
                    scoreboard.removePlayer(playerName);
                }
            });

            this.element.appendChild(add);
            this.element.appendChild(remove);

            this.playerTexts = document.createElement("div");
            this.playerTexts.style.display = 'flex';
            this.playerTexts.style.flexDirection = 'row';
            this.playerTexts.style.width = '100%';

            this.element.appendChild(this.playerTexts);
        }

        getPlayerIndexByName(name) {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].name === name) {
                    return i;
                }
            }
            return -1; // Player not found
        }

        CBPlayerNameClicked(event)
        {
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
            pDiv.style.flex = "1";
            pDiv.style.textAlign = "center";
            pDiv.appendChild(player.nameElement);
            pDiv.appendChild(player.scoreElement);

            player.nameElement.addEventListener('click', (event) => {this.CBPlayerNameClicked(event);});

            this.playerTexts.appendChild(pDiv);

            this.players.push(player);
        }

        removePlayer(playerName) {
            const index = this.getPlayerIndexByName(playerName);
            if (index !== -1) {
                this.playerNames.removeChild(this.playerNames.children[index]);
                this.playerScores.removeChild(this.playerScores.children[index]);
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
                player.addPoints(score, playerIndex);
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
        setAttacker(playerIndex)
        {
            this.clearAttacker();
            this.players[playerIndex].setRole(PLAYER_ROLE.ATTACKER);
        }
        setCalled(playerIndex)
        {
            this.clearCalled();
            this.players[playerIndex].setRole(PLAYER_ROLE.CALLED);
        }
    }

    class PlayerAnnouncementData
    {
        constructor(name, role, value) {
            this.role = role;
            this.value = value;
            this.name = name;
        }
    }
    class PlayerMisereData
    {
        constructor(name, value) {
            this.value = value;
            this.name = name;
        }
    }
    class AnnouncementManager
    {

        constructor()
        {
            this.playerAnnouncecements = [];
            this.playerMiseres = [];
        }

        addPlayer(player)
        {
            this.playerAnnouncecements.push(new PlayerAnnouncementData(player.name, PLAYER_ROLE.DEFENDER, 0));
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
            option0_1.textContent = "Aucune";
            option0_1.value = "0";
            const optionM1 = document.createElement("option");
            optionM1.textContent = "Misère Atouts";
            optionM1.value = "10";
            const optionM2 = document.createElement("option");
            optionM2.textContent = "Misère Figures";
            optionM2.value = "10";
            const optionM3 = document.createElement("option");
            optionM3.textContent = "Misère Atouts & Figures";
            optionM3.value = "20";

            selectMisere.appendChild(option0_1);
            selectMisere.appendChild(optionM1);
            selectMisere.appendChild(optionM2);
            selectMisere.appendChild(optionM3);

            //annonces
            const selectAnnouncement = document.createElement("select");
            selectAnnouncement.addEventListener("change", (event) => {
                this.setPlayerAnnouncement(player.name, player.role, parseInt(event.target.value))
            });
            divAnn.appendChild(selectAnnouncement);

            const option0_2 = document.createElement("option");
            option0_2.textContent = "Aucune";
            option0_2.value = "0";
            const optionP1 = document.createElement("option");
            optionP1.textContent = "Poignée Simple";
            optionP1.value = "20";
            const optionP2 = document.createElement("option");
            optionP2.textContent = "Poignée Double";
            optionP2.value = "30";
            const optionP3 = document.createElement("option");
            optionP3.textContent = "Poignée Triple";
            optionP3.value = "40";

            selectAnnouncement.appendChild(option0_2);
            selectAnnouncement.appendChild(optionP1);
            selectAnnouncement.appendChild(optionP2);
            selectAnnouncement.appendChild(optionP3);

            player.nameElement.parentNode.appendChild(divAnn);
        }

        setPlayerAnnouncement(playerName, playerRole, value)
        {
            const data = this.playerAnnouncecements.find(p => p.name === playerName);
            data.value = value;
            data.role = playerRole;
        }
        setPlayerMiseres(playerName, value)
        {
            const data = this.playerMiseres.find(p => p.name === playerName);
            data.value = value;
        }
        getAnnouncementValue(playerName)
        {
            return this.playerAnnouncecements.find(player => player.name === playerName).value;
        }
        getMiseresValue(playerName)
        {
            return this.playerMiseres.find(player => player.name === playerName).value;
        }
        
        resetValues()
        {
            for(let data of this.playerMiseres)
                this.setPlayerMiseres(data.name, 0);            
            for(let data of this.playerAnnouncecements)
                this.setPlayerAnnouncement(data.name, 0, 0);
        }

    }
    class ChelemManager
    {
        constructor(scoreboard)
        {
            this.scoreboard = scoreboard;
            
            this.div = document.createElement("div");
            this.div.style.display = "flex";
            this.div.style.flexDirection = "row";
            main.appendChild(this.div)
            
            const p = document.createElement("p");
            p.textContent = "Chelem";
            this.div.appendChild(p)
            
            this.selectValue = document.createElement("select");
            this.div.appendChild(this.selectValue);
            
            this.selectPlayer = document.createElement("select");
            this.selectPlayer.addEventListener("click", (event) => {
                this.buildChelemPlayerSelect(this.scoreboard.players)
            })

            this.div.appendChild(this.selectPlayer);

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
            
            this.buildChelemPlayerSelect(this.scoreboard.players);
        }
        
        buildChelemPlayerSelect(players)
        {
            for(let i = 1; i < this.selectPlayer.length; i++)
            {
                let opt = this.selectPlayer[i];
                this.selectPlayer.removeChild(opt);
            }
                
            
            for(let i = 0; i < players.length; i++)
            {
                let opt = document.createElement("option");
                opt.textContent = players[i].name;
                opt.value = players[i].name;
                this.selectPlayer.appendChild(opt);
            }
        }
        
        getValue()
        {
            return this.selectValue.value;
        }
        
        applyChelemPoints(team, otherTeam)
        {
            //to do
        }
    }

    class Slider {
        constructor(elementId, name, min, max, step = 1, initialValue = 0) {
            this.divElement = document.createElement("div");

            const divTop = document.createElement("div");
            divTop.style.display = "flex";
            divTop.style.flexDirection = "row";
            const divButton = document.createElement("div");
            divTop.appendChild(divButton);
            this.divElement.appendChild(divTop);

            this.sub = document.createElement("button");
            this.sub.textContent = "-";
            this.sub.addEventListener('click', () => {
                this.input.stepDown();
                updateRecapMessages();
            });
            divButton.appendChild(this.sub);

            this.add = document.createElement("button");
            this.add.textContent = "+";
            this.add.addEventListener('click', () => {
                this.input.stepUp();
                updateRecapMessages();
            });
            divButton.appendChild(this.add);

            this.label = document.createElement("label");
            this.label.htmlFor = elementId;
            this.label.style = "display: block; margin-bottom: 10px";
            divTop.appendChild(this.label);

            this.span = [];
            if(Array.isArray(name))
            {
                for(let i = 0; i < name.length; i++)
                {
                    const span = document.createElement("span")
                    this.span.push(span);
                    span.id = name[i].toLowerCase()+i.toString();
                    this.label.appendChild(document.createTextNode((i == 0 ? "" : " ") +name[i]+" "));
                    this.label.appendChild(span);
                }
            }
            else
            {
                const span = document.createElement("span")
                this.span.push(span);
                span.id = name.toLowerCase();
                this.label.appendChild(document.createTextNode(name+" "));
                this.label.appendChild(span);
            }

            this.input = document.createElement("input");
            this.input.min = min;
            this.input.max = max;
            this.input.type = "range";
            this.input.step = step.toString();
            this.input.value = initialValue.toString();
            this.input.style.width = '100%';
            this.input.addEventListener('input', updateRecapMessages);
            this.divElement.appendChild(this.input);

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
        button.textContent = text;
        main.appendChild(button);
    }
    
    function createRulesText()
    {
        let div = document.createElement("div");
        div.id = "rules_text";
        main.appendChild(div);

        let p1 = document.createElement("p");
        div.appendChild(p1);
        p1.innerHTML = "Le prenant ne peut pas faire d'annonces ou elles seront non comptabilisées.";
        p1.innerHTML += '</br>';
        p1.innerHTML += "Le prenant ne peut appeler qu'à 5 joueurs.";        
        p1.innerHTML += '</br>';
        p1.innerHTML += "L'appelé peut faire des annonces. S'il gagne son annonce est déduite au prenant, s'il perd elle est donnée au prenant.";
        p1.innerHTML += '</br>';
        p1.innerHTML += "Valeurs des contrats : 25, 50, 100, 150.";
        p1.innerHTML += '</br>';
        p1.innerHTML += "Valeurs des annonces (misères) : 10, 10, 20.";
        p1.innerHTML += '</br>';
        p1.innerHTML += "Valeurs des annonces (poignées) : 20, 30, 40.";
    }

    const scoreboard = new Scoreboard();
    const announcements = new AnnouncementManager();

    const contractFactor = [1, 2, 4, 6];
    const contractSlider = new Slider('contract_slider','Contrat', 0, 3, 1, 0);
    const oudlerSlider = new Slider('oudler_slider', 'Bouts', 0, 3, 1, 0);
    const scoreSlider = new Slider('score_slider', ["Attaque", "Défense"], 0, 91, 1, 0);

    createTexts();

    const chelem = new ChelemManager(scoreboard);
    
    createButton("add_points", "Appliquer les points");
    createButton("reset_points", "Repartir de 0");

    createRulesText();

    const winText = document.getElementById("win_text");
    const scoreText = document.getElementById('score_text');
    const summaryText = document.getElementById('summary_text');

    contractSlider.setValue(0)
    oudlerSlider.setValue(0);
    scoreSlider.setValue(0);
    updateRecapMessages();

    function hasAttackWin() {
        let oudlerCount = oudlerSlider.getValue();
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

    function getExtraCardScore() {
        switch (oudlerSlider.getValue()) {
            case 0:
                return scoreSlider.getValue() - 56;
            case 1:
                return scoreSlider.getValue() - 51;
            case 2:
                return scoreSlider.getValue() - 41;
            case 3:
                return scoreSlider.getValue() - 36;
            default:
                return 0;
        }
    }

    function getContractAbsValue() {
        let extraScore = getExtraCardScore();
        let contractIndex = contractSlider.getValue();
        return contractFactor[contractIndex] * (25 + Math.abs(extraScore));
    }

    function updateSliderTextValues() {

        oudlerSlider.setValueText(oudlerSlider.getValue())
        scoreSlider.setValueText([scoreSlider.getValue(), 91 - scoreSlider.getValue()]);

        switch (contractSlider.getValue()) {
            case 0:
                contractSlider.setValueText("Petite");
                break;
            case 1:
                contractSlider.setValueText("Garde");
                break;
            case 2:
                contractSlider.setValueText("Garde Sans");
                break;
            case 3:
                contractSlider.setValueText("Garde Contre");
                break;
            default:
                contractSlider.setValueText("");
        }
    }

    function updateRecapMessages() {
        updateSliderTextValues();

        if (hasAttackWin()) {
            winText.textContent = "Victoire de l'attaque.";
            scoreText.textContent = "Score de " + scoreSlider.getValue() + " pour " + oudlerSlider.getValue() + " bouts.";
            summaryText.textContent = "Points gagnés pour l'attaque : " + getContractAbsValue()
                + ", réussie de " + getExtraCardScore();

        } else {
            winText.textContent = "Victoire de la défense.";
            scoreText.textContent =  "Score de " + scoreSlider.getValue() + " pour " + oudlerSlider.getValue() + " bouts.";
            summaryText.textContent = "Points perdus pour l'attaque : " + getContractAbsValue()
                + ", chutée de " + -getExtraCardScore();
        }
    }

    function resetSliders() {
        contractSlider.setValue(0);
        oudlerSlider.setValue(0);
        scoreSlider.setValue(0);
        announcements.resetValues()
        
        document.querySelectorAll("select").forEach(function(el) {
            el.selectedIndex = 0;
        })

        updateRecapMessages();

        winText.textContent = "";
        scoreText.textContent = "Déplace les jauges pour obtenir un score.";
        summaryText.textContent = "";
    }

    function addContractToPlayer(team, scores, contractAbsValue) {

        const teamFac = hasPlayerWin(team[0]) ? 1 : -1 ;

        for(let player of team) {
            switch(player.role)
            {
                case PLAYER_ROLE.DEFENDER:
                {
                    let contractRepartition = 0;
                    if(scoreboard.hasCalledDefined())
                        contractRepartition = teamFac*contractAbsValue*1.5/team.length;
                    else
                        contractRepartition = teamFac*contractAbsValue/team.length;
                    scores.push(contractRepartition);
                    break;
                }
                case PLAYER_ROLE.CALLED:
                {
                    const contractRepartition = teamFac*contractAbsValue/2;
                    scores.push(contractRepartition);
                    break;
                }
                case PLAYER_ROLE.ATTACKER:
                {
                    const contractRepartition = teamFac*contractAbsValue;
                    scores.push(contractRepartition);
                    break;
                }
            }

        }
    }

    //Add points
    document.getElementById('add_points').addEventListener('click', function() {
        if(scoreboard.hasAttackerDefined() == false)
        {
            alert("Veuillez définir un attaquant avant d'appliquer les points.");
            return;
        }
        if(scoreboard.players.length < 3)
        {
            alert("Le nombre minimal de joueurs est 3.");
            return;
        }

        let contractAbsValue = getContractAbsValue();
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
        // for(let player of loseTeam) {
        //
        //   switch(player.role)
        //   {
        //     case PLAYER_ROLE.DEFENDER:
        //     {
        //       let contractRepartition = 0;
        //       if(scoreboard.hasCalledDefined())
        //         contractRepartition = -contractAbsValue*1.5/loseTeam.length;
        //       else
        //         contractRepartition = -contractAbsValue/loseTeam.length;
        //       loseScores.push(contractRepartition);
        //       break;
        //     }
        //     case PLAYER_ROLE.CALLED:
        //     {
        //       const contractRepartition = -contractAbsValue/2;
        //       loseScores.push(contractRepartition);
        //       break;
        //     }
        //     case PLAYER_ROLE.ATTACKER:
        //     {
        //       let contractRepartition = 0;
        //       if(scoreboard.hasCalledDefined())
        //         contractRepartition = -contractAbsValue;
        //       else
        //         contractRepartition = -contractAbsValue;
        //       loseScores.push(contractRepartition);
        //       break;
        //     }
        //   }
        //
        // }

        const winScores = [];
        // for(let player of winTeam) {
        //   switch(player.role)
        //   {
        //     case PLAYER_ROLE.DEFENDER:
        //     {
        //       let contractRepartition = 0;
        //       if(scoreboard.hasCalledDefined())
        //         contractRepartition = contractAbsValue*1.5/winTeam.length;
        //       else
        //         contractRepartition = contractAbsValue/winTeam.length;
        //       winScores.push(contractRepartition);
        //       break;
        //     }
        //     case PLAYER_ROLE.CALLED:
        //     {
        //       const contractRepartition = contractAbsValue/2;
        //       winScores.push(contractRepartition);
        //       break;
        //     }
        //     case PLAYER_ROLE.ATTACKER:
        //     {
        //       let contractRepartition = 0;
        //       if(scoreboard.hasCalledDefined())
        //         contractRepartition = contractAbsValue;
        //       else
        //         contractRepartition = contractAbsValue;
        //       winScores.push(contractRepartition);
        //       break;
        //     }
        //   }
        // }

        addContractToPlayer(loseTeam, loseScores, contractAbsValue);
        addContractToPlayer(winTeam, winScores, contractAbsValue);

        //Annonces
        // on retire les points perdus car annonces ratees
        let annPointsForWinners = 0;
        for(let player of loseTeam) {
            const annValue = announcements.getAnnouncementValue(player.name);
            annPointsForWinners += annValue*winTeam.length*loseTeam.length;
        }
        for(i = 0; i < loseTeam.length; i++) {
            loseScores[i] += -annPointsForWinners/loseTeam.length
        }
        for(i = 0; i < winTeam.length; i++) {
            winScores[i] += annPointsForWinners/winTeam.length;
        }
        // on vole les points car annonces reussis
        let annPointsToStealToLosers = 0;
        for(let player of winTeam) {
            const annValue = announcements.getAnnouncementValue(player.name);
            annPointsToStealToLosers += annValue*winTeam.length*loseTeam.length;
        }
        for(i = 0; i < loseTeam.length; i++) {
            loseScores[i] += -annPointsToStealToLosers/loseTeam.length;
        }
        for(i = 0; i < winTeam.length; i++) {
            winScores[i] += annPointsToStealToLosers/winTeam.length;
        }
        
        // Miseres
        let attackerBonusPoints = 0;
        if(loseTeam[0].role == PLAYER_ROLE.DEFENDER)
        {
            for(i = 0; i < loseTeam.length; i++) {
                let player = loseTeam[i];
                const misereValue = announcements.getMiseresValue(player.name);
                attackerBonusPoints += misereValue;
                loseScores[i] -= misereValue;
            }
        }    
        if(winTeam[0].role == PLAYER_ROLE.DEFENDER)
        {
            for(i = 0; i < winTeam.length; i++) {
                let player = winTeam[i];
                const misereValue = announcements.getMiseresValue(player.name);
                attackerBonusPoints -= misereValue;
                winScores[i] += misereValue;
            }
        }
        for(i = 0; i < loseTeam.length; i++) {
            let p = loseTeam[i];
            if(p.role != PLAYER_ROLE.ATTACKER) continue;
            loseScores[i] += attackerBonusPoints;
        }        
        for(i = 0; i < winTeam.length; i++) {
            let p = winTeam[i];
            if(p.role != PLAYER_ROLE.ATTACKER) continue;
            winScores[i] += attackerBonusPoints;
        }
        

        // add to scoreboard
        for(i = 0; i < loseTeam.length; i++) {
            const player = loseTeam[i];
            scoreboard.addPlayerScore(player.name, loseScores[i]);
        }
        for(i = 0; i < winTeam.length; i++) {
            const player = winTeam[i];
            scoreboard.addPlayerScore(player.name, winScores[i]);
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