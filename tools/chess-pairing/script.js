(() => {
    // DOM Elements
    const alertBox = document.getElementById('alert-box');
    const alertIcon = document.getElementById('alert-icon');
    const alertMessage = document.getElementById('alert-message');
    const alertClose = document.getElementById('alert-close');
    
    const playerNameInput = document.getElementById('player-name');
    const playerRatingInput = document.getElementById('player-rating');
    const addPlayerBtn = document.getElementById('add-player-btn');
    const bulkAddBtn = document.getElementById('bulk-add-btn');
    const clearPlayersBtn = document.getElementById('clear-players-btn');
    const playerListEl = document.getElementById('player-list');
    
    const currentRoundEl = document.getElementById('current-round');
    const totalPlayersEl = document.getElementById('total-players');
    const activePlayersEl = document.getElementById('active-players');
    const totalRoundsEl = document.getElementById('total-rounds');
    const recommendedRoundsEl = document.getElementById('recommended-rounds');
    const roundInfoEl = document.getElementById('round-info');
    
    const generatePairingsBtn = document.getElementById('generate-pairings-btn');
    const newTournamentBtn = document.getElementById('new-tournament-btn');
    const pairingsCard = document.getElementById('pairings-card');
    const pairingsRoundEl = document.getElementById('pairings-round');
    const pairingsStatusEl = document.getElementById('pairings-status');
    const pairingsListEl = document.getElementById('pairings-list');
    const cancelPairingsBtn = document.getElementById('cancel-pairings-btn');
    const submitResultsBtn = document.getElementById('submit-results-btn');
    
    const standingsBodyEl = document.getElementById('standings-body');
    const printStandingsBtn = document.getElementById('print-standings-btn');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    
    const bulkAddOverlay = document.getElementById('bulk-add-overlay');
    const bulkAddText = document.getElementById('bulk-add-text');
    const cancelBulkAddBtn = document.getElementById('cancel-bulk-add-btn');
    const confirmBulkAddBtn = document.getElementById('confirm-bulk-add-btn');
    
    const helpOverlay = document.getElementById('help-overlay');
    const resultsOverlay = document.getElementById('results-overlay');
    const resultsMessage = document.getElementById('results-message');
    
    const importOverlay = document.getElementById('import-overlay');
    const importFile = document.getElementById('import-file');
    const cancelImportBtn = document.getElementById('cancel-import-btn');
    const confirmImportBtn = document.getElementById('confirm-import-btn');

    // Game State
    let players = [];
    let pairings = [];
    let currentRound = 0;
    let selectedResults = {};
    let pairingStartTime = 0;

    // Show Alert
    function showAlert(type, message) {
        alertBox.className = `alert ${type}`;
        alertIcon.textContent = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
        alertMessage.textContent = message;
        alertBox.classList.remove('hidden');
        setTimeout(() => alertBox.classList.add('hidden'), 5000);
    }

    alertClose.addEventListener('click', () => alertBox.classList.add('hidden'));

    // Load from localStorage
    function loadState() {
        const saved = localStorage.getItem('fossarium-chess-pairing');
        if (saved) {
            const data = JSON.parse(saved);
            players = data.players || [];
            pairings = data.pairings || [];
            currentRound = data.currentRound || 0;
            updateUI();
        }
    }

    // Save to localStorage
    function saveState() {
        localStorage.setItem('fossarium-chess-pairing', JSON.stringify({
            players,
            pairings,
            currentRound
        }));
    }

    // Add Player
    function addPlayer() {
        const name = playerNameInput.value.trim();
        const rating = parseInt(playerRatingInput.value) || 0;

        if (!name) {
            showAlert('error', 'Please enter a player name');
            return;
        }

        if (rating < 0 || rating > 3500) {
            showAlert('warning', 'Rating should be between 0 and 3500');
        }

        players.push({
            id: Date.now(),
            name,
            rating: rating || 0,
            score: 0,
            progressive: 0,
            progressiveScores: [],
            opponents: [],
            results: [],
            colors: [],
            bye: false,
            eliminated: false
        });

        playerNameInput.value = '';
        playerRatingInput.value = '';
        saveState();
        updateUI();
        showAlert('success', `Player "${name}" added successfully`);
    }

    // Remove Player
    function removePlayer(id) {
        if (currentRound > 0) {
            showAlert('error', 'Cannot remove players after tournament has started');
            return;
        }
        const player = players.find(p => p.id === id);
        players = players.filter(p => p.id !== id);
        saveState();
        updateUI();
        showAlert('info', `Player "${player?.name}" removed`);
    }

    // Bulk Add Players
    function bulkAddPlayers() {
        const text = bulkAddText.value.trim();
        if (!text) {
            showAlert('error', 'Please enter player names');
            return;
        }

        const lines = text.split('\n');
        let added = 0;
        
        lines.forEach(line => {
            const match = line.match(/^(.+?)(?:\s*\((\d+)\))?$/);
            if (match) {
                const name = match[1].trim();
                const rating = parseInt(match[2]) || 0;
                
                if (name) {
                    players.push({
                        id: Date.now() + added,
                        name,
                        rating,
                        score: 0,
                        progressive: 0,
                        progressiveScores: [],
                        opponents: [],
                        results: [],
                        colors: [],
                        bye: false,
                        eliminated: false
                    });
                    added++;
                }
            }
        });

        bulkAddText.value = '';
        bulkAddOverlay.classList.add('hidden');
        saveState();
        updateUI();
        showAlert('success', `Added ${added} player(s)`);
    }

    // Clear All Players
    function clearAllPlayers() {
        if (players.length === 0) return;
        
        if (confirm(`Remove all ${players.length} players? This cannot be undone.`)) {
            players = [];
            currentRound = 0;
            pairings = [];
            saveState();
            updateUI();
            showAlert('info', 'All players cleared');
        }
    }

    // Calculate Recommended Rounds
    function getRecommendedRounds() {
        const playerCount = players.length;
        if (playerCount < 2) return 0;
        // Swiss: log2(players) rounds recommended
        return Math.ceil(Math.log2(playerCount)) + 1;
    }

    // Calculate Tie-Breaks
    function calculateTieBreaks() {
        players.forEach(player => {
            // Buchholz (Total)
            player.buchholz = player.opponents.reduce((sum, oppId) => {
                const opponent = players.find(p => p.id === oppId);
                return sum + (opponent ? opponent.score : 0);
            }, 0);

            // Buchholz Cut 1
            const opponentScores = player.opponents.map(oppId => {
                const opponent = players.find(p => p.id === oppId);
                return opponent ? opponent.score : 0;
            });
            player.buchholzCut1 = opponentScores.length > 0 
                ? player.buchholz - Math.min(...opponentScores) 
                : 0;

            // Sonneborn-Berger
            player.sb = player.results.reduce((sum, result, idx) => {
                const opponent = players.find(p => p.id === player.opponents[idx]);
                const oppScore = opponent ? opponent.score : 0;
                if (result === 1) return sum + oppScore;
                if (result === 0.5) return sum + oppScore * 0.5;
                return sum;
            }, 0);

            // Progressive
            player.progressive = player.progressiveScores ? 
                player.progressiveScores.reduce((a, b) => a + b, 0) : 0;
        });
    }

    // Sort Players for Pairing
    function sortPlayersForPairing() {
        return [...players].sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (b.rating !== a.rating) return b.rating - a.rating;
            return a.id - b.id;
        });
    }

    // Check if players already played
    function alreadyPlayed(p1, p2) {
        return p1.opponents.includes(p2.id);
    }

    // Get color count
    function getColorCount(player, color) {
        return player.colors.filter(c => c === color).length;
    }

    // Check if player can have same color 3 times in a row
    function canHaveColor(player, color) {
        const lastTwo = player.colors.slice(-2);
        if (lastTwo.length < 2) return true;
        return !(lastTwo[0] === color && lastTwo[1] === color);
    }

    // Get due color
    function getDueColor(player) {
        const whiteCount = getColorCount(player, 'W');
        const blackCount = getColorCount(player, 'B');
        if (whiteCount < blackCount) return 'W';
        if (blackCount < whiteCount) return 'B';
        return null;
    }

    // Generate Swiss Pairings
    function generatePairings() {
        if (players.length < 2) {
            showAlert('error', 'Need at least 2 players to generate pairings');
            return;
        }

        const sortedPlayers = sortPlayersForPairing();
        pairings = [];
        selectedResults = {};
        pairingStartTime = Date.now();

        // Assign bye if odd number of players
        let byePlayer = null;
        if (sortedPlayers.length % 2 === 1) {
            const scoreGroups = {};
            sortedPlayers.forEach(p => {
                if (!scoreGroups[p.score]) scoreGroups[p.score] = [];
                scoreGroups[p.score].push(p);
            });

            const lowestScore = Math.min(...Object.keys(scoreGroups).map(Number));
            const candidates = scoreGroups[lowestScore].filter(p => !p.bye);
            
            if (candidates.length > 0) {
                byePlayer = candidates[candidates.length - 1];
                pairings.push({
                    player1: byePlayer,
                    player2: null,
                    isBye: true,
                    result: 1
                });
            }
        }

        // Pair remaining players
        const available = sortedPlayers.filter(p => p !== byePlayer);
        const paired = new Set();

        for (let i = 0; i < available.length; i++) {
            if (paired.has(available[i].id)) continue;

            const player1 = available[i];
            let player2 = null;

            for (let j = i + 1; j < available.length; j++) {
                if (paired.has(available[j].id)) continue;
                
                const candidate = available[j];
                if (alreadyPlayed(player1, candidate)) continue;
                if (player1.bye && candidate.bye) continue;

                player2 = candidate;
                break;
            }

            if (player2) {
                paired.add(player1.id);
                paired.add(player2.id);

                // Assign colors
                const dueColor1 = getDueColor(player1);
                const dueColor2 = getDueColor(player2);
                let color1, color2;

                if (dueColor1 && !dueColor2) {
                    color1 = dueColor1;
                    color2 = dueColor1 === 'W' ? 'B' : 'W';
                } else if (dueColor2 && !dueColor1) {
                    color2 = dueColor2;
                    color1 = dueColor2 === 'W' ? 'B' : 'W';
                } else if (dueColor1 && dueColor2 && dueColor1 !== dueColor2) {
                    color1 = dueColor1;
                    color2 = dueColor2;
                } else {
                    color1 = player1.rating >= player2.rating ? 'W' : 'B';
                    color2 = color1 === 'W' ? 'B' : 'W';
                }

                if (!canHaveColor(player1, color1)) {
                    [color1, color2] = [color2, color1];
                }

                pairings.push({
                    player1,
                    player2,
                    color1,
                    color2,
                    isBye: false,
                    result: null
                });
            }
        }

        currentRound++;
        pairingsRoundEl.textContent = currentRound;
        pairingsCard.classList.remove('hidden');
        pairingsStatusEl.classList.remove('complete');
        pairingsStatusEl.querySelector('.status-text').textContent = 'Awaiting Results';
        renderPairings();
        saveState();
        
        // Auto-show results prompt for small tournaments
        const nonByePairings = pairings.filter(p => !p.isBye).length;
        if (nonByePairings <= 2) {
            setTimeout(() => {
                resultsMessage.textContent = `Please enter results for ${nonByePairings} pairing${nonByePairings > 1 ? 's' : ''}`;
                resultsOverlay.classList.remove('hidden');
            }, 500);
        }
        
        showAlert('success', `Round ${currentRound} pairings generated`);
        
        // Scroll to pairings
        setTimeout(() => {
            pairingsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    // Render Pairings
    function renderPairings() {
        pairingsListEl.innerHTML = '';
        let completedCount = 0;

        pairings.forEach((pairing, idx) => {
            const item = document.createElement('div');
            item.className = 'pairing-item';

            if (pairing.isBye) {
                item.innerHTML = `
                    <div class="bye-indicator">
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        ${pairing.player1.name} receives a Bye (1 point)
                    </div>
                `;
                completedCount++;
            } else {
                const hasResult = selectedResults[idx] !== undefined;
                if (hasResult) completedCount++;

                item.innerHTML = `
                    <div class="pairing-player">
                        <div class="pairing-color ${pairing.color1}">${pairing.color1}</div>
                        <span>${pairing.player1.name}</span>
                    </div>
                    <div class="pairing-result" data-pairing="${idx}">
                        <button class="result-btn ${selectedResults[idx] === 1 ? 'selected' : ''}" data-result="1">1</button>
                        <button class="result-btn ${selectedResults[idx] === 0.5 ? 'selected' : ''}" data-result="0.5">½</button>
                        <button class="result-btn ${selectedResults[idx] === 0 ? 'selected' : ''}" data-result="0">0</button>
                    </div>
                    <div class="pairing-player">
                        <div class="pairing-color ${pairing.color2}">${pairing.color2}</div>
                        <span>${pairing.player2.name}</span>
                    </div>
                `;

                if (hasResult) {
                    item.classList.add('complete');
                }

                // Result button handlers
                const resultBtns = item.querySelectorAll('.result-btn');
                resultBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const result = parseFloat(btn.dataset.result);
                        selectedResults[idx] = result;
                        
                        resultBtns.forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        
                        // Update pairing item style
                        item.classList.add('complete');
                        
                        // Check if all results entered
                        updatePairingsStatus();
                    });
                });
            }

            pairingsListEl.appendChild(item);
        });

        updatePairingsStatus();
    }

    // Update Pairings Status
    function updatePairingsStatus() {
        const nonByePairings = pairings.filter(p => !p.isBye);
        const completedCount = nonByePairings.filter((_, idx) => selectedResults[idx] !== undefined).length;
        
        if (completedCount === nonByePairings.length) {
            pairingsStatusEl.classList.add('complete');
            pairingsStatusEl.querySelector('.status-text').textContent = 'Ready to Submit';
            pairingsStatusEl.querySelector('.status-indicator').style.background = 'var(--success)';
        } else {
            pairingsStatusEl.classList.remove('complete');
            pairingsStatusEl.querySelector('.status-text').textContent = `${completedCount}/${nonByePairings.length} Results`;
        }
    }

    // Submit Results
    function submitResults() {
        // Check all pairings have results
        const nonByePairings = pairings.filter(p => !p.isBye);
        const missingResults = nonByePairings.filter((_, idx) => selectedResults[idx] === undefined);
        
        if (missingResults.length > 0) {
            showAlert('error', `Please enter results for all ${missingResults.length} pairing${missingResults.length > 1 ? 's' : ''}`);
            resultsMessage.textContent = `Missing results for ${missingResults.length} pairing${missingResults.length > 1 ? 's' : ''}`;
            resultsOverlay.classList.remove('hidden');
            return;
        }

        // Apply results
        pairings.forEach((pairing, idx) => {
            if (pairing.isBye) {
                pairing.player1.score += 1;
                pairing.player1.progressiveScores.push(pairing.player1.score);
                pairing.player1.bye = true;
            } else {
                const result = selectedResults[idx];
                const { player1, player2, color1, color2 } = pairing;

                player1.score += result;
                player2.score += (1 - result);

                player1.progressiveScores.push(player1.score);
                player2.progressiveScores.push(player2.score);

                player1.opponents.push(player2.id);
                player2.opponents.push(player1.id);

                player1.results.push(result);
                player2.results.push(1 - result);

                player1.colors.push(color1);
                player2.colors.push(color2);
            }
        });

        calculateTieBreaks();

        pairingsCard.classList.add('hidden');
        selectedResults = {};
        saveState();
        updateUI();
        showAlert('success', `Round ${currentRound} results submitted`);
    }

    // Render Standings
    function renderStandings() {
        calculateTieBreaks();
        
        const sorted = [...players].sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (b.buchholz !== a.buchholz) return b.buchholz - a.buchholz;
            if (b.buchholzCut1 !== a.buchholzCut1) return b.buchholzCut1 - a.buchholzCut1;
            if (b.sb !== a.sb) return b.sb - a.sb;
            if (b.progressive !== a.progressive) return b.progressive - a.progressive;
            return b.rating - a.rating;
        });

        standingsBodyEl.innerHTML = '';
        sorted.forEach((player, idx) => {
            const row = document.createElement('tr');
            if (idx === 0 && currentRound > 0) row.classList.add('first-place');
            
            row.innerHTML = `
                <td class="rank-cell">${idx + 1}</td>
                <td>${player.name}</td>
                <td>${player.rating || '-'}</td>
                <td class="score-cell"><strong>${player.score}</strong></td>
                <td>${player.buchholz.toFixed(1)}</td>
                <td>${player.buchholzCut1.toFixed(1)}</td>
                <td>${player.sb.toFixed(1)}</td>
                <td>${player.progressive}</td>
                <td>${player.opponents.length}</td>
            `;
            standingsBodyEl.appendChild(row);
        });
    }

    // Update UI
    function updateUI() {
        // Player list
        if (players.length === 0) {
            playerListEl.innerHTML = '<div class="player-item empty">No players added yet</div>';
        } else {
            playerListEl.innerHTML = '';
            const sorted = sortPlayersForPairing();
            sorted.forEach((player, idx) => {
                const item = document.createElement('div');
                item.className = 'player-item';
                item.innerHTML = `
                    <div class="player-info">
                        <span class="player-rank">${idx + 1}.</span>
                        <span class="player-name">${player.name}</span>
                        <span class="player-rating">${player.rating || '-'}</span>
                    </div>
                    <div class="player-actions">
                        <button class="btn-icon" data-id="${player.id}" title="Remove">
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </div>
                `;
                playerListEl.appendChild(item);
            });

            playerListEl.querySelectorAll('.btn-icon').forEach(btn => {
                btn.addEventListener('click', () => removePlayer(parseInt(btn.dataset.id)));
            });
        }

        // Tournament info
        currentRoundEl.textContent = currentRound;
        totalPlayersEl.textContent = players.length;
        activePlayersEl.textContent = players.filter(p => !p.eliminated).length;
        totalRoundsEl.textContent = currentRound > 0 ? currentRound : '-';
        
        const recommended = getRecommendedRounds();
        recommendedRoundsEl.textContent = recommended;
        roundInfoEl.classList.toggle('hidden', players.length < 2);

        // Generate button state
        generatePairingsBtn.disabled = players.length < 2;

        // Standings
        renderStandings();
    }

    // New Tournament
    function newTournament() {
        if (players.length === 0) {
            showAlert('warning', 'Add players first before starting a tournament');
            return;
        }
        
        if (confirm('Start a new tournament? This will reset all scores but keep players.')) {
            players.forEach(p => {
                p.score = 0;
                p.progressive = 0;
                p.opponents = [];
                p.results = [];
                p.colors = [];
                p.bye = false;
                p.progressiveScores = [];
            });
            pairings = [];
            currentRound = 0;
            pairingsCard.classList.add('hidden');
            saveState();
            updateUI();
            showAlert('success', 'New tournament started');
        }
    }

    // Export Tournament (Full JSON)
    function exportTournament() {
        if (players.length === 0) {
            showAlert('warning', 'No tournament data to export');
            return;
        }

        calculateTieBreaks();
        
        const tournamentData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            currentRound,
            players: players.map(p => ({
                id: p.id,
                name: p.name,
                rating: p.rating,
                score: p.score,
                progressive: p.progressive,
                progressiveScores: p.progressiveScores,
                opponents: p.opponents,
                results: p.results,
                colors: p.colors,
                bye: p.bye,
                eliminated: p.eliminated,
                buchholz: p.buchholz,
                buchholzCut1: p.buchholzCut1,
                sb: p.sb
            })),
            pairings: pairings.map(p => ({
                player1Id: p.player1?.id,
                player2Id: p.player2?.id,
                color1: p.color1,
                color2: p.color2,
                isBye: p.isBye,
                result: p.result
            }))
        };

        const json = JSON.stringify(tournamentData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chess-tournament-${new Date().toISOString().split('T')[0]}-round-${currentRound}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showAlert('success', 'Tournament exported successfully');
    }

    // Import Tournament (Full JSON)
    function importTournament() {
        importOverlay.classList.remove('hidden');
        importFile.value = '';
    }

    function confirmImport() {
        const file = importFile.files[0];
        if (!file) {
            showAlert('error', 'Please select a file to import');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Validate tournament data
                if (!data.version || !data.players || !data.currentRound) {
                    throw new Error('Invalid tournament file format');
                }

                // Restore tournament state
                currentRound = data.currentRound || 0;
                players = data.players.map(p => ({
                    id: p.id,
                    name: p.name,
                    rating: p.rating,
                    score: p.score,
                    progressive: p.progressive,
                    progressiveScores: p.progressiveScores || [],
                    opponents: p.opponents || [],
                    results: p.results || [],
                    colors: p.colors || [],
                    bye: p.bye || false,
                    eliminated: p.eliminated || false
                }));

                // Restore pairings (need to map player IDs back to player objects)
                pairings = (data.pairings || []).map(p => {
                    const player1 = players.find(pl => pl.id === p.player1Id);
                    const player2 = players.find(pl => pl.id === p.player2Id);
                    return {
                        player1,
                        player2,
                        color1: p.color1,
                        color2: p.color2,
                        isBye: p.isBye,
                        result: p.result
                    };
                });

                saveState();
                updateUI();
                importOverlay.classList.add('hidden');
                showAlert('success', `Tournament imported successfully (${players.length} players, Round ${currentRound})`);
                
            } catch (error) {
                showAlert('error', `Import failed: ${error.message}`);
            }
        };
        reader.onerror = () => {
            showAlert('error', 'Failed to read file');
        };
        reader.readAsText(file);
    }

    // Export Results (CSV) - Keep existing function
    function exportResults() {
        if (players.length === 0) {
            showAlert('warning', 'No data to export');
            return;
        }

        calculateTieBreaks();
        const sorted = [...players].sort((a, b) => b.score - a.score);
        
        let csv = 'Rank,Player,Rating,Score,Buchholz,Buchholz Cut 1,SB,Progressive,Games\n';
        sorted.forEach((player, idx) => {
            csv += `${idx + 1},"${player.name}",${player.rating},${player.score},${player.buchholz.toFixed(1)},${player.buchholzCut1.toFixed(1)},${player.sb.toFixed(1)},${player.progressive},${player.opponents.length}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chess-tournament-round-${currentRound}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        showAlert('success', 'Results exported successfully');
    }

    // Table Sorting
    let sortColumn = 'score';
    let sortDirection = 'desc';

    standingsBodyEl.addEventListener('click', e => {
        const th = e.target.closest('th');
        if (!th || !th.dataset.sort) return;

        const column = th.dataset.sort;
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'desc';
        }

        document.querySelectorAll('.standings-table th').forEach(header => {
            header.classList.remove('sorted-asc', 'sorted-desc');
            if (header.dataset.sort === sortColumn) {
                header.classList.add(`sorted-${sortDirection}`);
            }
        });

        renderStandings();
    });

    // Event Listeners
    addPlayerBtn.addEventListener('click', addPlayer);
    playerNameInput.addEventListener('keypress', e => { if (e.key === 'Enter') addPlayer(); });
    playerRatingInput.addEventListener('keypress', e => { if (e.key === 'Enter') addPlayer(); });

    bulkAddBtn.addEventListener('click', () => bulkAddOverlay.classList.remove('hidden'));
    cancelBulkAddBtn.addEventListener('click', () => bulkAddOverlay.classList.add('hidden'));
    confirmBulkAddBtn.addEventListener('click', bulkAddPlayers);
    
    clearPlayersBtn.addEventListener('click', clearAllPlayers);

    generatePairingsBtn.addEventListener('click', generatePairings);
    cancelPairingsBtn.addEventListener('click', () => {
        pairingsCard.classList.add('hidden');
        showAlert('info', 'Pairings cancelled');
    });
    submitResultsBtn.addEventListener('click', submitResults);
    newTournamentBtn.addEventListener('click', newTournament);
    
    printStandingsBtn.addEventListener('click', () => window.print());
    exportBtn.addEventListener('click', exportTournament);
    importBtn.addEventListener('click', importTournament);
    
    cancelImportBtn.addEventListener('click', () => importOverlay.classList.add('hidden'));
    confirmImportBtn.addEventListener('click', confirmImport);

    // Help overlay
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    document.getElementById('close-results-btn').addEventListener('click', () => resultsOverlay.classList.add('hidden'));
    
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    resultsOverlay.addEventListener('click', e => { if (e.target === resultsOverlay) resultsOverlay.classList.add('hidden'); });
    bulkAddOverlay.addEventListener('click', e => { if (e.target === bulkAddOverlay) bulkAddOverlay.classList.add('hidden'); });
    importOverlay.addEventListener('click', e => { if (e.target === importOverlay) importOverlay.classList.add('hidden'); });

    // Theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');

    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        themeIcon.setAttribute('name', 'moon-outline');
    } else if (savedTheme === 'dark') {
        themeIcon.setAttribute('name', 'sunny-outline');
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-theme');
        themeIcon.setAttribute('name', 'moon-outline');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        themeIcon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
    });

    // Initialize
    loadState();
})();
