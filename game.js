const GAME_W = 420;
const GAME_H = 700;

// Mobil dibuat sebagai tekstur SVG agar tidak membutuhkan file gambar eksternal.
function svgTexture(body, windowColor, stripeColor = "#f4f7fa") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="96" viewBox="0 0 56 96">
      <rect x="5" y="12" width="46" height="72" rx="13" fill="${body}" stroke="#111820" stroke-width="3"/>
      <rect x="11" y="22" width="34" height="19" rx="5" fill="${windowColor}" stroke="#111820" stroke-width="2"/>
      <rect x="11" y="55" width="34" height="17" rx="5" fill="${windowColor}" stroke="#111820" stroke-width="2"/>
      <rect x="1" y="23" width="6" height="17" rx="2" fill="#15191d"/>
      <rect x="49" y="23" width="6" height="17" rx="2" fill="#15191d"/>
      <rect x="1" y="59" width="6" height="17" rx="2" fill="#15191d"/>
      <rect x="49" y="59" width="6" height="17" rx="2" fill="#15191d"/>
      <rect x="12" y="13" width="10" height="5" rx="2" fill="#fff4b0"/>
      <rect x="34" y="13" width="10" height="5" rx="2" fill="#fff4b0"/>
      <rect x="12" y="78" width="10" height="5" rx="2" fill="#f34b50"/>
      <rect x="34" y="78" width="10" height="5" rx="2" fill="#f34b50"/>
      <path d="M28 44 L28 51" stroke="${stripeColor}" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

class RoadRush extends Phaser.Scene {
  constructor() {
    super("RoadRush");
  }

  preload() {
    this.load.image("playerCar", svgTexture("#20b7a4", "#153f50"));
    this.load.image("enemyRed", svgTexture("#ed4b4b", "#3b2830"));
    this.load.image("enemyBlue", svgTexture("#4387e8", "#203955"));
    this.load.image("enemyYellow", svgTexture("#f0b83f", "#53401e"));
    this.load.image("enemyPurple", svgTexture("#a76be8", "#38254b"));
  }

  create() {
    this.gameOver = false;
    this.score = 0;
    this.elapsed = 0;
    this.spawnTimer = 0;
    this.enemySpeed = 230;

    this.road = this.add.graphics();
    this.cameras.main.setBackgroundColor("#27764b");
    this.drawRoad(0);

    this.player = this.physics.add.image(GAME_W / 2, GAME_H - 115, "playerCar");
    this.player.setDisplaySize(48, 82);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(34, 66).setOffset(7, 15);

    this.enemies = this.physics.add.group();
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);

    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    this.scoreText = this.add.text(14, 14, "SKOR: 0", {
      fontFamily: "Arial, sans-serif",
      fontSize: "24px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#111820",
      strokeThickness: 4
    }).setDepth(10);

    this.add.text(GAME_W / 2, 48, "ROAD RUSH", {
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      fontStyle: "bold",
      color: "#d5e0e6",
      letterSpacing: 3
    }).setOrigin(0.5).setDepth(10);

    this.gameOverPanel = this.add.container(GAME_W / 2, GAME_H / 2)
      .setDepth(20)
      .setVisible(false);

    const shade = this.add.rectangle(0, 0, GAME_W, GAME_H, 0x061018, 0.78);
    const panel = this.add.rectangle(0, 0, 320, 205, 0x172630, 0.98)
      .setStrokeStyle(3, 0xed4b4b);

    const over = this.add.text(0, -55, "GAME OVER", {
      fontFamily: "Arial, sans-serif",
      fontSize: "34px",
      fontStyle: "bold",
      color: "#ff6565",
      align: "center"
    }).setOrigin(0.5);

    this.finalScoreText = this.add.text(0, -8, "Skor: 0", {
      fontFamily: "Arial, sans-serif",
      fontSize: "22px",
      color: "#ffffff"
    }).setOrigin(0.5);

    const restart = this.add.text(0, 48, "Tekan SPASI untuk bermain lagi", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#dce6ec",
      align: "center",
      wordWrap: { width: 280 }
    }).setOrigin(0.5);

    this.gameOverPanel.add([shade, panel, over, this.finalScoreText, restart]);
  }

  drawRoad(offset) {
    this.road.clear();
    this.road.fillStyle(0x27764b, 1).fillRect(0, 0, GAME_W, GAME_H);
    this.road.fillStyle(0x343a40, 1).fillRect(42, 0, GAME_W - 84, GAME_H);

    this.road.fillStyle(0xf0f0e8, 1);
    this.road.fillRect(48, 0, 5, GAME_H);
    this.road.fillRect(GAME_W - 53, 0, 5, GAME_H);

    this.road.fillStyle(0xf2c94c, 1);
    this.road.fillRect(57, 0, 3, GAME_H);
    this.road.fillRect(GAME_W - 60, 0, 3, GAME_H);

    this.road.fillStyle(0xe9edf0, 0.85);
    for (let y = -105 + offset; y < GAME_H; y += 105) {
      this.road.fillRect(GAME_W / 2 - 3, y, 6, 55);
    }
  }

  spawnEnemy() {
    const lanes = [105, 175, 245, 315];
    const lane = Phaser.Utils.Array.GetRandom(lanes);
    const types = ["enemyRed", "enemyBlue", "enemyYellow", "enemyPurple"];
    const enemy = this.enemies.create(
      lane,
      -60,
      Phaser.Utils.Array.GetRandom(types)
    );

      enemy.setDisplaySize(45, 78);
      enemy.body.setSize(32, 62).setOffset(7, 8);

      enemy.setVelocityY(this.enemySpeed + Phaser.Math.Between(-25, 45));
      enemy.setVelocityX(0);
      enemy.setAngularVelocity(0);
  }

  hitEnemy() {
    if (this.gameOver) return;

    this.gameOver = true;
    this.physics.pause();
    this.player.setTint(0xff6666);
    this.finalScoreText.setText("Skor: " + Math.floor(this.score));
    this.gameOverPanel.setVisible(true);
  }

  update(time, delta) {
    if (this.gameOver) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
        this.scene.restart();
      }
      return;
    }

    const dt = delta / 1000;
    this.elapsed += dt;
    this.score += dt * 10;
    this.scoreText.setText("SKOR: " + Math.floor(this.score));

    // Musuh semakin cepat dan semakin sering muncul seiring waktu.
    this.enemySpeed = Math.min(620, 230 + this.elapsed * 5.5);
    const spawnDelay = Math.max(390, 1050 - this.elapsed * 7);
    this.spawnTimer += delta;

    if (this.spawnTimer >= spawnDelay) {
      this.spawnTimer = 0;
      this.spawnEnemy();

      if (this.elapsed > 18 && Math.random() < 0.22) {
        this.spawnEnemy();
      }
    }

    const speed = 285;
    let vx = 0;
    let vy = 0;

    if (this.keys.left.isDown) vx -= speed;
    if (this.keys.right.isDown) vx += speed;
    if (this.keys.up.isDown) vy -= speed;
    if (this.keys.down.isDown) vy += speed;

    if (vx !== 0 && vy !== 0) {
      vx *= Math.SQRT1_2;
      vy *= Math.SQRT1_2;
    }

    this.player.setVelocity(vx, vy);

    this.enemies.children.iterate(enemy => {
      if (enemy && enemy.y > GAME_H + 70) {
        enemy.destroy();
      }
    });

    const offset = (this.elapsed * this.enemySpeed * 0.65) % 105;
    this.drawRoad(offset);
  }
}

const config = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H,
  parent: "game",
  backgroundColor: "#27764b",
  physics: {
    default: "arcade",
    arcade: { debug: false }
  },
  scene: [RoadRush],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
