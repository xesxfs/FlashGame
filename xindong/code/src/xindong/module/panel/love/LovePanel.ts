/**
 * 恋爱面板
 * @author xiongjian
 * @deta 2017/9/5
 */
class LovePanel extends BasePanel {

    public backBtn: eui.Button;
    public itemGroup: eui.Group;
    public loveBoxScroller: eui.Scroller;

    public goldLabel: eui.Label;
    public powerLabel: eui.Label;
    public heartPlugin: HeartsPlugins;
    public goldGroup: eui.Group;
    public powerGroup: eui.Group;

    public loveBoxList = [];//恋爱盒子列表

    private inited: boolean = false //

    /**引导 */
    public yindaoGroup: eui.Group;
    public yd_loveImg: eui.Image;
    public loveHand: eui.Image;
    public startBtn: eui.Button;

    private handX:number;

    public constructor() {
        super();
        this.skinName = "LovePanelSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {
        this.handX = this.loveHand.x;
        this.addItem();
        this.inited = true;
    }

    /**添加到场景中*/
    public onEnable() {
        this.setConfig();
        App.EventManager.addEvent(EventConst.WaitTime, this.waitLisenter, this);

        this.goldGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goldGroupTouch, this);
        this.powerGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.powerGroupTouch, this);

        CommomBtn.btnClick(this.backBtn, this.close, this, 2);
        CommomBtn.btnClick(this.startBtn, this.startTouch, this, 1);

        this.setGuide();

        App.EventManager.addEvent(EventConst.UPDATE_SIWEI, this.updateSiwei, this);

        //根据天数解锁
        this.jiesuoItem();
    }

    /**从场景中移除*/
    public onRemove() {
        this.goldGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goldGroupTouch, this);
        this.powerGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.powerGroupTouch, this);

        CommomBtn.removeClick(this.backBtn, this.close, this);
        CommomBtn.removeClick(this.startBtn, this.startTouch, this);
    }

    /**更新四维 */
    private updateSiwei() {
        this.setConfig();
    }


    /**接受到等待更新等待时间事件 */
    private waitLisenter(data) {
        console.log("wait", data);
        let lid = data.lid;
        let json = data.data;
        if (lid >= 0) {
            if (json.cd == 0) {
                this.loveBoxList[lid - 1] && this.loveBoxList[lid - 1].showCD(false);
            } else {
                let love = App.DataCenter.Love;
                for (let i = 0; i < love.length; i++) {
                    if (lid == love[i].lid) {
                        this.loveBoxList[i] && this.loveBoxList[i].showCD(true);
                        this.loveBoxList[i] && this.loveBoxList[i].setTimeText(json.cd, json.wait);
                    }
                }

                console.log(json.power);
                // this.setPowerText(App.DataCenter.UserInfo.power);
            }

        }
    }

    /**创建Item */
    private addItem() {
        this.itemGroup.removeChildren();
        this.loveBoxList = [];
        let love = App.DataCenter.Love;
        for (let i = 0; i < love.length; i++) {
            let data = love[i];
            let item = new LoveBox();
            this.loveBoxList.push(item);   //添加进列表
            item.setImg(data.pic);
            item.showBtn(true);
            if (data.need_tool == 0) {
                item.showDaoju(false);
            } else {
                item.showDaoju(true);
            }
            item.setTiliText(data.cons_power);
            item.setXinText(data.score)
            item.setTypeText(data.title);
            if (data.cd == 0) {
                item.showCD(false);
            } else {
                item.showCD(true);
                item.setTimeText(data.cd, data.wait);
            }

            item.setType(i);
            //item.x = (item.width + 40) * i + 40;

            if (love[i].need_tool == 0) {
                item.showDaoju(false);
            } else {
                item.showDaoju(true);

                item.setDaojuText(love[i].tool_name);

            }

            if (App.DataCenter.UserInfo.days >= love[i].available_days) {
                item.showBtn(true);
            } else {
                item.showBtn(false);
                item.setKaifangText(love[i].available_days);
            }


            this.itemGroup.addChild(item);
        }
    }

    /**更新数据,刷新计时 */
    private refreshData(data) {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                let cd = data[i].cd;
                let wait = data[i].wait;
                let item: LoveBox = this.loveBoxList[i];
                if (cd == 0) {
                    item.showCD(false);
                } else {
                    item.showCD(true);
                    item.setTimeText(cd, wait);
                }

                // item.setTimeText(60,3710);

            }
        }
    }

    /**start 按钮点击 */
    private startTouch() {

        let http = new HttpSender();
        let param = {};
        http.post(ProtocolHttpUrl.guideDone, param, this.finishGuideBack, this);


    }

    /**引导完成返回 */
    private finishGuideBack(data) {
        if (data.code == 200) {
            this.yindaoGroup.visible = false;
            egret.Tween.removeTweens(this.loveHand);
            App.DataCenter.loveGuide = false;
            App.DataCenter.guide.fill_nick_name = data.data.fill_nick_name;
            App.DataCenter.guide.emph_zone = data.data.emph_zone;
            App.DataCenter.guide.video = data.data.video;

            let http = new HttpSender();
            let json = ProtocolHttp.loveStart;
            json.lid = App.DataCenter.Love[0].lid;
            http.post(ProtocolHttpUrl.loveStart, json, this.sendBack, this);
        } else {
            Tips.info("" + data.info);
        }
    }

    /**请求返回 */
    private sendBack(data) {
        if (data.code == 200) {
            if (App.DataCenter.Love[0] && App.DataCenter.Love[0].duration) {
                App.PanelManager.open(PanelConst.LoveProPanel, App.DataCenter.Love[0]);
                let love = <LoveProPanel>App.PanelManager.getPanel(PanelConst.LoveProPanel);
                let count = 100;
                let delay = App.DataCenter.Love[0].duration * 1000 / 100;
                love.countDown(delay, count);
            } else {
                Tips.info("数据错误");
            }

        }
        if (data.code != 200) {
            Tips.info("" + data.info);
        }

    }

    /**根据天数解锁 */
    private jiesuoItem() {
        let love = App.DataCenter.Love;
        for (let i = 0; i < love.length; i++) {
            let item: LoveBox  = this.loveBoxList[i];
            // console.log("loveBoxList",this.loveBoxList);
            if (App.DataCenter.UserInfo.days >= love[i].available_days) {
                item && item.showBtn(true);
            } else {
                item && item.showBtn(false);
                item && item.setKaifangText(love[i].available_days);
            }
        }

    }

    /**关闭按钮点击 */
    private close() {
        this.hide();
        var gamescene = App.SceneManager.getScene(SceneConst.GameScene) as GameScene;
        gamescene.enterAnimation();
    }

    /**出场动画 */
    public outAnimation(finishCallback: Function = null) {

    }

    /**入场动画 */
    public enterAnimation() {

    }

    /**配置数值 */
    public setConfig() {
        this.setPowerText(App.DataCenter.UserInfo.power);
        this.setGoldText(App.DataCenter.UserInfo.gold);
        this.setXinText(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts);
    }

    /**设置爱心 */
    public setXinText(str, h) {
        if (h && h != "") {
            this.heartPlugin.setJindu(str, h);
        }
    }
    /**设置金币 */
    public setGoldText(str) {

        this.goldLabel.text = str;

    }
    /**设置体力 */
    public setPowerText(str) {

        this.powerLabel.text = str + "/100";

    }

    /**金币Group点击 */
    public goldGroupTouch() {
        App.PanelManager.open(PanelConst.ShopPanel, 1);
        let shop = <ShopPanel>App.PanelManager.getPanel(PanelConst.ShopPanel);
        shop.isBack = true;
    }

    /**体力Group点击 */
    public powerGroupTouch() {
        App.PanelManager.open(PanelConst.ShopPanel, 4);
        let shop = <ShopPanel>App.PanelManager.getPanel(PanelConst.ShopPanel);
        shop.isBack = true;
    }

   
    /**引导 */
    public setGuide() {
        if (App.DataCenter.loveGuide) {
            this.yindaoGroup.visible = true;
            egret.Tween.get(this.loveHand, { loop: true })
            .set({ x:this.handX})
            .to({ x: this.handX + 40}, 600)
            .to({ x: this.handX}, 800)
            .wait(100);
        }
    }
}