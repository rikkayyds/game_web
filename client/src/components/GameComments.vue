<template>
    <n-collapse>
        <n-collapse-item title="查看评论" name="1">
            <n-card>
                <div v-for="(comment,index) in commentList" style="margin-bottom:15px;">
                    <n-card :title="comment.title">
                        {{comment.content}}
                        <template #footer>
                            <n-space align="center" justify="space-between">
                                <div>
                                    <n-rate readonly :value="comment.score" />
                                    <div style="font-size:10px">发布人:{{comment.author}}</div>
                                    <div style="font-size:10px">发布时间:{{comment.create_time}}</div>
                                </div>
                            </n-space>  
                        </template>
                    </n-card>
                </div> 
            </n-card>
        </n-collapse-item>
        <n-collapse-item title="我要评论" name="2">
            <n-card>
                <n-form>
                    <n-form-item label="标题">
                        <n-input v-model:value="addComment.title" placeholder="请输入标题"/>
                    </n-form-item>
                    <n-form-item label="昵称">
                        <n-input v-model:value="addComment.author" placeholder="请输入昵称"/>
                    </n-form-item>
                    <n-form-item label="评分">
                        <n-rate v-model:value="addComment.score" />
                    </n-form-item>
                    <n-form-item>   
                        <rich-text-editor></rich-text-editor>
                    </n-form-item>
                    <n-form-item label="">
                        <n-button @click="add">提交</n-button>
                    </n-form-item>
                </n-form>
            </n-card>
        </n-collapse-item>
    </n-collapse>
</template>

<script setup>
import {ref,reactive,inject,onMounted} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import RichTextEditor from './RichTextEditor.vue'

const props = defineProps({
    gameID: {
        type: String,
        default: ""
    }
})


const message = inject("message")
const axios = inject("axios")

const commentList = ref([])

const pageInfo = reactive({
    page:1,
    pageSize:4,
    pageCount:0,
    count:0,
})

onMounted(()=>{
    loadComments();
})

const loadComments = async (page = 0)=>{
    if (page!=0){
        pageInfo.page = page
    }
    //console.log(pageInfo.page)
    let res = await axios.get(`/comment/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&category_id=${props.gameID}`)
    let temp_rows = res.data.data.rows;
    for (let row of temp_rows){
        if(row.content.length>20){
            row.content += "..."
        }
        let d = new Date(row.create_time)
        row.create_time = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`
    }
    commentList.value = temp_rows;
    pageInfo.count = res.data.data.count;
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
}

const addComment = reactive({
    category_id:props.gameID,
    title:"",
    author:"",
    score:3,
    content:"",
})

const add = async ()=>{
    if(addComment.title==""){
        message.error("标题不能为空")
        return
    }
    if(addComment.category_id == ""){
        message.error("请选择要评论的游戏")
        return
    }
    if(addComment.author==""){
        message.error("用户名不能为空")
        return
    }
    if(addComment.content==""){
        message.error("评论内容不能为空")
        return
    }
    let res = await axios.post("/comment/add",addComment)
    if(res.data.code==200){
        message.info(res.data.msg)
        tabValue.value = "list"
        loadComments()
    }else{
        message.error(res.data.msg)
    }
}

</script>

<style lang="scss" scoped>

</style>