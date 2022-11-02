<template>
    <img id="player" src="../../assets/shade_dog/img/dog.png" alt="">
    <img id="layer1" src="../../assets/shade_dog/img/background/1.png" alt="">
    <img id="layer2" src="../../assets/shade_dog/img/background/2.png" alt="">
    <img id="layer3" src="../../assets/shade_dog/img/background/3.png" alt="">
    <img id="layer4" src="../../assets/shade_dog/img/background/4.png" alt="">
    <img id="layer5" src="../../assets/shade_dog/img/background/5.png" alt="">
    <img id="enemy_fly" src="../../assets/shade_dog/img/enemy_fly.png" alt="">
    <img id="enemy_plant" src="../../assets/shade_dog/img/enemy_plant.png" alt="">
    <img id="enemy_spider_big" src="../../assets/shade_dog/img/enemy_spider_big.png" alt="">
    <img id="fire" src="../../assets/shade_dog/img/fire.png" alt="">
    <img id="collisionAnimation" src="../../assets/shade_dog/img/boom.png" alt="">
    <img id="lives" src="../../assets/shade_dog/img/lives.png" alt="">
    <n-card title="Shade Dog" content-style="padding: 20px;" style="margin-bottom:20px">
        <canvas id="canvas1" ref="canvasRef"></canvas>
        <n-divider />
        <n-space>
            <n-button @click="stop">暂停</n-button>
            <n-button @click="start">开始/重新开始</n-button>
        </n-space>
    </n-card>
    
    <n-card title="操作方式" content-style="padding: 20px;" style="margin-bottom:20px">
        <div>
            方向键 '↑'，'↓'，'←'，'→' 控制小狗位置，按键 ‘a’ 变为滚动，滚动状态下触碰敌人会获得分数，非滚动状态下触碰敌人会陷入短暂昏迷(总共有5次机会)。
        </div>
        <div>
            按上方按钮 ’暂停‘ 可暂停游戏，’开始/重新开始‘ 为继续游戏或游戏结束后重新开始游戏。
        </div>
    </n-card>

    <game-comments v-model:gameID="gameID"></game-comments>
    
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {Game} from '../../assets/shade_dog/js/game'
import GameComments from "../../components/GameComments.vue";

const gameID = ref(364289964318789)

const canvasRef = ref()
let canvas = null;
let ctx = null;
let game = null;
let gameStop = false

const initGame = ()=>{
    gameStop = false;
    canvas = canvasRef.value;
    ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;
    game = new Game(canvas.width,canvas.height);
}

const stop = ()=>{
    //console.log('stop')
    gameStop = true
}
const start = ()=>{
    //console.log('start')
    if (game.gameOver){
        initGame()
        run()
    }else{
        if(!gameStop){
            return
        }else{
            gameStop = false
            run()
        }
    }
}

const run = ()=>{
    let lastTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver && !gameStop) requestAnimationFrame(animate)
    }
    animate(0)
}

onMounted(()=>{
    initGame()
    run()
})


</script>

<style lang="scss" scoped>
#canvas1{
    max-width: 100%;
    max-height: 100%;
}
img{
    display: none;
}
</style>