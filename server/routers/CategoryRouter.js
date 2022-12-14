const express = require("express")
const fs = require("fs")
const router = express.Router()
const {db,genid} = require("../db/DbUtils")

router.get("/list", async (req,res)=>{
    const search_sql = "SELECT * FROM `category`"

    let {err,rows} = await db.async.all(search_sql,[])

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

router.delete("/_token/delete",async (req,res)=>{
    let id = req.query.id
    const delete_sql = "DELETE FROM `category` WHERE `id` = ?"
    let {err,rows} = await db.async.run(delete_sql,[id])

    if (err==null){
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

router.put("/_token/update",async (req,res)=>{
    let {id,name,info} = req.body
    const update_sql = "UPDATE `category` SET `name` = ?,`info` = ? WHERE `id` = ?"
    let {err,rows} = await db.async.run(update_sql,[name,info,id])

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

router.post("/_token/add",async (req,res)=>{
    let {name,info} = req.body

    const insert_sql = "INSERT INTO `category` (`id`,`name`,`info`) VALUES (?,?,?)"
    let {err,rows} = await db.async.run(insert_sql,[genid.NextId(),name,info])
    
    if(err==null){
        res.send({
            code:200,
            msg:"添加成功"
        })
    }else{
        res.send({
            code:500,
            msg:"添加失败"
        })
    }
})

router.post("/upload",(req,res)=>{
    //检测是否有文件
    if (!req.files){
        res.send({
            code: 400,
            msg: "上传文件不能为空",
        });
        return;
    }
    //保存文件
    let files = req.files;
    let ret_files = [];
    for (let file of files){
        //文件后缀
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf('.')+1);
        //时间戳作为文件名
        let file_name = new Data().getTime()+'.'+file_ext;
        //移动文件并修改名字
        fs.renameSync(
            process.cwd()+"public/upload/temp/"+file.filename,
            process.cwd()+"public/upload/category/" + file_name
        );
        ret_files.push("public/upload/category/"+file_name);
    }
    res.send({
        code:200,
        msg:"上传成功",
        data:ret_files,
    });

})

router.get("/search",async (req,res)=>{
    let {keyword,page,pageSize} = req.query
    page = page == null ? 1 : page
    pageSize = pageSize == null ? 10 : pageSize
    keyword = keyword == null ? "" : keyword

    let params = []
    let whereSqls = []
    
    if (keyword != ""){
        whereSqls.push(" (`name` LIKE ? OR `info` LIKE ?) ")
        params.push("%"+keyword+"%")
        params.push("%"+keyword+"%")
    }
    let whereSqlStr = ""
    if (whereSqls.length>0){
        whereSqlStr = " WHERE " + whereSqls.join(" AND ")
    }

    let searchSql = " SELECT `id`,`name`,substr(`info`,0,20) AS `info` FROM `category`"+whereSqlStr+" ORDER BY `id` DESC LIMIT ?,? "
    let searchSqlParams = params.concat([(page-1)*pageSize,pageSize])

    let searchCountSql = " SELECT count(*) as `count` FROM `category` "+whereSqlStr;
    let searchCountParams = params

    let searchResult = await db.async.all(searchSql,searchSqlParams)
    let countResult = await db.async.all(searchCountSql,searchCountParams)

    if (searchResult.err == null && countResult.err==null){
        res.send({
            code:200,
            msg:"查询成功",
            data:{
                keyword,
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