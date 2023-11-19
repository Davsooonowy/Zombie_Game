document.addEventListener('DOMContentLoaded', function () {
    var score = 30;
    var isGameOver = false;
    var scoreValue = document.querySelector('.score span');
    var board = document.querySelector('.board');
    var currentHeartIndex = 0;
    var zombiesExited = 0;
    var curr_zombiesExited = 0;
    var heartImages = [
        "images/full_heart.png",
        "images/empty_heart.png"
    ];

    const customCursor = document.createElement('div');
    customCursor.id = 'customCursor';
    document.body.appendChild(customCursor);

    document.addEventListener('mousemove', (e) => {
        const customCursor = document.getElementById('customCursor');
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    });

    function updateScore() {
        scoreValue.innerText = score;
    }

    function updateHeartImage() {
        var livesImages = document.querySelectorAll('.lives img');
        if (currentHeartIndex < livesImages.length - 1) {
            livesImages[livesImages.length - currentHeartIndex - 1].src = heartImages[1];
            currentHeartIndex++;
        } else {
            endGame();
        }
    }

    var maxZombies = 15;
    var currentZombies = 0;
    function createZombie() {
        if (!isGameOver && currentZombies < maxZombies) {
            var zombie = document.createElement('div');
            zombie.classList.add('zombie');

            var scale = 0.5 + Math.random() * 0.5;
            zombie.style.transform = 'scale(' + scale + ')';

            var minBottomPos = 10;
            var maxBottomPos = 180;
            var bottomPos = Math.floor(Math.random() * (maxBottomPos - minBottomPos + 1) + minBottomPos);
            zombie.style.bottom = bottomPos + 'px';
            zombie.style.zIndex = 180 - bottomPos;

            var minWalkSpeed = 6;
            var maxWalkSpeed = 12;
            var walkSpeed = Math.floor(Math.random() * (maxWalkSpeed - minWalkSpeed + 1) + minWalkSpeed);
            var anim = '0.5s,' + walkSpeed + 's';
            zombie.style.animationDuration = anim;

            board.appendChild(zombie);
            currentZombies++;

            zombie.addEventListener('animationiteration', function () {
                if (!isGameOver && zombiesExited > curr_zombiesExited) {
                    updateHeartImage();
                    curr_zombiesExited++;
                    currentZombies--;
                }
            });

            zombie.addEventListener('animationend', function (e) {
                if (e.animationName === 'zombieWalk') {
                    if (!isGameOver) {
                        updateScore();
                        zombiesExited++;
                        this.remove();
                    }
                }
            });
        }
    }

    function endGame() {
        isGameOver = true;
        var scoreElement = document.querySelector('.score');
        var livesElement = document.querySelector('.lives');
        scoreElement.style.display = 'none';
        livesElement.style.display = 'none';
        var zombies = document.querySelectorAll('.zombie');
        zombies.forEach(function(zombie) {
            zombie.remove();
        });

        var gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over';
        gameOverDiv.innerHTML = '<div class="game-over-content">' +
            '<h2>Game Over</h2>' +
            '<p>Your Score: ' + score + '</p>' +
            '<button onclick="location.reload()">Play Again</button>' +
            '</div>';
        board.appendChild(gameOverDiv);
    }

    board.addEventListener('click', function (e) {
        if(score > 0) {
            if (e.target.classList.contains('zombie')) {
                if (!isGameOver) {
                    score += 10;
                    e.target.remove();
                    currentZombies--;
                    updateScore();
                }
            } else {
                if (!isGameOver) {
                    score -= 3;
                    updateScore();
                }
            }
        }
    });

    setInterval(function () {
        if (!isGameOver) {
            createZombie();
        }
    }, 1000);

    updateScore();
});

