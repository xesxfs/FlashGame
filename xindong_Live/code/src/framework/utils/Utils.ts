/**
 * 通用方法，或者高频调用的一组语句的sugar
 * @author sven
 */
module Utils {
    heartFlutter
    /**
     * 创建并播放心动值增加特效
     */
    export function heartFlutter(heartNum: number) {
        Utils.flutter(heartNum, "levelParticle", "shuzi1_fnt");
    }

    /**
     * 创建并播放金币增加特效
     */
    export function goldFlutter(goldNum: number) {
        Utils.flutter(goldNum, "jinbiParticle", "shuzi3_fnt");
    }

    /**飘动特效 */
    export function flutter(heartNum: number, resStr: string, ziStr: string) {
        let parGro = new eui.Group();
        parGro.width = 1280;
        parGro.height = 720;
        parGro.bottom = 0;
        parGro.right = 0;
        parGro.touchEnabled = false;
        App.LayerManager.topLayer.addChild(parGro);

        let parSys = new particle.GravityParticleSystem(RES.getRes(resStr+"_png"), RES.getRes(resStr+"_json"));
        parGro.addChild(parSys);
        parSys.start();

        Utils.numberFlutter(heartNum, parGro, 630, 360, ziStr);

        let addParTime = 700;
        let parLife = 1700;
        let clearTime = 5000;
        setTimeout(()=>{
            parSys.stop();
        }, addParTime);
        setTimeout(()=>{
            parSys.parent && parSys.parent.removeChild(parSys);
        }, addParTime+parLife);
        setTimeout(()=>{
            parGro.parent && parGro.parent.removeChild(parGro);
        }, clearTime);
    }

    /**
     * 数值变化飘动效果 
     */
    export function numberFlutter(num: number, parent: eui.Group, x: number, y: number, ziStr: string):any {
        if (num == 0 || !parent) {
            console.warn("--->>>");
            return;
        }

        let numLab = new eui.BitmapLabel();
        numLab.font = ziStr;
        numLab.x = x;
        numLab.y = y;
        numLab.anchorOffsetX = numLab.width/2;
        numLab.anchorOffsetY = 19;
        parent.addChild(numLab);

        let flyStr: string;
        if (num > 0) {
            flyStr = "+" + num;
        }
        else if (num < 0){
            flyStr = "-" + num;
        }
        numLab.text = flyStr;

        numLab.alpha = 0;
        numLab.scaleX = numLab.scaleY = 0.01;
        egret.Tween.get(numLab)
        .to({alpha: 1, scaleX: 1, scaleY: 1}, 200)
        .to({y: y-75}, 1500)
        .to({y: y-100, alpha: 0}, 500)
    }
}