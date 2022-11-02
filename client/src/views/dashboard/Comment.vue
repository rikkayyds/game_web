<template>
    <n-tabs v-model:value="tabValue" justify-content="start" type="line" animated>
        <n-tab-pane name="list" tab="评论列表">
            <div v-for="(comment,index) in commentList" style="margin-botton:15px">
                <n-card :title="comment.title">
                    {{comment.content}}
                    <template #footer>
                        <n-space align="center" justify="space-between">
                            <div>
                                <n-rate readonly :value="comment.score" />
                                <div style="font-size:10px">发布人:{{comment.author}}</div>
                                <div style="font-size:10px">发布时间:{{comment.create_time}}</div>
                            </div>
                            <div>
                                <n-space>
                                    <n-button @click="toUpdate(comment)">修改</n-button>
                                    <n-button @click="toDelete(comment)">删除</n-button>
                                </n-space>
                                
                            </div>
                            
                        </n-space>  
                    </template>
                </n-card>
            </div>
            <n-space>
                <n-pagination @update:page="loadComments" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount"/>   
            </n-space>
        </n-tab-pane>
        <n-tab-pane name="add" tab="添加评论">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="addComment.title" placeholder="请输入标题"/>
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="addComment.category_id" :options="categoryOptions"/>
                </n-form-item>
                <n-form-item label="用户">
                    <n-input v-model:value="addComment.author" placeholder="请输入用户名"/>
                </n-form-item>
                <n-form-item label="评分">
                    <n-rate v-model:value="addComment.score" />
                </n-form-item>
                <n-form-item label="内容">
                    <rich-text-editor v-model="addComment.content"></rich-text-editor>
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="add">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
        <n-tab-pane name="update" tab="修改">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="updateComment.title" placeholder="请输入标题"/>
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="updateComment.category_id" :options="categoryOptions"/>
                </n-form-item>
                <n-form-item label="用户">
                    <n-input v-model:value="updateComment.author" placeholder="请输入用户名"/>
                </n-form-item>
                <n-form-item label="评分">
                    <n-rate v-model:value="updateComment.score" />
                </n-form-item>
                <n-form-item label="内容">
                    <rich-text-editor v-model="updateComment.content"></rich-text-editor>
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="update">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
    </n-tabs>
</template>

<script setup>
import {ref,reactive,inject,onMounted} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import RichTextEditor from '../../components/RichTextEditor.vue'

const message = inject("message")
const axios = inject("axios")

const commentList = ref([])
const categoryOptions = ref([])
const tabValue = ref("list")

const pageInfo = reactive({
    page:1,
    pageSize:4,
    pageCount:0,
    count:0,
})

onMounted(()=>{
    loadComments()
    loadCategorys()
})

const loadComments = async (page = 0)=>{
    if (page!=0){
        pageInfo.page = page
    }
    //console.log(pageInfo.page)
    let res = await axios.get(`/comment/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
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

const loadCategorys = async ()=>{
    let res = await axios.get('/category/list')
    categoryOptions.value = res.data.rows.map((item)=>{
        return{
            label:item.name,
            value:item.id
        }
    })
}

const addComment = reactive({
    category_id:"",
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

const updateComment = reactive({
    id:0,
    category_id:"",
    title:"",
    author:"",
    score:0,
    content:"",
})

const toUpdate = async (comment)=>{
    tabValue.value = "update"
    let res = await axios.get("/comment/detail?id="+comment.id)
    updateComment.id = comment.id
    updateComment.category_id = res.data.rows[0].category_id
    updateComment.title = res.data.rows[0].title
    updateComment.author = res.data.rows[0].author
    updateComment.score = res.data.rows[0].score
    updateComment.content = res.data.rows[0].content
}

const update = async ()=>{
    let res = await axios.put("/comment/_token/update",updateComment)
    if (res.data.code==200){
        message.info(res.data.msg)
        loadComments()
        tabValue.value="list"
    }else{
        message.error(res.data.msg)
    }
}
const toDelete = async (comment)=>{
    let res = await axios.delete("/comment/_token/delete?id="+comment.id)
    if (res.data.code==200){
        message.info(res.data.msg)
        loadComments()
    }else{
        message.error(res.data.msg)
    }
}

</script>

<style lang="scss" scoped>

</style>