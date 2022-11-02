<template>
    <canvas id="canvas1" ref="canvas"></canvas>
    <button @click="stop">stop</button>
    <button @click="start">start</button>
</template>

<script setup>
import {onMounted, ref} from 'vue'
const canvas = ref();
let flag = true;
const stop = ()=>{
    flag = false;
}
const start = ()=>{
    flag = true;
    run()
}
const run = ()=>{
    let ctx = canvas.value.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;
    let x = 0
    function animate(){
        console.log('x:'+x)
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.strokeRect(x,0,100,100)
        x += 1;
        if (flag == true){
            requestAnimationFrame(animate)
        }
    }
    animate()
}
onMounted(()=>{
    run()
})
</script>

<style lang="scss" scoped>
#canvas1{
    width: 500px;
    height: 500px;
    border: 1px solid black;
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%,-50%);
    // max-width: 100%;
    // max-height: 100%;
}
</style>