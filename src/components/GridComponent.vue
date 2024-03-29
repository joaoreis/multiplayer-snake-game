<template>
  <div class="canvas">
    <canvas
      v-show="!state.gameFinished"
      id="snake-canvas"
      :width="boardSizePx()"
      :height="boardSizePx()"
    ></canvas>
    <div v-if="state.gameFinished" class="scores">
      {{ mainPlayerWins ? "Parabéns, você GANHOU!" : "Você PERDEU!" }}
      <div class="scores__points">
        <span v-for="(value, name, index) in state.gameScores" :key="index">
          Jogador: {{ name }} <br />Pontuação: {{ value }}
        </span>
      </div>
    </div>
    <button v-if="!state.gameIsRunning" id="play-btn" v-on:click="startGame">
      {{ "Play" }}
    </button>
  </div>
</template>

<script setup>
import constants from "@/utils/constants";
import { useUserStore } from "@/storage/user";
import {
  onMounted,
  defineProps,
  reactive,
  onBeforeMount,
  ref,
  defineEmits,
} from "vue";
import router from "@/router";

class Canvas {
  constructor() {
    this.canvas = document.getElementById("snake-canvas");
    this.context = this.canvas.getContext("2d");
  }
}

class Coordinates {
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
    this.boardSize = new Coordinates(boardSize, boardSize);
    this.boardSizePx = boardSizePx;
    this.running = false;
    this.cellSize = cellSize;
    this.speed = speed;
    this.startGame = this.startGame.bind(this);
  }
  clear() {
    this.context.clearRect(0, 0, this.boardSizePx, this.boardSizePx);
  }

  /**
   * @param { Array } vertebraes
   * @param {boolean} isMainPlayer
   */
  drawSnake(vertebraes, isMainPlayer) {
    let board = this.context;

    vertebraes.forEach(({ x, y }) => {
      board.fillStyle = "rgba(255, 255, 255, 0.801)";
      board.fillRect(
        x * this.cellSize,
        y * this.cellSize,
        this.cellSize,
        this.cellSize
      );
      board.fillStyle = isMainPlayer ? "#3797f5" : "#ebff20d1";

      board.fillRect(
        x * this.cellSize + 1,
        y * this.cellSize + 1,
        this.cellSize - 2,
        this.cellSize - 2
      );
    });

    board.fillStyle = isMainPlayer ? "#37d7f5" : "#ebfa40d1";
    board.fillRect(
      vertebraes[vertebraes.length - 1].x * this.cellSize,
      vertebraes[vertebraes.length - 1].y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
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
}

let board = null;

const props = defineProps({
  cellSize: Number,
  boardSize: Number,
  speed: Number,
  isPlaying: Boolean,
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
  // lock: false,
});

const emits = defineEmits(["newScore"]);

const userScore = ref(0);

const mainPlayerWins = ref(false);

socket.on("mapState", (mapState) => {
  if (!state.gameIsRunning) {
    state.gameIsRunning = true;
  }
  board.clear();
  for (const [key, snake] of Object.entries(mapState.snakes)) {
    const isMainPlayer = key === nickname;
    board.drawSnake(snake.vertebraes, isMainPlayer);
  }
  mapState.targetCells.forEach((target) => {
    board.drawTarget(target);
  });

  state.gameScores = mapState.scores;
  userScore.value = mapState.scores[nickname];
  emits("newScore", userScore.value);
});

socket.on("gameFinished", ({ gameLoser }) => {
  state.gameIsRunning = false;
  state.gameFinished = true;
  if (nickname !== gameLoser) mainPlayerWins.value = true;
  socket.close();
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
  if (state.gameFinished) {
    await router.push({ name: "login" });

    return;
  }

  socket.emit("startSoloGame", { userId: nickname });
  state.gameIsRunning = true;
};
</script>

<style lang="scss">
#snake-canvas {
  position: relative;
  height: 100%;
  background-color: #101022;
}

.canvas {
  display: flex;
  flex-direction: column;
  background-color: #252551;
}

.scores {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  row-gap: 1rem;
  color: rgba(255, 255, 255, 0.801);
  background-color: #252551;
  height: 600px;
  width: 600px;
  padding: 3rem 2rem 2rem;

  &__points {
    display: flex;
    column-gap: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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
  background-color: rgba(57, 57, 129, 0.534);
  color: white;
  border: 2px solid #a6a6a6;
  border-radius: 5px;
  -moz-box-shadow: 0 0 3px #ccc;
  -webkit-box-shadow: 0 0 3px #ccc;
  box-shadow: 0 0 3px #ccc;
  transform: translate(-50%, -50%);

  &:hover {
    background-color: rgba(26, 26, 56, 0.5254901961);
  }
}
</style>
