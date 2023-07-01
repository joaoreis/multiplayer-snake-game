<template>
  <div class="canvas">
    <canvas
      id="snake-canvas"
      :width="boardSizePx()"
      :height="boardSizePx()"
    ></canvas>
    <div v-if="state.gameFinished" class="scores">Scores: {{ userScore }}</div>
    <button v-if="!state.gameIsRunning" id="play-btn" v-on:click="startGame">
      {{ isPlaying ? "Stop" : "Play" }}
    </button>
  </div>
</template>

<script setup>
import constants from "@/utils/constants";
import { useUserStore } from "@/storage/user";
import { onMounted, defineProps, reactive, onBeforeMount, ref } from "vue";
// import { mapState } from "pinia";

class Canvas {
  constructor() {
    this.canvas = document.getElementById("snake-canvas");
    this.context = this.canvas.getContext("2d");
  }
}

class Coordenates {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class MapGrid extends Canvas {
  boardSize;
  boardSizePx;
  running;
  cellSize;
  speed;
  constructor(boardSize = 0, boardSizePx = 0, cellSize, speed) {
    super();
    this.boardSize = new Coordenates(boardSize, boardSize);
    this.boardSizePx = boardSizePx;
    this.running = false;
    this.cellSize = cellSize;
    this.speed = speed;
    this.startGame = this.startGame.bind(this);
  }
  clear() {
    this.context.clearRect(0, 0, this.boardSizePx, this.boardSizePx);
  }
  middleCell() {
    let middleX = Math.round(this.boardSize.x / 2);
    let middleY = Math.round(this.boardSize.y / 2);

    return new Coordenates(middleX, middleY);
  }
  /**
   * @param {Coordenates} vertebraes
   * @param {boolean} isMainPlayer
   */
  drawSnake(vertebraes, isMainPlayer) {
    let board = this.context;
    vertebraes.forEach(({ x, y }) => {
      board.rect(
        x * this.cellSize,
        y * this.cellSize,
        this.cellSize,
        this.cellSize
      );
      board.fillStyle = isMainPlayer ? "blue" : "black";
      board.fill();
    });
  }
  getMoveDelay() {
    return (2 / Number(this.speed)) * 1000;
  }
  startGame() {
    this.running = true;
    // socket init
  }
  drawTarget(target) {
    this.context.beginPath();
    this.context.rect(
      target.x * this.cellSize,
      target.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
    this.context.fillStyle = "red";
    this.context.fill();
    this.context.closePath();
  }
  stop() {
    this.running = false;
    this.clear();
  }
}

let board = null;

const props = defineProps({
  cellSize: Number,
  boardSize: Number,
  speed: Number,
  addScores: Function,
  scores: Number,
});

const { nickname, socket } = useUserStore();

const state = reactive({
  userToken: null,
  showGameScore: false,
  gameScores: [],
  gameIsRunning: false,
  gameFinished: false,
});

const userScore = ref(0);

socket.on("mapState", (mapState) => {
  board.clear();
  for (const [key, snake] of Object.entries(mapState.snakes)) {
    const isMainPlayer = key == nickname;
    board.drawSnake(snake.vertebraes, isMainPlayer);
  }
  mapState.targetCells.forEach((target) => {
    board.drawTarget(target);
  });

  state.gameScores = Object.values(mapState.scores);
  userScore.value = mapState.scores[nickname];
});

socket.on("gameFinished", () => {
  state.gameScores = [10, 20];
  state.gameIsRunning = false;
  state.gameFinished = true;
});

const boardSizePx = () => {
  return props.cellSize * props.boardSize;
};

onMounted(() => {
  const boardPx = boardSizePx();

  board = new MapGrid(props.boardSize, boardPx, props.cellSize, props.speed);
  window.addEventListener("keydown", onKeyPress);
});

onBeforeMount(() => {
  board = null;
  window.removeEventListener("keydown", onKeyPress);
});

const onKeyPress = (event) => {
  const newDirection = constants.find((c) => c.keyCode === event.keyCode);

  if (!newDirection) {
    return;
  }

  sendKeyPressedToSocket(newDirection.direction);
};

const sendKeyPressedToSocket = async (keyPress) => {
  const body = {
    userId: nickname,
    userMovement: keyPress,
  };

  socket.emit("move", body);
};

const startGame = async () => {
  socket.emit("startSoloGame", { userId: nickname });
  state.gameIsRunning = true;
};
</script>

<style lang="scss">
#snake-canvas {
  position: relative;
  border: 1px solid #ccc;
  height: 100%;
  background-color: rgb(248, 248, 248);
}

.canvas {
  display: flex;
  flex-direction: column;
  background-color: rgb(248, 248, 248);
}

.scores {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 300px;
  height: 300px;
  background-color: blue;
}

#play-btn {
  position: absolute;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  top: 50%;
  left: 50%;
  height: 4rem;
  padding: 0 1.5rem;
  background-color: #f7f6f6;
  border: 2px solid #a6a6a6;
  border-radius: 5px;
  -moz-box-shadow: 0 0 3px #ccc;
  -webkit-box-shadow: 0 0 3px #ccc;
  box-shadow: 0 0 3px #ccc;
  transform: translate(-50%, -50%);

  &:hover {
    background-color: #a6a6a6;
  }
}
</style>
