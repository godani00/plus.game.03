// Game state
const state = {
    currentScore: 0,
    timerInterval: null,
    currentAnswer: 0,
};

// Audio elements
const successSound = document.getElementById('successSound');
const failSound = document.getElementById('failSound');
const finalSuccessSound = document.getElementById('finalSuccessSound');

// Scene elements
const scenes = {
    start: document.getElementById('startScene'),
    game: document.getElementById('gameScene'),
    success: document.getElementById('successScene'),
    fail: document.getElementById('failScene'),
    coupon: document.getElementById('couponScene'),
};

// Game elements
const scoreElement = document.getElementById('score');
const timerProgress = document.querySelector('.timer-progress');
const num1Element = document.getElementById('num1');
const num2Element = document.getElementById('num2');
const answerInput = document.getElementById('answerInput');

// Button elements
document.querySelector('.start-btn').addEventListener('click', startGame);
document.querySelector('.check-btn').addEventListener('click', checkAnswer);
document.querySelectorAll('.home-btn').forEach(btn => btn.addEventListener('click', goHome));
document.querySelector('.retry-btn').addEventListener('click', startGame);
document.querySelector('.save-btn').addEventListener('click', saveCoupon);

// Enter key handler for answer input
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Scene management
function showScene(sceneName) {
    Object.values(scenes).forEach(scene => scene.classList.add('hidden'));
    scenes[sceneName].classList.remove('hidden');
}

// Generate random numbers between 10 and 50
function generateProblem() {
    const num1 = Math.floor(Math.random() * 41) + 10; // 10-50
    const num2 = Math.floor(Math.random() * 41) + 10; // 10-50
    num1Element.textContent = num1;
    num2Element.textContent = num2;
    state.currentAnswer = num1 + num2;
}

// Timer management
function startTimer() {
    // Reset timer visual
    timerProgress.style.transition = 'none';
    timerProgress.style.width = '100%';
    
    // Force reflow
    timerProgress.offsetHeight;
    
    // Start timer animation
    timerProgress.style.transition = 'width 5s linear';
    timerProgress.style.width = '0%';
    
    // Clear existing timer if any
    if (state.timerInterval) clearTimeout(state.timerInterval);
    
    // Set new timer
    state.timerInterval = setTimeout(() => {
        handleFailure();
    }, 5000);
}

// Game flow functions
function startGame() {
    state.currentScore = 0;
    scoreElement.textContent = state.currentScore;
    showScene('game');
    generateProblem();
    answerInput.value = '';
    answerInput.focus();
    startTimer();
}

function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    if (userAnswer === state.currentAnswer) {
        handleSuccess();
    } else {
        handleFailure();
    }
}

function handleSuccess() {
    clearTimeout(state.timerInterval);
    state.currentScore++;
    scoreElement.textContent = state.currentScore;
    
    if (state.currentScore === 3) {
        showCouponScreen();
    } else {
        successSound.play();
        showScene('success');
        setTimeout(() => {
            showScene('game');
            generateProblem();
            answerInput.value = '';
            answerInput.focus();
            startTimer();
        }, 1000);
    }
}

function handleFailure() {
    clearTimeout(state.timerInterval);
    failSound.play();
    showScene('fail');
    const failEmoji = document.querySelector('.flying-emoji');
    failEmoji.style.animation = 'none';
    failEmoji.offsetHeight; // Force reflow
    failEmoji.style.animation = 'flyAcross 4s linear';
}

function showCouponScreen() {
    finalSuccessSound.play();
    showScene('coupon');
    const couponDate = new Date();
    document.querySelector('.coupon-date').textContent = 
        `발급일: ${couponDate.getFullYear()}-${String(couponDate.getMonth() + 1).padStart(2, '0')}-${String(couponDate.getDate()).padStart(2, '0')}`;
}

function goHome() {
    showScene('start');
    state.currentScore = 0;
    clearTimeout(state.timerInterval);
}

// Coupon save functionality
function saveCoupon() {
    const coupon = document.getElementById('couponCanvas');
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas size to match coupon size
    const couponRect = coupon.getBoundingClientRect();
    canvas.width = couponRect.width;
    canvas.height = couponRect.height;
    
    // Draw white background
    context.fillStyle = '#f9f9f9';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw coupon content
    context.font = '24px "Noto Sans KR"';
    context.fillStyle = '#333';
    context.textAlign = 'center';
    context.fillText('🥤 음료수 1잔 무료 쿠폰', canvas.width / 2, 40);
    
    context.font = '16px "Noto Sans KR"';
    context.fillText(document.querySelector('.coupon-date').textContent, canvas.width / 2, 70);
    
    // Create download link
    const link = document.createElement('a');
    link.download = '음료수쿠폰.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Initialize game
showScene('start'); 