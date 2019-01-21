/**
 * 自定义Video标签
 * @author xiongjian
 * @date 2017-10-24
 */

class MyVideo extends SingleClass {

    public constructor() {
        super();
        this.enable();

        //video适配
        if(App.DeviceUtils.isMobile && App.DeviceUtils.IsWeb){
            let h = window.innerHeight;
            let w = window.innerWidth;
            let video = document.getElementById("myVideo");
            video.style.transform = "rotate(90deg) scale(" + h/w + ")";
        }
    }

    private enable() {
        var video: any = document.getElementById('myVideo');
        video.addEventListener("play", () => {
            egret.log("play");
        });

        video.addEventListener("ended", () => {
            egret.log("end");
            if (StaticCfg.lastVideo == VideoType.mem) {
                App.EventManager.sendEvent(EventConst.guide);
            }
            else {
                App.EventManager.sendEvent(EventConst.FAV_VEDIO_END);
            }
            this.stop();
        });

        video.addEventListener("pause", () => {
            egret.log("pause");
        });

        video.addEventListener("error", ()=>{
            egret.log("error");
            this.stop();
        });
    }

    public play(url) {
        if(url){
            var video: any = document.getElementById('myVideo');
            video.src = url;
            video.autoplay = "autoplay";
            video.play();
            video.style.display = "inline";
        }else{
            this.stop();
        }
    }

    public stop() {
        App.LoadingLock.unLockBlack();
        App.SoundManager.allowPlayBGM = true;
        App.SoundManager.playBGM(SoundManager.bgm);
        
        var video: any = document.getElementById('myVideo');
        video.style.display = "none";
    }

}