document.addEventListener('DOMContentLoaded', () => {
  const currentTopicElement = document.getElementById('current-topic');
  const questionImage = document.getElementById('question-image');
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
  let scores = JSON.parse(localStorage.getItem('scores')) || new Array(players.length).fill(0); // Initialize scores

  // Display players and scores
  function updateScoreboard() {
    scoreboardElement.innerHTML = `<h3>Scoreboard</h3><ul>${players.map((player, index) => `<li>${player}: ${scores[index]} points</li>`).join('')}</ul>`;
  }
  updateScoreboard(); // Initial scoreboard display

  // Function to display the next image in the selected topic
  function displayQuestion() {
    if (images[currentTopic]) {
      const topicImages = images[currentTopic];
      questionImage.src = topicImages[currentQuestionIndex];
      questionImage.classList.remove('hidden');
      questionImage.alt = `Image related to ${currentTopic}`;
      currentQuestionIndex = (currentQuestionIndex + 1) % topicImages.length; // Loop through images
    }
  }

  // Device orientation handling
  let orientationTimeout = null;

  window.addEventListener('deviceorientation', (event) => {
    const beta = event.beta; // Beta is the tilt forward/backward

    if (beta >= 80) { // Face down
      if (orientationTimeout) {
        clearTimeout(orientationTimeout);
      }

      orientationTimeout = setTimeout(() => {
        // Assume the answer was correct and award a point
        scores[currentPlayerIndex] += 1;
        alert(`${players[currentPlayerIndex]} gave a correct answer! Point awarded.`);
        
        updateScoreboard(); // Update scoreboard after awarding the point

        // Move to the next question and rotate to the next player
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        localStorage.setItem('currentPlayerIndex', currentPlayerIndex); // Save current player index
        displayQuestion();
      }, 750); // 750ms delay before moving to next question
    } else if (beta <= 20) { // Face up (incorrect answer scenario)
      if (orientationTimeout) {
        clearTimeout(orientationTimeout);
      }

      orientationTimeout = setTimeout(() => {
        alert(`${players[currentPlayerIndex]} gave an incorrect answer. No points awarded.`);

        // Rotate to the next player without awarding points
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        localStorage.setItem('currentPlayerIndex', currentPlayerIndex); // Save current player index
        displayQuestion();
      }, 750); // 750ms delay before moving to next question
    }
  });

  // Topic selection handler
  const topicsList = document.getElementById('topics-list');
  topicsList?.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      currentTopic = e.target.getAttribute('data-topic');
      currentTopicElement.textContent = `Current Topic: ${currentTopic.replace('-', ' ')}`;
      currentQuestionIndex = 0; // Reset question index to start fresh
      displayQuestion(); // Show the first question immediately
    }
  });
});

// Handle logout
document.getElementById('logout-btn')?.addEventListener('click', function() {
  window.location.href = 'index.html'; // Redirect to login page
});
