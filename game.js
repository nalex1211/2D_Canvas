document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const player = {
        x: canvas.width / 2 - 25,
        y: canvas.height - 60,
        width: 50,
        height: 30,
        speed: 4,
        dx: 0
    };

    const circles = [];
    const circleProperties = {
        radius: 15,
        speed: 2,
        spawnRate: 90
    };

    let shouldRunGameLoop = true;
    let gameLoopID;

    function drawPlayer() {
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawCircle(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, circleProperties.radius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

    function updatePlayer() {
        player.x += player.dx;

        if (player.x < 0)
            player.x = 0;

        if (player.x + player.width > canvas.width)
            player.x = canvas.width - player.width;
    }

    function updateCircles() {
        if (Math.random() < 1 / circleProperties.spawnRate) {
            const x = Math.random() * canvas.width;
            circles.push({ x: x, y: -circleProperties.radius });
        }

        for (let i = 0; i < circles.length; i++) {
            circles[i].y += circleProperties.speed;
            drawCircle(circles[i].x, circles[i].y);

            if (circles[i].y + circleProperties.radius > player.y &&
                circles[i].y - circleProperties.radius < player.y + player.height &&
                circles[i].x + circleProperties.radius > player.x &&
                circles[i].x - circleProperties.radius < player.x + player.width) {

                alert("Game Over!");
                shouldRunGameLoop = false;
                cancelAnimationFrame(gameLoopID);

                spawnRateInput.disabled = false;
                startGameButton.disabled = false;
                return;
            }

            if (circles[i].y - circleProperties.radius > canvas.height) {
                circles.splice(i, 1);
                i--;
            }
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function gameLoop() {
        if (!shouldRunGameLoop) return;

        clearCanvas();
        drawPlayer();
        updatePlayer();
        updateCircles();

        gameLoopID = requestAnimationFrame(gameLoop);
    }

    function resetGame() {
        player.x = canvas.width / 2 - 25;
        player.y = canvas.height - 60;
        player.dx = 0;
        circles.length = 0;
        shouldRunGameLoop = true;
        gameLoop();
    }

    document.addEventListener("keydown", function(event) {
        if (event.key === "ArrowLeft") {
            player.dx = -player.speed;
        } else if (event.key === "ArrowRight") {
            player.dx = player.speed;
        }
    });

    document.addEventListener("keyup", function(event) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            player.dx = 0;
        }
    });

    const spawnRateInput = document.getElementById("spawnRateInput");
    const startGameButton = document.getElementById("startGameButton");

    startGameButton.addEventListener('click', function() {
        circleProperties.spawnRate = parseInt(spawnRateInput.value) || circleProperties.spawnRate;
        spawnRateInput.disabled = true;
        startGameButton.disabled = true;

        resetGame();
    });
});
