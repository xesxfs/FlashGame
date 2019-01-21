/**
 * 工作Item
 * @author sven
 * 2018.1.2
 */
class WorkBox extends eui.ItemRenderer {
    private titleLab:eui.Label;
    private itemImg:eui.Image;
    private timeGro:eui.Group;
    private timeLab:eui.Label;
    private freeLab:eui.Label;
    private awardLab:eui.Label;
    private beginGro:eui.Group;
    /**升值 */
    private upGro:eui.Group;
    private costLab:eui.Label;
    private quickGro:eui.Group;
    private quickUpGro:eui.Group;
    private getGro:eui.Group;


    private gClickData: WorkItemVo;
    private ansTimer: DateTimer;
    private curTime: number;

    public constructor() {
        super();
        this.skinName = "WorkBoxSkin";
    }

    protected childrenCreated() {
        CommomBtn.btnClick(this.beginGro, this.onClickBegin, this, ComBtnType.Click);
        CommomBtn.btnClick(this.upGro, this.onClickUp, this, ComBtnType.Click);
        CommomBtn.btnClick(this.getGro, this.onClickGet, this, ComBtnType.Click);
        CommomBtn.btnClick(this.quickGro, this.onClickQuick, this, ComBtnType.Click);
        CommomBtn.btnClick(this.quickUpGro, this.onClickQuickUp, this, ComBtnType.Click);
    }

    protected dataChanged() {
        let clickData: WorkItemVo = this.gClickData = this.data;

        this.itemImg.source = clickData.pic;
        this.titleLab.text = clickData.title;
        this.freeLab.text = clickData.free_times + "";
        this.awardLab.text = clickData.gain_gold + "";
        this.costLab.text = clickData.ugold + "";

        if (clickData.duration > clickData.wait && clickData.wait != 0) {
            this.timeGro.visible = true;
            this.timeLab.text = clickData.wait + "";

            this.startTimer(clickData.wait);

            this.showGro(WorkGroType.quick);
        }
        else {
            this.timeGro.visible = false;

            if (clickData.post == WorkStatus.quick) {
                this.showGro(WorkGroType.quickUp);
            }
            else if (clickData.post == WorkStatus.near) {
                this.showGro(WorkGroType.up);
            }
            else {
                if (clickData.wait == 0) {
                    this.showGro(WorkGroType.get);
                }
                else {
                    this.showGro(WorkGroType.begin);
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
        this.showGro(WorkGroType.get);

        this.reGlobalList("wait", 0);
        App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);
    }

    /**开始回调 */
    public onClickBegin() {
        if (this.gClickData.free_times > 0) {
            let http = new HttpSender();
            let data = ProtocolHttp.workStart;
            data.wid = this.gClickData.id;
            this.reGlobalList("wait", this.gClickData.duration-1);
            App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);
            http.post(ProtocolHttpUrl.workStart, data, this.revLove, this);
        }
        else {
            Tips.info("今日工作次数已用尽");
        }
    }

    private revLove(data) {
        if (data.code == 200) {
            App.DataCenter.reUserBase(data.data);
            this.startTimer(this.gClickData.duration);
            this.timeGro.visible = true;
            this.showGro(WorkGroType.quick);
        } else {
            Tips.info(data.info);
        }
    }

    /**点击领取 */
    private onClickGet() {
        let http = new HttpSender();
        let data = ProtocolHttp.workFinish;
        data.wid = this.gClickData.id;
        http.post(ProtocolHttpUrl.workFinish, data, this.revFinish, this);
    }

    private revFinish(data) {
        if (data.code == 200) {
            App.DataCenter.reUserBase(data.data);
            let text = "获得" + this.gClickData.gain_gold + "金币";
            Utils.goldFlutter(this.gClickData.gain_gold);
            App.PanelManager.open(PanelConst.FinishWorkPanel, text);
            this.timeGro.visible = false;
            this.freeLab.text = data.data.left_times;

            this.showGro(WorkGroType.begin);

            this.reGlobalList("wait", this.gClickData.duration);
            this.reGlobalList("free_times", data.data.left_times);
            App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);
        } else {
            Tips.info(data.info);
        }
    }

    /**点击立即完成 */
    private onClickQuick() {
        if (App.DataCenter.UserInfo.work_duration == 0) {
            let http = new HttpSender();
            let data = ProtocolHttp.loveStart;
            data.lid = this.gClickData.id;
            http.post(ProtocolHttpUrl.workFinishNow, data, this.revQuick, this);
        }
        else {
            let dialog:ConfirmDialog = new ConfirmDialog();
            dialog.setContent("是否前往开通恋爱、工作立即完成特权");
            dialog.setOk(this.onBuyPrivilege, this);
            dialog.show();
        }
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

    /**前往购买特权 */
    private onBuyPrivilege() {
        App.PanelManager.open(PanelConst.ShopPanel, ShopPage.SuperValue);
    }

    /**点击升职 */
    private onClickUp() {
        let http = new HttpSender();
        let data = ProtocolHttp.workStart;
        data.wid = this.gClickData.id;
        http.post(ProtocolHttpUrl.workPromotion, data, this.revUp, this);
    }

    private revUp(data) {
        if (data.code == 200) {
            App.DataCenter.reUserBase(data.data);
            App.SoundManager.playEffect("promotion_mp3");
            Tips.info("升职成功");
            this.UpSuccess();
        } else {
            Tips.info(data.info);
        }
    }

    /**点击快速升职 */
    private onClickQuickUp() {
        App.PanelManager.open(PanelConst.ShopPanel, ShopPage.Work);
    }

    /**升职成功后处理 */
    private UpSuccess() {
        let http:HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.works, {}, this.revUpSuccess, this);
    }

    private revUpSuccess(data) {
        let workPanel:WorkPanel = App.PanelManager.getPanel(PanelConst.WorkPanel);
        if(data.code == 200){
			App.DataCenter.Work.workList = data.data;
            workPanel.onEnable();
		}else{
            workPanel.hide();
			Tips.info(data.info);
		}
    }

    /**显示哪一组GRO */
    private showGro(showType: WorkGroType) {
        this.quickUpGro.visible = false;
        this.beginGro.visible = false;
        this.upGro.visible = false;
        this.getGro.visible = false;
        this.quickGro.visible = false;

        switch (showType) {
            case WorkGroType.quickUp:
                this.quickUpGro.visible = true;
                break;
            case WorkGroType.begin:
                this.beginGro.visible = true;
                break;
            case WorkGroType.up:
                this.upGro.visible = true;
                break;
            case WorkGroType.get:
                this.getGro.visible = true;
                break;
            case WorkGroType.quick:
                this.quickGro.visible = true;
                break;
            default:
                console.warn("btn warn");
                break;
        }
    }

    /**刷新全局数据中的某一项 */
    private reGlobalList(name:string, value:any) {
        let globalList = App.DataCenter.Work.workList;
        for (let i = 0;i < globalList.length;i ++) {
            if (globalList[i].id == this.gClickData.id) {
                globalList[i][name] = value;
                return;
            }
        }
    }
}

enum WorkGroType {
    quickUp,
    begin,
    up,
    get,
    quick
}