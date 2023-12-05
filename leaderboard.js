async function fetchLeaderboard() {
    const response = await fetch('./PHP/top_n_names_scores.php');
    const data = await response.json();

    const leaderboardTable = document.getElementById('leaderboardTable');
    const tbody = leaderboardTable.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    //used AI for correct statements to display database table on html.
    data.forEach((entry, index) => {
        const row = tbody.insertRow();
        const rankCell = row.insertCell(0);
        const nameCell = row.insertCell(1);
        const scoreCell = row.insertCell(2);

        rankCell.textContent = index + 1;
        nameCell.textContent = entry.name;
        scoreCell.textContent = entry.score;
    });
}

fetchLeaderboard();