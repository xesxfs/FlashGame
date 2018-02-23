/**
 * 恋爱进度面板
 * @author xiongjian
 * @deta 2017/9/5
 */
class LoveProPanel extends BasePanel {
    public recData:any;
    public TypeImg: eui.Image;
    public backBtn: eui.Button;
    public typeLabel: eui.Label;
    public proImg: eui.Image;
    public ProLabel: eui.Label;
    public probg: eui.Image;
    public finishBtn: eui.Button;

    private timer: egret.Timer;
    private chanel: egret.SoundChannel;
    private timeout;

    private proInitW:number = 60;    //进度条初始宽度，防止宽度过短时，原型变成矩形

    private tipLabel:eui.Label;      

    public constructor() {
        super();
        this.skinName = "LoveProPanelSkin"
    }

    /**组件创建完毕*/
    protected childrenCreated() {

    }

    /**添加到场景中*/
    public onEnable(data:any = null) {
        this.recData = data;
        this.proImg.width = this.proInitW;
        this.ProLabel.text = "0%";
        App.SoundManager.stopBGM();
        App.SoundManager.stopEffect(this.chanel);
        if(this.recData && this.recData.title){
            this.timeout = setTimeout(()=> {
                this.playMusic(this.recData.title);
            }, 500);
            
        }
        if (this.recData && this.recData.pic) {
            this.setImgType(this.recData.pic);
        }

        if (this.recData && this.recData.title) this.typeLabel.text = this.recData.title;

        CommomBtn.btnClick(this.backBtn, this.close, this, 2);
        CommomBtn.btnClick(this.finishBtn, this.finishTouch, this, 1);

        this.showLoveTip();
    }

    /**从场景中移除*/
    public onRemove() {
        CommomBtn.removeClick(this.backBtn, this.close, this);
        CommomBtn.removeClick(this.finishBtn, this.finishTouch, this);
        clearTimeout(this.timeout);
    }

    /**倒计时
     * @delay  延迟时间
     * @repeatCount 执行次数
     */
    public countDown(delay, repeatCount) {
        this.count = 1;
        let t = parseInt(delay);
        let count = parseInt(repeatCount);
        if (t && count) {
            this.removeTimer();
            this.timer = new egret.Timer(t, count);
            this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
            this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
            this.timer.start();
        }

    }

    /**倒计时次数 */
    private count = 1;
    /**每秒倒计时 */
    private timerFunc() {
        this.jindu(this.count);
        this.count++;
    }

    /**倒计时结束 */
    private timerComFunc() {
        this.removeTimer();
        this.finish();
        App.SoundManager.playBGM(SoundManager.bgm);
    }

    /**计时结束完成 */
    private finish() {
        let data = this.recData;
        let http = new HttpSender();
        let json = ProtocolHttp.loveFinish;
        json.lid = data.lid;
        http.post(ProtocolHttpUrl.loveFinish, json, this.loveFinish, this);
    }

    /**恋爱完成 */
    private loveFinish(data) {
        if (data.code == 200) {
            App.SoundManager.playEffect(SoundManager.love_done);
            console.log(data.data);
            let obj = new Object();
            obj["lid"] = this.recData.lid;
            obj["data"] = data.data;
            App.EventManager.sendEvent(EventConst.WaitTime, obj);
            // App.SoundManager.playEffect(SoundManager.success);
            let text = "获得" + data.data.hearts + "好感度"
            App.PanelManager.open(PanelConst.FinishLovePanel, text);
            //心动值
            let heart = data.data.hearts;
            TipsHeat.showHeat(heart);
            let userheart = App.DataCenter.UserInfo.hearts
            App.DataCenter.UserInfo.hearts = userheart + heart;
            this.close();
            let lovepanel = <LovePanel>App.PanelManager.getPanel(PanelConst.LovePanel);
            App.DataCenter.UserInfo.power = data.data.power;
            // lovepanel.updateSiwei();
        }
    }

    private jindu(count) {
        if (count) {
            this.ProLabel.text = count + "%";
            this.proImg.width = this.proInitW + count * (this.probg.width - this.proInitW) / 100;
        }
    }

    /**清楚倒计时 */
    private removeTimer() {
        this.timer && this.timer.stop();
        this.timer && this.timer.reset();
        this.timer && this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer && this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
        this.timer = null;
        this.count = 1;
        App.SoundManager.stopEffect(this.chanel);
        
    }

    /**关闭 */
    private close() {
        this.hide();
        this.removeTimer();
        this.proImg.width = this.proInitW;
        this.ProLabel.text = "0%"
        App.SoundManager.stopEffect(this.chanel);
        App.SoundManager.playBGM(SoundManager.bgm);
    }

    /**立即完成 */
    public finishTouch() {
        this.finishNow();
    }

    /**立即结束接口 */
    private finishNow() {
        let data = this.recData;
        let http = new HttpSender();
        let json = ProtocolHttp.loveFinish;
        json.lid = data.lid;
        http.post(ProtocolHttpUrl.loveFinishNow, json, this.loveFinishNowBack, this);
    }

    /**立即结束返回 */
    private loveFinishNowBack(data) {
        if (data.code == 200) {
            App.SoundManager.playEffect(SoundManager.love_done);
            this.close();
            console.log(data.data);
            let obj = new Object();
            obj["lid"] = this.recData.lid;
            obj["data"] = data.data;
            App.EventManager.sendEvent(EventConst.WaitTime, obj);
            // App.SoundManager.playEffect(SoundManager.success);
            let text = "获得" + data.data.hearts + "心动值"
            App.PanelManager.open(PanelConst.FinishLovePanel,text);
            //心动值
            let heart = data.data.hearts;
            TipsHeat.showHeat(heart);
            let userheart = App.DataCenter.UserInfo.hearts
            App.DataCenter.UserInfo.hearts = userheart + heart;
            let lovepanel = <LovePanel>App.PanelManager.getPanel(PanelConst.LovePanel);
            App.DataCenter.UserInfo.power = data.data.power;
            // lovepanel.updateSiwei();
        } else {
            Tips.info("" + data.info);
            App.PanelManager.open(PanelConst.LibaoFinishPanel);
        }
    }

    /**设置恋爱类型 */
    public setTextType(str) {
        if (str && str != "") {
            this.typeLabel.text = str;
        }
    }

    /**设置恋爱背景 */
    public setImgType(url) {
        if (url && url != "") {

            this.TypeImg.source = url;
            // let sr = RES.getRes("work_1_png");
            // var blurFliter = new egret.BlurFilter(1, 1);
            // var colorMatrix = [
            //     0.3, 0.6, 0, 0, 0,
            //     0.3, 0.6, 0, 0, 0,
            //     0.3, 0.6, 0, 0, 0,
            //     0, 0, 0, 1, 0
            // ];
            // var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            // this.TypeImg.filters = [colorFlilter];
        }
    }

    /**设置类型文本 */
    public setType() {

    }


    /**出场动画 */
    public outAnimation(finishCallback: Function = null) {

    }

    /**入场动画 */
    public enterAnimation() {

    }

    /**播放音乐 */
    private playMusic(type) {
        switch (type) {
            case "泡图书馆":
            console.log("riri");
                this.chanel = App.SoundManager.playEffect(SoundManager.library, 0, 0);
                break;
            case "约吃饭":
                this.chanel = App.SoundManager.playEffect(SoundManager.canteen, 0, 0);
                break;
            case "看电影":
                this.chanel = App.SoundManager.playEffect(SoundManager.canteen, 0, 0);
                break;
            case "逛街":
                this.chanel = App.SoundManager.playEffect(SoundManager.canteen, 0, 0);
                break;
            case "唱歌":
                this.chanel = App.SoundManager.playEffect(SoundManager.shopping, 0, 0);
                break;
            case "游公园":
                this.chanel = App.SoundManager.playEffect(SoundManager.park, 0, 0);
                break;
            case "做运动":
                this.chanel = App.SoundManager.playEffect(SoundManager.gym, 0, 0);
                break;
            case "逗猫":
                this.chanel = App.SoundManager.playEffect(SoundManager.cat, 0, 0);
                break;
            case "游乐园":
                this.chanel = App.SoundManager.playEffect(SoundManager.carnie, 0, 0);
                break;
            default:
                this.chanel = App.SoundManager.playEffect(SoundManager.time_click, 0, 0);
                break;
        }
    }

    //显示恋爱秘籍
    private tipJson;
    private showLoveTip(){
        if(this.tipJson == null){
            this.tipJson = RES.getRes("lovetips_json");
        }
        if(this.tipJson != null){
            let tips = this.tipJson.tips;
            let len = tips.length;
            this.tipLabel.text = tips[NumberTool.getRandInt(0,len-1)];
        }
    }
}