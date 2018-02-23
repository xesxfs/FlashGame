/**
 * 互动赠礼
 * @author sven
 * 2017.12.27
 */
class InteractGiftPanel extends BasePanel {
    public topMenu:TopMenu;
    private girlImg:eui.Image;
    private tipsLab:eui.Label;
    private proImg:eui.Image;
    private giftGro:eui.Group;
    private itemList:eui.List;
    private proLab:eui.Label;

    /**进度调总长 */
    private proTotalLength: number = 436;
    /**进度分段长度表 */
    private proLengthList: Array<number> = [32,76,76,76,76,76];
    private curIndex: number;
    private timer: DateTimer;
    private girlTouch: boolean;

    public constructor() {
        super();
        this.skinName = "InteractGiftPanelSkin";
    }

    protected childrenCreated() {
        this.itemList.itemRenderer = InteractGiftItem;
        this.itemList.useVirtualLayout = false;
    }

    public onEnable() {
        this.topMenu.showConfig(true, false, TopMenuTitle.InteractGift);
        this.topMenu.setCloseCallback(this.closeCallback, this);
        this.reTopUI();

        this.reItemList();
        this.reProUI();

        if (App.DataCenter.interactGiftInfo.bgi.length > 3) {
            this.girlImg.source = App.DataCenter.interactGiftInfo.bgi+"_png";
        }
        this.girlTouch = true;
        this.onGirl();
        this.girlImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGirl, this);
        this.addFloat();
    }

    public onRemove() {
        this.girlImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGirl, this);
        this.removeFloat();
        this.timer.stop();
    }

    /**礼盒添加长按事件 */
    private addFloat() {
        for (let i = 0;i < this.giftGro.numChildren;i ++) {
            var item:eui.Component = <eui.Component>this.giftGro.getChildAt(i);
            FloatTips.Instance().addFloatListenerFor(item, {index: i});
        }
    }

    /**长按移除 */
    private removeFloat() {
        for (let i = 0;i < this.giftGro.numChildren;i ++) {
            var item:eui.Component = <eui.Component>this.giftGro.getChildAt(i);
            FloatTips.Instance().removeFloatListenerFrom(item);
        }
    }

    /**
     * 点击主播图
     */
    private onGirl() {
        if (!this.girlTouch) {
            return;
        }
        this.girlTouch = false;
        this.beginTimer();

        let tipList = App.DataCenter.interactGiftInfo.giftTipsList;
        let curList = [];
        for (let i = 0;i < tipList.length;i ++) {
            if (tipList[i].level <= this.curIndex) {
                curList.push(tipList[i]);
            }
        }
        let randomNum = NumberTool.getRandInt(0, curList.length-1);
        this.tipsLab.text = curList[randomNum].tips;
        App.SoundManager.playEffect(curList[randomNum].audio);
    }

    private beginTimer() {
        if (this.timer) {
            this.timer.reset();
        }
        else {
            this.timer = new DateTimer(5000);
            this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimerComplete,this);
        }
		this.timer.start();
    }

    private onTimerComplete() {
        this.timer.stop();
        this.girlTouch = true;
    }

    /**设置列表 */
    private reItemList() {
        let info = App.DataCenter.interactGiftInfo.giftItemList;
        let ac:eui.ArrayCollection = new eui.ArrayCollection(info);
		this.itemList.dataProvider = ac;
    }

    /**刷新进度相关 */
    public reProUI() {
        let curHearts = App.DataCenter.UserInfo.giftScore;
        let giftCfg = App.DataCenter.interactGiftInfo.giftDescList;
        this.curIndex = 0;
        for (let i = 0;i < giftCfg.length;i ++) {
            if (giftCfg[i].hearts <= curHearts) {
                this.curIndex = i+1;
            }
            else {
                break;
            }
        }
        this.reProgress();
        this.reProgressImg();
    }

    /**设置进度条 */
    private reProgress() {
        let curHearts = App.DataCenter.UserInfo.giftScore;
        let giftCfg = App.DataCenter.interactGiftInfo.giftDescList;
        let heartList: Array<number> = [];
        for (let i = 0;i < giftCfg.length;i ++) {
            let heart = giftCfg[i].hearts;
            for (let j = 0;j < heartList.length;j ++) {
                heart -= heartList[j];
            }
            heartList.push(heart)
        }

        let totalLength = 0;
        let itemHearts = curHearts;
        for (let i = 0;i < this.curIndex;i ++) {
            totalLength += this.proLengthList[i];
            itemHearts -= heartList[i];
        }
        totalLength += (itemHearts/heartList[this.curIndex])*this.proLengthList[this.curIndex];

        if (totalLength > this.proTotalLength) {
            totalLength = this.proTotalLength;
        }
        this.proImg.width = totalLength;
        this.proLab.text = curHearts + "";
    }

    /**设置美女图，说的话 */
    private reProgressImg() {
        let giftCfg = App.DataCenter.interactGiftInfo.giftDescList;
    }

    /**刷新顶部UI */
    public reTopUI() {
        this.topMenu.setAssetUI();
    }

    /**关闭回调 */
    private closeCallback() {
        this.reqInteractAnsCost();
    }

    /**答题消耗信息 */
    public reqInteractAnsCost() {
        let http:HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.questionAnsMain, {}, this.revAnsCost, this);
    }

    /**接收答题消耗 */
    private revAnsCost(data) {
        if(data.code == 200){
            App.DataCenter.interactAnsInfo.cost = data.data;
			App.PanelManager.open(PanelConst.InteractPanel);
		}else{
			Tips.info(data.info);
		}
    }
}