// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Sprite)
    bird1: cc.Sprite = null;

    @property(cc.Sprite)
    bird2: cc.Sprite = null;

    @property(cc.Sprite)
    bird3: cc.Sprite = null;

    @property(cc.Sprite)
    bird4: cc.Sprite = null;

    @property
    text: string = 'hello';

    @property(cc.Node)
    birdParent: cc.Node = null;

    @property(cc.Node)
    bg1: cc.Node = null;
    
    @property(cc.Node)
    bg2: cc.Node = null;

    @property(cc.Node)
    pipeParent1: cc.Node = null;

    @property(cc.Node)
    pipeParent2: cc.Node = null;

    @property(cc.Node)
    pipeParent3: cc.Node = null;

    @property(cc.Label)
    lbScore: cc.Label = null;

    @property(cc.Node)
    nodeGameOver: cc.Node = null;

    @property(cc.Node)
    btnStart: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    time: number = 0; //距离上次切换显示的小鸟流逝的时间

    speed: number = 0;

    score: number = 0;

    isGameStart: boolean = false;

    start () {

        let pipeStartOffsetX: number = 200;
        let spaceX = (284+52)/3;
        this.pipeParent1.x = pipeStartOffsetX + spaceX*0;
        this.pipeParent2.x = pipeStartOffsetX + spaceX*1;
        this.pipeParent3.x = pipeStartOffsetX + spaceX*2;

        this.nodeGameOver.active = false;
    }

    update (dt: number) {
        let timeTmp = this.time + dt;
        this.time = timeTmp; 
        
        if(this.time > 0.5) {   //距离上次切换时间过去了0.5s
            if(this.bird1.node.active) {
                this.bird1.node.active = false;
                this.bird2.node.active = true;
            } else if(this.bird2.node.active) {
                this.bird2.node.active = false;
                this.bird3.node.active = true;
            } else if(this.bird3.node.active) {
                this.bird3.node.active = false;
                this.bird4.node.active = true;
            } else if(this.bird4.node.active) {
                this.bird4.node.active = false;
                this.bird1.node.active = true;
            }
            this.time = 0;
        }

        // let birdY = this.birdParent.y;
        // this.birdParent.y = birdY-2;
        
        if(this.isGameStart) {
            this.speed = this.speed - 0.05;
            this.birdParent.y = this.birdParent.y+this.speed;

            this.birdParent.rotation = -this.speed*10;

            this.moveBg(this.bg1);
            this.moveBg(this.bg2);

            this.movePipe(this.pipeParent1);
            this.movePipe(this.pipeParent2);
            this.movePipe(this.pipeParent3);

            this.checkCollision(this.birdParent, this.pipeParent1);
            this.checkCollision(this.birdParent, this.pipeParent2);
            this.checkCollision(this.birdParent, this.pipeParent3);
        }
    }

    moveBg(bg: cc.Node) {
        bg.x = bg.x - 1;
        if(bg.x < -284) {
            bg.x = bg.x + 284*2;
        }
    }

    movePipe(pipe: cc.Node) {
        pipe.x = pipe.x-3;
        if(pipe.x < (-142-26)) {
            pipe.x = pipe.x + 284+ 52;

            pipe.y = 50 - (Math.random()*50);

            //管子从屏幕上消失一个记一分
            //这个已经符合积分原则了
            this.score = this.score + 1;
            this.lbScore.string = this.score.toString();
        }
    }

    onButtonClick() {
        this.speed = 1.5;
    }

    checkCollision(bird: cc.Node, pipe: cc.Node) {
        //还未进入管子中间
        if((bird.x+17) < (pipe.x-26)) { //小鸟的右边x小于管子左边x
            return;
        }
        //已经离开管子
        if((bird.x-17) > (pipe.x+26)) {
            return;
        }
        //在管子内没有和上下碰撞接触
        if((bird.y<pipe.y+50) && (bird.y>pipe.y-50)) {
            return;
        }
        this.gameOver();
        console.log("发生了碰撞！！！");
    }

    onButtonStartClick() {
        this.isGameStart = true;
        this.nodeGameOver.active = false;
        this.btnStart.active = false;

        this.resetGame();
    }

    gameOver() {
        this.isGameStart = false;
        this.nodeGameOver.active = true;
        this.btnStart.active = true;
    }

    resetGame() {
        this.nodeGameOver.active = false;
        this.btnStart.active = false;

        this.birdParent.x = 0;
        this.birdParent.y = 0;

        this.speed = 0;

        let pipeStartOffsetX: number = 200;
        let spaceX = (284+52)/3;
        this.pipeParent1.x = pipeStartOffsetX + spaceX*0;
        this.pipeParent2.x = pipeStartOffsetX + spaceX*1;
        this.pipeParent3.x = pipeStartOffsetX + spaceX*2;

        this.time = 0;
        this.score = 0;
        this.lbScore.string = this.score.toString();
    }
}
