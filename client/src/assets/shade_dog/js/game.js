import {Player} from './player.js';
import {InputHandle} from './input.js';
import {Background} from './background.js';
import {FlyingEnemy,GroundEnemy,ClimbingEnemy} from './enemy.js';
import {UI} from './ui.js';

export class Game {
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.groundMargin = 80;
        this.speed = 0;
        this.maxSpeed = 3;
        this.background = new Background(this);
        this.player = new Player(this);
        this.input = new InputHandle(this);
        this.UI = new UI(this);
        this.enemies = [];
        this.particles = [];
        this.collisions = [];
        this.floatingMessages = [];
        this.maxParticles = 200;
        this.enemyTimer = 0;
        this.enemyInterval = 1000;
        this.debug = false;
        this.score = 0;
        this.fontColor = 'black';
        //this.time = 0;
        //this.maxTime = 20000;
        this.gameOver = false;
        this.lives = 5;
        this.player.currentState = this.player.states[0];
        this.player.currentState.enter();
    }
    update(deltaTime){
        this.time+=deltaTime;
        //if (this.time>this.maxTime) this.gameOver = true;
        this.background.update()
        this.player.update(this.input.keys,deltaTime);
        if (this.enemyTimer > this.enemyInterval){
            this.addEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer+=deltaTime;
        }
        this.enemies.forEach(enemy=>{
            enemy.update(deltaTime);
        });
        this.floatingMessages.forEach(floatingMessage=>{
            floatingMessage.update();
        });
        this.particles.forEach((particle,index)=>{
            particle.update();
        });
        if (this.particles.length>this.maxParticles){
            this.particles.length = this.maxParticles;
        }
        this.collisions.forEach((collision,index)=>{
            collision.update(deltaTime);
        });
        this.enemies = this.enemies.filter(enemy=>!enemy.markedForDeletion);
        this.particles = this.particles.filter(particle=>!particle.markedForDeletion);
        this.collisions = this.collisions.filter(collision=>!collision.markedForDeletion);
        this.floatingMessages = this.floatingMessages.filter(message=>!message.markedForDeletion);
    }
    draw(context){
        this.background.draw(context)
        this.player.draw(context);
        this.enemies.forEach(enemy=>{
            enemy.draw(context);
        })
        this.particles.forEach(particles=>{
            particles.draw(context);
        });
        this.collisions.forEach(collision=>{
            collision.draw(context);
        });
        this.floatingMessages.forEach(floatingMessage=>{
            floatingMessage.draw(context);
        });
        this.UI.draw(context);
    }
    addEnemy(){
        if (this.speed > 0 && Math.random()<0.5){
            this.enemies.push(new GroundEnemy(this));
        }
        else if (this.speed>0){
            this.enemies.push(new ClimbingEnemy(this));
        }
        this.enemies.push(new FlyingEnemy(this));
    }
}