export class InputHandle{
    constructor(game){
        this.game = game;
        this.keys = [];
        window.addEventListener('keydown',e=>{
            //console.log(e.key);
            if (    e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight'
                ) {
                e.preventDefault();
            }

            if ((   e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'a'
                ) && this.keys.indexOf(e.key)===-1){
                    this.keys.push(e.key);
            } else if(e.key === 'd'){
                //this.game.debug = !this.game.debug;
            }
        });
        window.addEventListener('keyup',e=>{
            if (e.key ==='ArrowDown'|| 
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'a'){
                this.keys.splice(this.keys.indexOf(e.key),1);
            }
        })
    }
}