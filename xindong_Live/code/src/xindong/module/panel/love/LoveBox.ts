/**
 * 恋爱Item
 * @author sven
 * 2017.12.27
 */
class LoveBox extends eui.ItemRenderer {
    private itemImg: eui.Image;
    private titleLab: eui.Label;
    private timeGro: eui.Group;
    private timeLab: eui.Label;
    private freeLab: eui.Label;
    private awardLab: eui.Label;
    private lockGro: eui.Group;
    private openLab: eui.Label;
    private beginGro: eui.Group;
    private costGro: eui.Group;
    private costLab: eui.Label;
    private getGro: eui.Group;
    private quickGro:eui.Group;

    private gClickData: LoveItemVo;
    private ansTimer: DateTimer;
    private curTime: number;

    public constructor() {
        super();
        this.skinName = "LoveBoxSkin";
    }

    protected childrenCreated() {
        CommomBtn.btnClick(this.beginGro, this.onClickBegin, this, ComBtnType.Click);
        CommomBtn.btnClick(this.costGro, this.onClickBegin, this, ComBtnType.Click);
        CommomBtn.btnClick(this.getGro, this.onClickGet, this, ComBtnType.Click);
        CommomBtn.btnClick(this.quickGro, this.onClickQuick, this, ComBtnType.Click);
    }

    protected dataChanged() {
        let clickData: LoveItemVo = this.gClickData = this.data;

        this.itemImg.source = clickData.pic;
        this.titleLab.text = clickData.title;
        this.freeLab.text = clickData.free_times + "";
        this.awardLab.text = clickData.score + "";
        this.openLab.text = "恋爱" + clickData.unlock_days + "天开放";
        this.costLab.text = clickData.cons + "";

        if (clickData.duration > clickData.wait && clickData.wait != 0) {
            this.timeGro.visible = true;
            this.timeLab.text = clickData.wait + "";
            this.startTimer(clickData.wait);

            this.showGro(LoveGroType.quick);
        }
        else {
            this.timeGro.visible = false;

            if (clickData.lock) {
                this.showGro(LoveGroType.lock);
            }
            else {
                if (clickData.wait == 0) {
                    this.showGro(LoveGroType.get);
                }
                else if (clickData.free_times > 0) {
                    this.showGro(LoveGroType.begin);
                }
                else {
                    this.showGro(LoveGroType.cost);
                }
            }
        }
    }

    /**开始计时 */
    private startTimer(limitTime: number) {
        this.curTime = limitTime;
        this.timeLab.text = StringTool.formatClock(this.curTime);

        this.ansTimer && this.ansTimer.stop() && (this.ansTimer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this));
        this.ansTimer = new DateTimer(1000, this.curTime);
        this.ansTimer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.ansTimer.reset();
        this.ansTimer.start();
    }

    /**停止倒计时 */
    private stopTimer() {
        this.ansTimer && this.ansTimer.stop();
        this.ansTimer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
    }

    /**时间脉冲 */
    private onTimer() {
        if (Number(this.curTime) <= 1) {
            this.timeLab.text = StringTool.formatClock(0);
            this.stopTimer();
            this.overTime();
            return;
        }
        this.curTime--;
        this.timeLab.text = StringTool.formatClock(this.curTime);
    }

    /**倒计时结束处理 */
    private overTime() {
        this.showGro(LoveGroType.get);
        
        this.reGlobalList("wait", 0);
        App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);
    }

    /**开始回调 */
    public onClickBegin() {
        let http = new HttpSender();
        let data = ProtocolHttp.loveStart;
        data.lid = this.gClickData.id;
        http.post(ProtocolHttpUrl.loveStart, data, this.revLove, this);
    }

    private revLove(data) {
        if (data.code == 200) {
            App.DataCenter.reUserBase(data.data);
            this.startTimer(this.gClickData.duration);
            this.timeGro.visible = true;
            this.showGro(LoveGroType.quick);
        } else {
            Tips.info(data.info);
        }
    }

    /**点击领取 */
    private onClickGet() {
        let http = new HttpSender();
        let data = ProtocolHttp.loveFinish;
        data.lid = this.gClickData.id;
        http.post(ProtocolHttpUrl.loveFinish, data, this.revFinish, this);
    }

    private revFinish(data) {
        if (data.code == 200) {
            App.DataCenter.reUserBase(data.data);
            App.PanelManager.open(PanelConst.FinishLovePanel, this.gClickData.score);
            
            this.freeLab.text = data.data.free_times;
            this.timeGro.visible = false;

            // 更新按钮
            if (data.data.free_times > 0) {
                this.showGro(LoveGroType.begin);
            }
            else {
                this.showGro(LoveGroType.cost);
                this.costLab.text = data.data.cons + "";
            }

            this.reGlobalList("cons", data.data.cons);
            this.reGlobalList("free_times", data.data.free_times);
            this.reGlobalList("wait", this.gClickData.duration);
            App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);
        } else {
            Tips.info(data.info);
        }
    }

    /**点击立即完成 */
    private onClickQuick() {
        if (App.DataCenter.UserInfo.love_duration == 0) {
            let http = new HttpSender();
            let data = ProtocolHttp.loveStart;
            data.lid = this.gClickData.id;
            http.post(ProtocolHttpUrl.loveFinishNow, data, this.revQuick, this);
        }
        else {
            let dialog:ConfirmDialog = new ConfirmDialog();
            dialog.setContent("是否前往开通恋爱、工作立即完成特权");
            dialog.setOk(this.onBuyPrivilege, this);
            dialog.show();
        }
    }

    /**前往购买特权 */
    private onBuyPrivilege() {
        App.PanelManager.open(PanelConst.ShopPanel, ShopPage.SuperValue);
    }

    private revQuick(data) {
        if (data.code == 200) {
            App.DataCenter.reUserBase(data.data);
            this.stopTimer();
            this.overTime();
            App.SoundManager.playEffect("fast_finish_mp3");
        } else {
            Tips.info(data.info);
        }
    }

    /**显示哪一组GRO */
    private showGro(showType: LoveGroType) {
        this.lockGro.visible = false;
        this.beginGro.visible = false;
        this.costGro.visible = false;
        this.getGro.visible = false;
        this.quickGro.visible = false;

        switch (showType) {
            case LoveGroType.lock:
                this.lockGro.visible = true;
                break;
            case LoveGroType.begin:
                this.beginGro.visible = true;
                break;
            case LoveGroType.cost:
                this.costGro.visible = true;
                break;
            case LoveGroType.get:
                this.getGro.visible = true;
                break;
            case LoveGroType.quick:
                this.quickGro.visible = true;
                break;
            default:
                console.warn("btn warn");
                break;
        }
    }

    /**刷新全局数据中的某一项 */
    private reGlobalList(name:string, value:any) {
        let globalList = App.DataCenter.Love.loveList;
        for (let i = 0;i < globalList.length;i ++) {
            if (globalList[i].id == this.gClickData.id) {
                globalList[i][name] = value;
                return;
            }
        }
    }
}

enum LoveGroType {
    lock,
    begin,
    cost,
    get,
    quick
}