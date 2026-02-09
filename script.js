class Match {
  constructor(teamA, teamB, overs, id) {
    this.id = id;
    this.teamA = teamA;
    this.teamB = teamB;
    this.totalOvers = overs;

    this.innings = 1;
    this.battingTeam = null;
    this.score = 0;
    this.wickets = 0;
    this.overs = 0;
    this.balls = 0;

    this.firstInningScore = null;
    this.lastBallRun = "-";
    this.matchOver = false;
  }

  toss() {
    const tossWinner = Math.random() < 0.5 ? this.teamA : this.teamB;
    const batFirst = Math.random() < 0.5;

    this.battingTeam = batFirst
      ? tossWinner
      : tossWinner === this.teamA ? this.teamB : this.teamA;

    return { tossWinner, battingTeam: this.battingTeam };
  }

  hit() {
    if (this.matchOver) return;

    const runs = [0, 1, 2, 3, 4, 6];
    const run = runs[Math.floor(Math.random() * runs.length)];

    this.lastBallRun = run;
    this.score += run;
    this.balls++;

    if (this.balls === 6) {
      this.overs++;
      this.balls = 0;
    }

    if (this.overs === this.totalOvers) {
      if (this.innings === 1) {
        this.firstInningScore = this.score;
        this.innings = 2;
        this.score = 0;
        this.overs = 0;
        this.balls = 0;
        this.battingTeam =
          this.battingTeam === this.teamA ? this.teamB : this.teamA;
      } else {
        this.matchOver = true;
      }
    }
  }
}

let matches = [];
let matchId = 0;

function createMatch() {
  const teamA = teamAInput.value.trim();
  const teamB = teamBInput.value.trim();
  const overs = +oversInput.value;

  if (!teamA || !teamB || !overs) return;

  matches.push(new Match(teamA, teamB, overs, matchId++));
  renderMatches();
}

function getResult(match) {
  if (!match.matchOver) return "";

  if (match.score > match.firstInningScore) {
    return `${match.battingTeam} won the match 🎉`;
  } else if (match.score < match.firstInningScore) {
    const winner =
      match.battingTeam === match.teamA ? match.teamB : match.teamA;
    return `${winner} won the match 🎉`;
  } else {
    return "Match Tied ";
  }
}

function renderMatches() {
  const container = document.getElementById("matchesContainer");
  container.innerHTML = `<div class="row" id="matchesRow"></div>`;

  const row = document.getElementById("matchesRow");

  matches.forEach(match => {
    const col = document.createElement("div");

    
    col.className = "col-12 col-md-6 col-lg-4";

    const card = document.createElement("div");
    card.className = "card p-3 mb-4 h-100";

    card.innerHTML = `
      <h5 class="text-primary">${match.teamA} vs ${match.teamB}</h5>

      ${!match.battingTeam ? `
        <button class="btn btn-warning btn-sm" onclick="doToss(${match.id})">
          Toss
        </button>
      ` : `
        <p><b>Batting:</b> ${match.battingTeam}</p>

        ${match.innings === 2 && !match.matchOver ? `
          <p class="text-danger fw-bold">
            🎯 Target: ${match.firstInningScore + 1}
          </p>
        ` : ``}

        <p>Score: <b>${match.score}</b></p>
        <p>Overs: ${match.overs}.${match.balls}</p>
        <p>Last Ball:
          <span class="badge bg-info">${match.lastBallRun}</span>
        </p>

        ${!match.matchOver ? `
          <button class="btn btn-success btn-sm" onclick="hitBall(${match.id})">
            HIT
          </button>
        ` : `
          <div class="alert alert-success mt-2 p-2">
            ${getResult(match)}
          </div>
        `}
      `}
    `;

    col.appendChild(card);
    row.appendChild(col);
  });
}


function getTargetText(match) {
  if (match.innings === 2 && !match.matchOver) {
    const target = match.firstInningScore + 1;
    return `🎯 Target for ${match.battingTeam}: ${target}`;
  }
  return "";
}


function doToss(id) {
  const match = matches.find(m => m.id === id);
  const r = match.toss();
  alert(`${r.tossWinner} won the toss. ${r.battingTeam} will bat first`);
  renderMatches();
}

function hitBall(id) {
  const match = matches.find(m => m.id === id);
  match.hit();
  renderMatches();
}


const teamAInput = document.getElementById("teamA");
const teamBInput = document.getElementById("teamB");
const oversInput = document.getElementById("overs");
