/**
 * 互动面板
 * @author sven
 * 2017.12.27
 */
class InteractPanel extends BasePanel {
    public topMenu:TopMenu;
    private giftImg:eui.Image;
    private answerImg:eui.Image;
    private tipLab:eui.Label;
    private costGro:eui.Group;
    private iconImg:eui.Image;
    private costLab:eui.Label;

    public constructor() {
        super();
        this.skinName = InteractPanelSkin;
    }

    protected childrenCreated() {

    }

    public onEnable() {
        this.reTopUI();
        this.topMenu.showConfig(true, true, TopMenuTitle.Interact);

        if (App.DataCenter.interactAnsInfo.cost.qstatus == "continue") {
            this.tipLab.visible = true;
            this.costGro.visible = false;

            this.tipLab.text = "继续答题";
        }
        else if (App.DataCenter.interactAnsInfo.cost.qcons > 0) {
            this.tipLab.visible = false;
            this.costGro.visible = true;
            if (App.DataCenter.interactAnsInfo.cost.qtype == "gold") {
                this.iconImg.source = "com_gold_icon_png";
            } else {
                this.iconImg.source = "com_diamond_icon_png";
            }
            this.costLab.text = App.DataCenter.interactAnsInfo.cost.qcons + "";
        }
        else {
            this.tipLab.visible = true;
            this.costGro.visible = false;

            this.tipLab.text = "每日首次免费";
        }

        CommomBtn.btnClick(this.giftImg, this.onGift, this, ComBtnType.Click);
        CommomBtn.btnClick(this.answerImg, this.onAnswer, this, ComBtnType.Click);
        App.EventManager.addEvent(EventConst.FAV_VEDIO_END, this.reqAnswer, this);
    }

    public onRemove() {
        CommomBtn.removeClick(this.giftImg, this.onGift, this);
        CommomBtn.removeClick(this.answerImg, this.onAnswer, this);
        App.EventManager.removeEvent(EventConst.FAV_VEDIO_END, this.reqAnswer, this);
    }

    /**赠送礼物 */
    private onGift() {
        let http:HttpSender = new HttpSender;
        http.post(ProtocolHttpUrl.giftList, {}, this.revGift, this);
    }

    private revGift(data) {
        if(data.code == 200){
            App.DataCenter.interactGiftInfo.readData(data.data)
            this.hide();
			App.PanelManager.open(PanelConst.InteractGiftPanel);
		}else{
			Tips.info(data.info);
		}
    }

    /**互动答题 */
    private onAnswer() {
        let cost = App.DataCenter.interactAnsInfo.cost;
        if (cost.qstatus == "start") {
            if (cost.qtype == "gold" && cost.qcons > App.DataCenter.UserInfo.gold) {
                let dialog:ConfirmDialog = new ConfirmDialog();
                dialog.setLackCurrency(1);
                dialog.show();
                return;
            }
            if (cost.qtype == "diamond" && cost.qcons > App.DataCenter.UserInfo.diamond) {
                let dialog:ConfirmDialog = new ConfirmDialog();
                dialog.setLackCurrency(2);
                dialog.show();
                return;
            }
        }
        this.reqBeginVedio();
    }

    /**过场视频 */
    private reqBeginVedio() {
        let http = new HttpSender();
        let param = { vname: App.DataCenter.interactAnsInfo.cost.qstart_video};
        http.post(ProtocolHttpUrl.videoUrl, param, this.revBeginVedio, this);
    }

    private revBeginVedio(data) {
        if (data.code == 200) {
            let videoType:VideoType;
            videoType = VideoType.fav;
            App.NativeBridge.sendPlayVideo(videoType, data.data.url);
        } else {
            Tips.info(data.info);
        }
    }

    /**请求进入答题 */
    private reqAnswer() {
        let http:HttpSender = new HttpSender;
        http.post(ProtocolHttpUrl.questionList, {}, this.revAnswer, this);
    }

    private revAnswer(data) {
        if(data.code == 200){
            App.DataCenter.reUserBase(data.data);
            App.DataCenter.interactAnsInfo.readData(data.data)
            this.hide();
			App.PanelManager.open(PanelConst.InteractAnsPanel);
		}else{
			Tips.info(data.info);
		}
    }

    /**刷新顶部UI */
    public reTopUI() {
        this.topMenu.setAssetUI();
    }
}