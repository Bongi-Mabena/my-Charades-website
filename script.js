// Handle login
document.getElementById('login-btn')?.addEventListener('click', function() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Hardcoded credentials
  const validUsername = "user1";
  const validPassword = "pass01";

  // Check credentials
  if (username === validUsername && password === validPassword) {
    window.location.href = 'player_setup.html'; // Redirect to player setup page on success
  } else {
    alert('Invalid username or password. Please try again.'); // Alert for failed login
  }
});

// Handle starting game
document.getElementById('start-game-btn')?.addEventListener('click', function() {
  const playerNameInputs = document.querySelectorAll('.player-name-input');
  const players = Array.from(playerNameInputs).map(input => input.value.trim()).filter(name => name !== '');

  if (players.length > 0 && players.length <= 3) {
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('currentPlayerIndex', 0);
    localStorage.setItem('scores', JSON.stringify(new Array(players.length).fill(0)));
    window.location.href = 'topic_selection.html';
  } else {
    alert('Please enter 1 to 3 player names.');
  }
});

// Execute when the DOM is fully loaded for player setup
document.addEventListener('DOMContentLoaded', () => {
  const playerNamesContainer = document.getElementById('player-names');

  // Create input fields for player names
  for (let i = 1; i <= 3; i++) { // Allow up to 3 players
    const inputDiv = document.createElement('div');
    inputDiv.innerHTML = `<label for="player${i}">Player ${i}:</label>
                          <input type="text" id="player${i}" class="player-name-input" placeholder="Enter name" required>`;
    playerNamesContainer.appendChild(inputDiv);
  }
});

// Execute when the DOM is fully loaded for game logic
document.addEventListener('DOMContentLoaded', () => {
  const topicsList = document.getElementById('topics-list');
  const currentTopicElement = document.getElementById('current-topic');
  const questionImage = document.getElementById('question-image');
  const nextQuestionButton = document.getElementById('next-question');
  const scoreboardElement = document.getElementById('scoreboard');

  // Images for each topic
  const images = {
    'traffic-signs': [
      'images/road signs/Stop Sign.png',
      'images/road signs/Yield sign.png',
      'images/road signs/No Entry Sign.png',
      'images/road signs/No Parking Sign.png',
      'images/road signs/One Way Sign.png',
      'images/road signs/Pedestrian Crossing.jpeg',
      'images/road signs/Roundabout Sign.png',
      'images/road signs/School Zone Sign.jpeg',
      'images/road signs/Slippery Road Sign.png',
      'images/road signs/Speed Limit Sign.jpeg'
    ],

    'rules': [
      'images/rules/Speed Limits.png',
      'images/rules/Alcohol Limit.jpeg',
      'images/rules/Emergency Vehicles.jpeg',
      'images/rules/Lane Changing.png',
      'images/rules/Mobile Phone Use.png',
      'images/rules/Overtaking Rules.png',
      'images/rules/Parking Regulations.jpeg',
      'images/rules/Pedestrian Rights.png',
      'images/rules/Right of Way.png',
      'images/rules/Signaling Turns.jpeg'
    ],

    'safety': [
      'images/safety/Night Driving.jpeg',
      'images/safety/Seat Belt Usage.jpeg',
      'images/safety/Vehicle Maintenance.jpeg',
      'images/safety/Blind Spot Awareness.jpeg',
      'images/safety/Child Seats.jpeg',
      'images/safety/Defensive Driving.jpeg',
      'images/safety/Distracted Driving.jpeg',
      'images/safety/Driving in Fog.jpeg',
      'images/safety/Driving in Rain.jpeg',
      'images/safety/Helmet Use.jpeg'
    ]
  };

  let currentTopic = '';
  let currentQuestionIndex = 0;
  let currentPlayerIndex = parseInt(localStorage.getItem('currentPlayerIndex')) || 0;

  // Load player names and scores from local storage
  const players = JSON.parse(localStorage.getItem('players')) || [];
  let scores = JSON.parse(localStorage.getItem('scores')) || new Array(players.length).fill(0); //  scores

  // Display players and scores
  function updateScoreboard() {
    scoreboardElement.innerHTML = `<h3>Scoreboard</h3><ul>${players.map((player, index) => `<li>${player}: ${scores[index]} points</li>`).join('')}</ul>`;
  }
  updateScoreboard(); // Initial scoreboard display

  // Handle topic selection
  topicsList?.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      currentTopic = e.target.getAttribute('data-topic');
      currentTopicElement.textContent = `Current Topic: ${currentTopic.replace('-', ' ')}`;
      currentQuestionIndex = 0; // Reset question index
      displayQuestion(); // Show the first question immediately
    }
  });

  // Handle "Next Question" button click
  nextQuestionButton?.addEventListener('click', displayQuestion);

  // Function to display the next image in the selected topic
  function displayQuestion() {
    if (images[currentTopic]) {
      const topicImages = images[currentTopic];
      questionImage.src = topicImages[currentQuestionIndex];
      questionImage.classList.remove('hidden');
      questionImage.alt = `Image related to ${currentTopic}`;
      currentQuestionIndex = (currentQuestionIndex + 1) % topicImages.length;
      nextQuestionButton.classList.remove('hidden');


      
      // Rotate to the next player
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // Move to the next player
      localStorage.setItem('currentPlayerIndex', currentPlayerIndex); // Save current player index
    }
  }

  let orientationTimeout = null;

  // Detect device orientation for "face down" motion to trigger next question
  window.addEventListener('deviceorientation', (event) => {
    const beta = event.beta; // Detect phone tilting forward or backward

    if (beta >= 80) { 
      // Tilted forward; trigger scoring and next question
      if (orientationTimeout) {
        clearTimeout(orientationTimeout);
      }
      orientationTimeout = setTimeout(() => {
        scores[currentPlayerIndex] += 1; // Add point to current player
        updateScoreboard(); // Update scoreboard after scoring
        displayQuestion(); // Load next question
      }, 750); // Delay of 750ms
  
    } else if (beta <= -80) { 
      // Tilted backward; reset or trigger something else if desired
      if (orientationTimeout) {
        clearTimeout(orientationTimeout);
      }
      orientationTimeout = setTimeout(() => {
        updateScoreboard(); // Just update the scoreboard or another action
        displayQuestion(); // Load next question if needed
      }, 750);
    }
  });
});

// Handle logout
document.getElementById('logout-btn')?.addEventListener('click', function() {
  window.location.href = 'index.html'; // Redirect to login page
});