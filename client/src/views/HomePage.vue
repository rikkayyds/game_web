<template>
    <div class="container">
        <div class="nav">
            <div @click="homePage">首页</div>
            <div @click="dashboard">后台</div>
        </div>
        <n-divider />

        <n-space class="search">
            <n-input v-model:value="pageInfo.keyword" :style="{width:'500px'}" placeholder="请输入关键字"/>
            <n-button type="primary" ghost @click="loadCategorys(0)"> 搜索 </n-button>
        </n-space>
        <n-divider />
        <div v-for="(game,index) in categoryOptions" style="margin-bottom:15px">
                <n-card class="card" :title="game.name" @click="toGame(game.id)">
                    <div v-if="game.id==364289964318789">
                        <img src="../assets/shade_dog/img/cut.png" alt=""/>
                    </div>
                    <div v-html="game.info"></div>
                </n-card>
        </div>
        <n-divider />
        <n-space>
            <n-pagination @update:page="loadCategorys" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount"/>   
        </n-space>
        <n-divider />
        <div class="footer">
            <div>Power by xxxx</div>
            <div>XICP备xxxx号-1</div>
        </div>
    </div>
</template>

<script setup>
import { ref,reactive,inject,onMounted,computed } from 'vue';
import { useRouter,useRoute } from 'vue-router';

const router = useRouter()
const route = useRoute()

const message = inject('message')
const dialog = inject('dialog')
const axios = inject('axios')

const categoryOptions = ref([])

const pageInfo = reactive({
    page:1,
    pageSize:2,
    pageCount:0,
    count:0,
    keyword:""
})

onMounted(()=>{
    loadCategorys()
})

const loadCategorys = async (page = 0)=>{
    if (page!=0){
        pageInfo.page = page
    }
    let res = await axios.get(`/category/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
    let temp_rows = res.data.data.rows;
    categoryOptions.value = temp_rows;
    pageInfo.count = res.data.data.count;
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
}

const toGame = (id)=>{
    if(id==364289964318789){
        router.push('/game/'+id)
    }
}

const homePage = ()=>{
    router.push('/')
}
const dashboard = ()=>{
    router.push('/login')
}
</script>

<style lang="scss" scoped>

.container{
    width: 1200px;
    margin: 0 auto;
}
.nav{
    display: flex;
    font-size: 20px;
    padding-top: 20px;
    color: #64676a;
    div{
        cursor: pointer;
        margin-right: 20px;

        &:hover{
            color: #f60;
        }
    }
}
img{
    max-width: 20%;
    max-height: 10%;
}
.card{
    cursor: pointer;
    &:hover{
        background-color: #777e84;
    }
}
</style>