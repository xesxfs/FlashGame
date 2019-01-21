module EffectUtils {
	/**
	 *
	 * @author chenwei
	 *  2016/07/12
	 */
	
    
    export function showFload(egretObj: egret.DisplayObjectContainer | egret.DisplayObject,waitTime: number = 1000){
        let y=egretObj.y
        var time = new Date();
        var timea=time.getSeconds();
        egret.Tween.get(egretObj).wait(200).to({ y: y - 100,alpha: 0.5 },2000).call(() => { 
            var end = new Date();
            var enda = end.getSeconds();
            var a= enda-timea
            console.log("tips显示时间="+a)
            egretObj.parent && egretObj.parent.removeChild(egretObj)});
	}

}
