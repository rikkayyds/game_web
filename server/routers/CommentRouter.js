const express = require("express")
const router = express.Router()
const {db,genid} = require("../db/DbUtils")

router.get("/detail", async (req,res)=>{
    let {id} = req.query
    const detail_sql = "SELECT * FROM `comment` WHERE `id` = ?"

    let {err,rows} = await db.async.all(detail_sql,[id])

    if (err==null){
        res.send({
            code:200,
            msg:"查询成功",
            rows
        })
    }else{
        res.send({
            code:500,
            msg:"查询失败"
        })
    }
})

router.post("/add",async (req,res)=>{
    let {category_id,title,author,content,score} = req.body;
    let id = genid.NextId();
    let create_time = new Date().getTime();
    
    const insert_sql = "INSERT INTO `comment` (`id`,`category_id`,`title`,`author`,`content`,`score`,`create_time`) VALUES (?,?,?,?,?,?,?)"
    let params = [id,category_id,title,author,content,score,create_time]
    let {err,rows} = await db.async.run(insert_sql,params)

    if(err==null){
        res.send({
            code:200,
            msg:"添加成功"
        })
    }else{
        res.send({
            code:500,
            msg:"添加失败",
            err
        })
    }
})

router.put("/_token/update",async (req,res)=>{
    let {id,title,content}=req.body;
    let create_time = new Date().getTime();

    const update_sql = "UPDATE `comment` SET `title` = ?,`content` = ?,WHERE `id` = ?"
    let params = [title,content,id]
    let {err,rows} = await db.async.run(update_sql,params)

    if(err==null){
        res.send({
            code:200,
            msg:"修改成功"
        })
    }else{
        res.send({
            code:500,
            msg:"修改失败"
        })
    }
})

router.delete("/_token/delete",async (req,res)=>{
    let id = req.query.id
    const delete_sql = "DELETE FROM `comment` WHERE `id` = ?"
    let {err,rows} = await db.async.run(delete_sql,[id])

    if(err==null){
        res.send({
            code:200,
            msg:"删除成功"
        })
    }else{
        res.send({
            code:500,
            msg:"删除失败"
        })
    }
})

//关键字分页查询
router.get("/search",async (req,res)=>{
    let {keyword,category_id,page,pageSize} = req.query
    page = page == null ? 1 : page
    pageSize = pageSize == null ? 10 : pageSize
    category_id = category_id == null ? 0 : category_id
    keyword = keyword == null ? "" : keyword

    let params = []
    let whereSqls = []
    if (category_id != 0){
        whereSqls.push("`category_id` = ? ")
        params.push(category_id)
    }
    if (keyword != ""){
        whereSqls.push(" (`title` LIKE ? OR `content` LIKE ?) ")
        params.push("%"+keyword+"%")
        params.push("%"+keyword+"%")
    }
    let whereSqlStr = ""
    if (whereSqls.length>0){
        whereSqlStr = " WHERE " + whereSqls.join(" AND ")
    }

    let searchSql = " SELECT `id`,`category_id`,`title`,`author`,substr(`content`,0,20) AS `content`,`score`,`create_time` FROM `comment`"+whereSqlStr+" ORDER BY `create_time` DESC LIMIT ?,? "
    let searchSqlParams = params.concat([(page-1)*pageSize,pageSize])

    let searchCountSql = " SELECT count(*) as `count` FROM `comment` "+whereSqlStr;
    let searchCountParams = params

    let searchResult = await db.async.all(searchSql,searchSqlParams)
    let countResult = await db.async.all(searchCountSql,searchCountParams)

    if (searchResult.err == null && countResult.err==null){
        res.send({
            code:200,
            msg:"查询成功",
            data:{
                keyword,
                category_id,
                page,
                pageSize,
                rows:searchResult.rows,
                count:countResult.rows[0].count
            }
        })
    }else{
        res.send({
            code: 500,
            msg:"查询失败"
        })
    }
})

module.exports = router