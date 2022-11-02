<template>
    <div class="main-panel">
        <div class="menus">
            <div v-for="(menu,index) in menus" @click="toPage(menu)">
                {{ menu.name }}
            </div>
        </div>
        <div style="padding:20px;width:100%">
            <router-view></router-view>
        </div>
    </div>
    
</template>

<script setup>
import { useRouter,useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()
let menus = [
    {name:"Shade Dog",href:"/game/shade_dog"},
]
const toPage = (menu)=>{
    router.push(menu.href)
}
</script>

<style lang="scss" scoped>
.main-panel{
    display: flex;
    color: #64676a;
    max-width: 1500px;
    margin: 0 auto;
}
.menus{
    padding: 20px 0;
    box-sizing: border-box;
    line-height: 55px;
    text-align: center;
    width: 180px;
    height: 95vh;
    border-right: 1px solid #dadada;

    div {
        cursor: pointer;
        &:hover {
            color: #fd760e;
        }
    }
}
</style>