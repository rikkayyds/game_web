<template>
    <div class="container">
        <div class="nav">
            <div>首页</div>
            <div>后台</div>
        </div>
    </div>
</template>

<script setup>

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
</style>