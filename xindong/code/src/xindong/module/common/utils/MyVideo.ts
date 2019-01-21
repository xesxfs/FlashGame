/**
 * 自定义Video标签
 * @author xiongjian
 * @date 2017-10-24
 */

class MyVideo extends SingleClass {
    private rect:eui.Rect;   //播放视频时黑色遮罩

    public constructor() {
        super();
        this.enable();

        this.rect = new eui.Rect(App.StageUtils.stageWidth, App.StageUtils.stageHeight, 0x000000);
        this.rect.percentWidth = 100;
        this.rect.percentHeight = 100;

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
        App.LayerManager.topLayer.addChild(this.rect);
        App.SoundManager.stopBGM();
        var video: any = document.getElementById('myVideo');
        video.src = url;
        video.autoplay = "autoplay";
        video.play();
        video.style.display = "inline";
    }

    public stop() {
        this.rect.parent && this.rect.parent.removeChild(this.rect);
        App.SoundManager.playBGM(SoundManager.bgm);
        var video: any = document.getElementById('myVideo');
        video.style.display = "none";
        App.LoadingLock.unLockScreen();
    }

}