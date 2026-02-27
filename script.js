class Match {
  constructor(teamA, teamB, overs, id) {
    this.id = id;
    this.teamA = teamA;
    this.teamB = teamB;
    this.totalOvers = overs;

    this.innings = 1;
    this.battingTeam = null;
    this.firstBattingTeam = null;

    this.score = 0;
    this.wickets = 0;
    this.overs = 0;
    this.balls = 0;

    this.firstInningScore = null;
    this.lastBallRun = "-";
    this.ballsHistory = [];
    this.message = "Click Toss to start";
    this.matchOver = false;
  }

  toss() {
    const tossWinner = Math.random() < 0.5 ? this.teamA : this.teamB;
    const batFirst = Math.random() < 0.5;

    this.battingTeam = batFirst
      ? tossWinner
      : tossWinner === this.teamA ? this.teamB : this.teamA;

    this.firstBattingTeam = this.battingTeam;

    this.message = `${tossWinner} won the toss. ${this.battingTeam} will bat first`;
  }

  hit() {
    if (this.matchOver) return;

    const outcomes = [0, 1, 2, 3, 4, 6, "W"];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];
    // this.ballsHistory.push("|");
    if (result === "W") {
      this.wickets++;
      this.lastBallRun = "W";
      this.ballsHistory.push("W");
    } else {
      this.score += result;
      this.lastBallRun = result;
      this.ballsHistory.push(result);
    }

    this.balls++;

    if (this.balls === 6) {
      this.overs++;
      this.balls = 0;
      this.ballsHistory.push("|");
    }

    if (this.overs === this.totalOvers) {
      if (this.innings === 1) {
        this.firstInningScore = this.score;

        this.innings = 2;
        this.score = 0;
        this.wickets = 0;
        this.overs = 0;
        this.balls = 0;

        this.battingTeam =
          this.battingTeam === this.teamA ? this.teamB : this.teamA;

        this.message = `Target for ${this.battingTeam}: ${this.firstInningScore + 1}`;
        this.ballsHistory.push("Second Inning");
      } else {
        this.matchOver = true;
        this.message = getResult(this);
        confetti();
      }
    }
  }
}

let currentMatches = [];
let historyMatches = [];
let matchId = 0;

function createMatch() {
  const teamA = teamAInput.value.trim();
  const teamB = teamBInput.value.trim();
  const overs = +oversInput.value;

  if (!teamA || !teamB || !overs) return;

  const match = new Match(teamA, teamB, overs, matchId++);
  currentMatches.push(match);

  renderCurrentMatches();
  showCurrentMatches();
}

function getResult(match) {
  const chasingTeam = match.battingTeam;
  const defendingTeam =
    chasingTeam === match.teamA ? match.teamB : match.teamA;

  if (match.score > match.firstInningScore) {
    const wicketsLeft = 10 - match.wickets;
    return `${chasingTeam} won the match by ${wicketsLeft} wickets 🎉`;
  }

  if (match.score < match.firstInningScore) {
    const runsLeft = match.firstInningScore - match.score;
    return `${defendingTeam} won the match by ${runsLeft} runs 🎉`;
  }

  return "Match Tied 🙏";
}

function renderCurrentMatches() {
  const container = document.getElementById("matchesContainer");
  container.innerHTML = "";

  if (currentMatches.length === 0) {
    container.innerHTML = `
      <div class="card text-center p-4">
        <h5 class="text-muted">No matches are currently ongoing</h5>
        <button class="btn btn-primary mt-2" onclick="showAddMatch()">
          ➕ Add Match
        </button>
      </div>
    `;
    return;
  }

  const row = document.createElement("div");
  row.className = "row";

  currentMatches.forEach(match => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    const card = document.createElement("div");
    card.className = "card shadow-sm rounded-3 p-3 mb-3 animate-card";

    card.innerHTML = `
      <h5>${match.teamA} vs ${match.teamB}</h5>
      <div class="bg-primary-subtle  small rounded-2 p-2 mb-2">
        ${match.message}
      </div>

      ${!match.battingTeam ? `
        <button class="btn btn-primary btn-sm"
          onclick="doToss(${match.id})">Toss</button>
      ` : `
        <p><b>Batting:</b> ${match.battingTeam}</p>
        <p>Score: ${match.score}/${match.wickets}</p>
        <p>Overs: ${match.overs}.${match.balls}</p>

        <div class="small text-muted ">
          ${renderBalls(match.ballsHistory)}
        </div>

        ${!match.matchOver ? `
          <button class="btn btn-success btn-sm mt-2"
            onclick="hitBall(${match.id})">HIT</button>
        ` : ``}
      `}
    `;

    col.appendChild(card);
    row.appendChild(col);
  });

  container.appendChild(row);
}

function renderHistory() {
  historyContainer.innerHTML = "";

  if (historyMatches.length === 0) {
    historyContainer.innerHTML = "<p>No matches played yet.</p>";
    return;
  }

  const row = document.createElement("div");
  row.className = "row .text-body-emphasis";

  historyMatches.forEach(match => {

    const col = document.createElement("div");
    col.className = "col-12 col-lg-4 "; showCurrentMatches

    const card = document.createElement("div");
    card.className = "card shadow-sm rounded-3 p-2 mb-3 ";

    card.innerHTML = `
      <h6>${match.teamA} vs ${match.teamB}</h6>
      <div class="fw-bold text-success mt-1 mb-2">
        ${match.result}
      </div>

      <p><b>${match.firstBattingTeam}</b> (1st Innings): ${match.firstInningScore}</p>
      <p><b>${match.firstBattingTeam === match.teamA ? match.teamB : match.teamA}</b>
         (2nd Innings): ${match.secondInningScore}</p>

      <div class="small text-muted border p-1">
        ${renderBalls(match.ballsHistory)}
      </div> `;

    col.appendChild(card);
    row.appendChild(col);
  });

  historyContainer.appendChild(row);
}
function renderBalls(balls) {
  return balls.map(b => {

    if (b === "|") {
      return `<span class="fw-bold text-muted fs-2"> | </span>`;
    }

    if (b === "W") {
      return `<span class="btn btn-primary btn-sm mb-3 p-2 rounded-circle">W</span>`;
    }

    return `<span class="run-ball btn btn-success btn-sm mb-3 p-2 rounded-circle">${b}</span>`;

  }).join(" ");
}

function doToss(id) { history
  const match = currentMatches.find(m => m.id === id);
  if (!match) return;

  match.toss();
  renderCurrentMatches();
}

function hitBall(id) {
  const match = currentMatches.find(m => m.id === id);
  if (!match) return;

  match.hit();

  if (match.matchOver) {
    historyMatches.push({
      teamA: match.teamA,
      teamB: match.teamB,
      firstBattingTeam: match.firstBattingTeam,
      firstInningScore: match.firstInningScore,
      secondInningScore: match.score,
      ballsHistory: [...match.ballsHistory],
      result: getResult(match)
    });

    currentMatches = currentMatches.filter(m => m.id !== id);
  }

  renderCurrentMatches();
}


function showAddMatch() {
  matchFormSection.classList.remove("d-none");
  currentMatchSection.classList.add("d-none");
  historySection.classList.add("d-none");

  form.classList.remove("was-validated");
}

function showCurrentMatches() {
  matchFormSection.classList.add("d-none");
  currentMatchSection.classList.remove("d-none");
  historySection.classList.add("d-none");
  renderCurrentMatches();
}

function showHistory() {
  matchFormSection.classList.add("d-none");
  currentMatchSection.classList.add("d-none");
  historySection.classList.remove("d-none");

  renderHistory();
}


const teamAInput = document.getElementById("teamA");
const teamBInput = document.getElementById("teamB");
const oversInput = document.getElementById("overs");

const matchFormSection = document.getElementById("matchFormSection");
const currentMatchSection = document.getElementById("currentMatchSection");
const historySection = document.getElementById("historySection");
const historyContainer = document.getElementById("historyContainer");
const form = document.querySelector(".needs-validation");