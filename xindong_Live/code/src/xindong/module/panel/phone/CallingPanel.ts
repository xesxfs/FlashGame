/**
 *电话呼叫中面板
 * @author xiongjian
 * @date 2017/08/24
 */
class CallingPanel extends BasePanel {

    /**拨号计时器*/
    private callTimer: egret.Timer = new egret.Timer(3000, 1);
    public heartPlugin: HeartsPlugins;
    private chanel: egret.SoundChannel;
    public maskImg: eui.Image;
    public grilImg: eui.Image;


    public constructor() {
        super();
        this.skinName = "CallingPanelSkin";
    }

    protected childrenCreated() {

    }

    public onEnable() {
        this.grilImg.mask = this.maskImg;
        if (App.DataCenter.telInfo) {
            this.grilImg.source = App.DataCenter.telInfo.head;
        }
        this.startOverTimer();
        this.heartPlugin.setJindu(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts);
    }
    public onRemove() {

    }

    //开始超时计时
    private startOverTimer() {
        this.chanel = App.SoundManager.playEffect(SoundManager.calling, 0, 0);
        this.callTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
        this.callTimer.reset();
        this.callTimer.start();
    }

    //停止超时计时
    private stopOverTimer() {
        this.callTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
        this.callTimer.stop();
    }

    //超时
    private onTimerComplete() {
        App.PanelManager.open(PanelConst.JietongPanel);
        App.SoundManager.stopEffect(this.chanel);
        console.log("关闭calling");
        this.close();
        this.stopOverTimer();

    }


    /**关闭面板 */
    private close() {
        this.hide();
    }
}