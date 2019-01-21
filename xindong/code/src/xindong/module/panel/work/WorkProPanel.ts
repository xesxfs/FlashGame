/**
 * 工作进度面板
 * @author xiongjian
 * @deta 2017/9/5
 */
class WorkProPanel extends BasePanel {
    public recData;
    public TypeImg: eui.Image;
    public backBtn: eui.Button;
    public typeLabel: eui.Label;
    public proImg: eui.Image;
    public ProLabel: eui.Label;
    public probg: eui.Image;
    public finishBtn: eui.Button;

    private timer: egret.Timer;
    private chanel: egret.SoundChannel

    private proInitW:number = 60;   //进度条初始宽度，防止宽度过短时，原型变成矩形

    private tipLabel:eui.Label; 

    public constructor() {
        super();
        this.skinName = "WorkProPanelSkin"
    }

    /**组件创建完毕*/
    protected childrenCreated() {

    }

    /**添加到场景中*/
    public onEnable(data:any = null) {
        this.recData = data;
        this.proImg.width = this.proInitW;
        this.ProLabel.text = "0%";
        this.chanel = App.SoundManager.playEffect(SoundManager.time_click, 0, 0);
        if (this.recData && this.recData.pic) this.TypeImg.source = this.recData.pic;
        if (this.recData && this.recData.title) this.typeLabel.text = this.recData.title;
       
        CommomBtn.btnClick(this.backBtn, this.close, this, 2);
        CommomBtn.btnClick(this.finishBtn, this.finishNow, this, 1);

        this.showLoveTip();
    }

    /**从场景中移除*/
    public onRemove() {
        CommomBtn.removeClick(this.backBtn, this.close, this);
        CommomBtn.removeClick(this.finishBtn, this.finishNow, this);
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
    }

    /**计时结束完成 */
    public finish() {
        let data = this.recData;
        let http = new HttpSender();
        let json = ProtocolHttp.workFinish;
        json.wid = data.id;
        http.post(ProtocolHttpUrl.workFinish, json, this.workFinish, this);
    }

    /**工作完成 */
    private workFinish(data) {
        if (data.code == 200) {
            App.SoundManager.playEffect(SoundManager.work_done);
            console.log(data.data);
            let obj = new Object();
            obj["lid"] = this.recData.lid;
            obj["data"] = data.data;
            App.EventManager.sendEvent(EventConst.WorkWaitTime, data.data);
            // App.SoundManager.playEffect(SoundManager.success);
            let text = "获得" + (data.data.gold - App.DataCenter.UserInfo.gold) + "金币"
            App.PanelManager.open(PanelConst.FinishWorkPanel,  text);
            App.DataCenter.UserInfo.gold = data.data.gold;
            this.close();
            let workPanel = <WorkPanel>App.PanelManager.getPanel(PanelConst.WorkPanel);
            workPanel.setConfig();
        }
    }
    /**立即结束接口 */
    private finishNow() {
        let data = this.recData;
        let http = new HttpSender();
        let json = ProtocolHttp.workFinish;
        json.wid = data.id;
        http.post(ProtocolHttpUrl.workFinishNow, json, this.loveFinishNowBack, this);
    }

    /**立即结束返回 */
    private loveFinishNowBack(data) {
        if (data.code == 200) {
            App.SoundManager.playEffect(SoundManager.work_done);
            console.log(data.data);
            this.close();
            let obj = new Object();
            obj["data"] = data.data;
            App.EventManager.sendEvent(EventConst.WorkWaitTime, data.data);
            // App.SoundManager.playEffect(SoundManager.success);
            let text = "获得" + (data.data.gold - App.DataCenter.UserInfo.gold) + "金币"
            App.PanelManager.open(PanelConst.FinishWorkPanel,text);
            App.DataCenter.UserInfo.gold = data.data.gold;
            let workpanel = <WorkPanel>App.PanelManager.getPanel(PanelConst.WorkPanel);
            workpanel.setConfig();
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
        }
    }

    /**出场动画 */
    public outAnimation(finishCallback: Function = null) {

    }

    /**入场动画 */
    public enterAnimation() {

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