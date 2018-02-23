/**
 * 使用道具面板
 * @author xiongjian 
 * @date 2017-9-22
 */
class BuyToolPanel extends BasePanel {
    public recData: any;
    public xiangouGroup: eui.Group;
    public maxcountLabel: eui.Label;
    public bgImg: eui.Image;
    public titleLabel: eui.Label;
    public contentLabel: eui.Label;
    public goldLabel: eui.Label;
    public giftImg: eui.Image;
    public countLabel: eui.Label;
    public jianBtn: eui.Button;
    public jiaBtn: eui.Button;
    public canelBtn: eui.Button;
    public okBtn: eui.Button;

    public nojianBtn: eui.Button;
    public nojiaBtn: eui.Button;


    private count = 1;
    private limitCount = 999;


    public constructor() {
        super();
        this.skinName = "BuyToolPanelSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {

    }

    /**添加到场景中*/
    public onEnable(data: any = null) {
        this.recData = data;
        this.playEnterAnim();
        this.count = 1;
        this.init();


        this.jiaBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.jiaBtnTouchBegin, this);
        this.jianBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.jianBtnTouchBegin, this);
        this.bgImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bgTouch, this);
        App.StageUtils.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);

        CommomBtn.btnClick(this.okBtn, this.okTouch, this, ComBtnType.Click);
        CommomBtn.btnClick(this.canelBtn, this.canelTouch, this, ComBtnType.Close);
        CommomBtn.btnClick(this.jiaBtn, this.jiaTouch, this, ComBtnType.Click);
        CommomBtn.btnClick(this.jianBtn, this.jianTouch, this, ComBtnType.Click);
    }

    /**从场景中移除*/
    public onRemove() {
        this.jiaBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.jiaBtnTouchBegin, this);
        this.jianBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.jianBtnTouchBegin, this);
        this.bgImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.bgTouch, this);
        App.StageUtils.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);

        CommomBtn.removeClick(this.okBtn, this.okTouch, this);
        CommomBtn.removeClick(this.canelBtn, this.canelTouch, this);
        CommomBtn.removeClick(this.jiaBtn, this.jiaTouch, this);
        CommomBtn.removeClick(this.jianBtn, this.jianTouch, this);
    }

    /**确定点击 */
    private okTouch() {
        if (this.recData && this.recData.id) {
            let gid = this.recData.id
            let http = new HttpSender();
            let data = ProtocolHttp.toolsBuy;
            data.gid = gid;
            data.count = this.count;
            http.post(ProtocolHttpUrl.toolsBuy, data, this.buyBtnTouchBack, this);
            console.log("BuyToolPanel >> 发送购买道具，购买个数:", this.count);
        }
    }

    /**购买返回 */
    private buyBtnTouchBack(data) {
        console.log("tool", data);
        if (data.code == 200) {

            App.DataCenter.UserInfo.diamond = data.data.diamond;
            App.DataCenter.UserInfo.gold = data.data.gold;
            App.DataCenter.UserInfo.hearts = data.data.hearts;
            App.DataCenter.UserInfo.power = data.data.power;

            //更新四维
            App.EventManager.sendEvent(EventConst.UPDATE_SIWEI);

            if (this.recData.is_limit) {
                this.showXiangouGroup(true);
                this.recData.left_times = data.data.left_times;
                this.setMaxCount(this.recData.left_times, this.recData.buy_times);
            }

            Tips.info("购买成功");
            let panel: ShopPanel = App.PanelManager.getPanel(PanelConst.ShopPanel);
            panel.topMenu.setAssetUI();
            this.close();
        } else {
            Tips.info(data.info);
        }
    }

    //因为数据中心和Item绑定的数据不一致，临时加个方法，来修改限购次数
    public setXiangou(left_times) {
        if (this.recData.is_limit) {
            this.showXiangouGroup(true);
            this.recData.left_times = left_times;
            this.setMaxCount(this.recData.left_times, this.recData.buy_times);
        }
    }


    /**设置数据 */
    private init() {
        this.showHuijia(false);
        this.showHuijian(true);
        this.setCountLabel(this.count);
        this.setContentLabel(this.recData.des);
        this.setTitleLabel(this.recData.cname);
        this.setGoldLabel(this.recData.price);
        this.setGiftImg(this.recData.pic);
        if (this.recData.is_limit) {
            this.showXiangouGroup(true);
            this.setMaxCount(this.recData.left_times, this.recData.buy_times);
        } else {
            this.showXiangouGroup(false);
        }
        this.showHuijia(this.checkNoEnoughGold());
    }

    /**取消点击 */
    private canelTouch() {
        this.close();
    }

    /**加点击 */
    private jiaTouch() {
        this.count += 1;
        this.showHuijian(false);
        if (this.recData.is_limit) {
            if (this.count >= this.recData.left_times) {
                this.showHuijia(true);
                this.count = this.recData.left_times;
            } else {
                this.showHuijia(false);
            }
            this.setCountLabel(this.count);
            this.setGoldLabel(this.recData.price * this.count);
        } else {
            this.setCountLabel(this.count);
            this.setGoldLabel(this.recData.price * this.count);
        }
        let isLimitCount = this.checkBuyLimitCount();
        let isNoEncoughGod = this.checkNoEnoughGold();

        this.showHuijia((isLimitCount || isNoEncoughGod));
    }

    /**减点击 */
    private jianTouch() {
        this.showHuijia(false);
        if (this.count > 1) {
            this.count -= 1;
            if (this.count == 1) {
                this.showHuijian(true);
            } else {
                this.showHuijian(false);
            }
        } else {
            this.count = 1;
            this.showHuijian(true);
        }
        this.setCountLabel(this.count);
        this.setGoldLabel(this.recData.price * this.count);
    }

    /**加点击开始 */
    private jiaBtnTouchBegin() {
        egret.Tween.get(this.jiaBtn, { loop: true }).wait(400).call(() => {
            this.jiaTouch();
        }, this);
    }

    /**减点击开始 */
    private jianBtnTouchBegin() {
        egret.Tween.get(this.jianBtn, { loop: true }).wait(400).call(() => {
            this.jianTouch();
        }, this);
    }

    /**点击加或减结束 */
    private onStageTouchEnd() {
        egret.Tween.removeTweens(this.jiaBtn);
        egret.Tween.removeTweens(this.jianBtn);
    }

    /**背景点击 */
    private bgTouch() {
        this.close();
    }

    /**礼物图片设置 */
    private setGiftImg(url) {
        if (url && url != "") {
            this.giftImg.source = RES.getRes(url);
        }
    }

    /**设置金币 */
    private setGoldLabel(str) {
        if (str != null) {
            this.goldLabel.text = str;
        }
    }
    /***金币不足够 */
    private checkNoEnoughGold(): boolean {
        let needGold = this.recData.price * (this.count + 1)
        return (App.DataCenter.UserInfo.gold <= needGold)
    }
    /**购买限制数量 */
    private checkBuyLimitCount(): boolean {
        return this.limitCount >= this.count;
    }



    /**内容设置 */
    private setContentLabel(str) {
        if (str != "") {
            this.contentLabel.text = str;
        }
    }

    /**标题设置 */
    private setTitleLabel(str) {
        if (str != "") {
            this.titleLabel.text = str;
        }
    }

    /**设置购买数量 */
    private setCountLabel(num) {
        if (num != "") {
            this.countLabel.text = num;
        }
    }

    /**显示限购 */
    private showXiangouGroup(bo: boolean) {
        if (bo) {
            this.xiangouGroup.visible = true;
        } else {
            this.xiangouGroup.visible = false;
        }

    }

    /**设置最大购买次数 */
    private setMaxCount(left, max) {
        if (max && max != "") {
            this.maxcountLabel.text = left + "/" + max;
        }
    }

    /**显示加灰色 */
    private showHuijia(bo: boolean) {
        this.nojiaBtn.visible = bo;
    }

    /**显示减灰色 */
    private showHuijian(bo: boolean) {
        if (bo) {
            this.nojianBtn.visible = true;
        } else {
            this.nojianBtn.visible = false;
        }
    }

    /**关闭 */
    private close() {
        this.hide();
        this.count = 1;
    }

}