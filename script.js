class Match{
  constructor(teamA, teamB, totalOvers) {
    this.teamA = teamA;
    this.teamB = teamB;
    this.totalOvers = totalOvers;

    this.innings = 1;
    this.battingTeam = teamA;

    this.score = 0;
    this.wickets = 0;
    this.overs = 0;
    this.balls = 0;

    this.firstInningScore = 0;
    this.matchOver = false;

  }

  addBall() {
    if (this.matchOver) return;

    this.balls++;

    if (this.balls === 6) {
      this.overs++;
      this.balls = 0;

      if (this.overs == this.totalOvers && this.innings === 1) {
        this.firstInningScore = this.score;
        this.startSecondInning();
      }
      else if (this.overs == this.totalOvers && this.innings === 2) {
        this.matchOver = true;
        showResult();
      }
    }
  }

  startSecondInning() {
    this.innings = 2;
    this.battingTeam = this.teamB;
    this.score = 0;
    this.wickets = 0;
    this.overs = 0;
    this.balls = 0;

    document.getElementById("battingTeam").innerText =
      "Target for " + this.teamB + " is " + (this.firstInningScore + 1);
    
  }

}
let match;

function startMatch() {
  const teamA = document.getElementById("teamA").value;
  const teamB = document.getElementById("teamB").value;
  const overs = document.getElementById("overs").value;

  match = new Match(teamA, teamB, overs);
  document.getElementById("scoreBoard").style.display = "block";
  document.getElementById("battingTeam").innerText = "Team "+teamA + " is batting";
  updateUI();


}
  function addRun(run) {
    if (match.matchOver) return;
    match.score += run;
    match.addBall();
    updateUI();
  }

  function addWide() {
    if (match.matchOver) return;
    match.score += 1;
    updateUI();
  }

  function addNoBall() {
    if (match.matchOver) return;
    match.score += 1;
    updateUI();
  }

  function addWicket() {
    if (match.matchOver) return;
    match.wickets++;
    match.addBall();
    updateUI();
  }

  function showResult() {
    let result;
    if (match.score > match.firstInningScore) {
      result = match.teamB + " won the match";
    }
    else if (match.score < match.firstInningScore) {
      result = match.teamA + " won the match";
    } else {
      result = "match tied";
    }

    alert(result);
    resetApp();
  }

  function updateUI() {
    document.getElementById("score").innerText = match.score;
    document.getElementById("wickets").innerText = match.wickets;
    document.getElementById("oversCount").innerText = match.overs + "." + match.balls;
  }

  function resetApp() {
  match = null;

  
  document.getElementById("scoreBoard").style.display = "none";

  
  document.getElementById("teamA").value = "";
  document.getElementById("teamB").value = "";
  document.getElementById("overs").value = "";

 
  document.getElementById("score").innerText = "0";
  document.getElementById("wickets").innerText = "0";
  document.getElementById("oversCount").innerText = "0.0";
  document.getElementById("battingTeam").innerText = "";
}
