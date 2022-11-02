export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Helvetica';
        this.livesImage = document.getElementById('lives');
    }
    draw(context){
        context.save();
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColot;
        context.fillText('Score: '+this.game.score,20,50);
        //context.font = this.fontSize *0.8+'px '+this.fontFamily;
        //context.fillText('Time: '+(this.game.time*0.001).toFixed(1),20,80);
        
        for (let i=0;i<this.game.lives;i++){
            context.drawImage(this.livesImage,25*i+20,95,25,25)
        }
        if (this.game.gameOver){
            context.textAlign = 'center';
            context.font = this.fontSize*2+'px '+this.fontFamily;
            context.fillText('Game Over',this.game.width*0.5,this.game.height*0.5);
        }
        context.restore();
    }
}