import {createRouter, createWebHashHistory} from "vue-router";

let routes = [
    {path:"/test",component:()=>import("../views/Test.vue")},
    {path:"/",component:()=>import("../views/HomePage.vue")},
    {path:"/login",component:()=>import("../views/Login.vue")},
    {
        path:"/dashboard",component:()=>import("../views/dashboard/Dashboard.vue"),
        children:[
            {path:"/dashboard/comment",component:()=>import("../views/dashboard/Comment.vue")},
        ]
    },
    {
        path:"/game",component:()=>import("../views/game/Game.vue"),
        children:[
            {path:"/game/shade_dog",component:()=>import("../views/game/ShadeDog.vue")},
        ]
    },

]

const router = createRouter({
    history:createWebHashHistory(),
    routes,
})

export {router,routes}