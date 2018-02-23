/**
 * 工作面板
 * @author xiongjian
 * @deta 2017/9/5
 */
class WorkPanel extends BasePanel {

    public backBtn: eui.Button;
    public workBoxScroller: eui.Scroller;
    public itemGroup: eui.Group;
    public xinLabel: eui.Label;
    public goldLabel: eui.Label;
    public diamendLabel: eui.Label;
    public upgrade_exp: number //经验条上限
    public heartPlugin: HeartsPlugins;
    public goldGroup: eui.Group;
    public diamondGroup: eui.Group;

    public workBoxList = [];//恋爱盒子列表

    private inited: boolean = false //

    /**引导 */
    public yindaoGroup: eui.Group;
    public yd_workImg: eui.Image;
    public workHand: eui.Image;
    public startBtn: eui.Button;

    private handX:number;


    public constructor() {
        super();
        this.skinName = "WorkPanelSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {
        this.handX = this.workHand.x;
        this.addItem();
        this.inited = true;
    }

    /**添加到场景中*/
    public onEnable() {
        this.setConfig();
        console.log("exps",App.DataCenter.UserInfo.exps,this.workBoxList);
        if(this.workBoxList && this.workBoxList[0]){
            this.workBoxList[0].setEXP(App.DataCenter.UserInfo.exps, this.upgrade_exp);
        }
        
        // this.backBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
        App.EventManager.addEvent(EventConst.WorkWaitTime, this.waitLisenter, this);
        // this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startTouch, this);
        this.goldGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goldGroupTouch, this);
        this.diamondGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.diamondGroupTouch, this);
        this.setGuide();
        CommomBtn.btnClick(this.backBtn,this.close,this,2);
        CommomBtn.btnClick(this.startBtn,this.startTouch,this,1);

         App.EventManager.addEvent(EventConst.UPDATE_SIWEI,this.updateSiwei,this);
    }

    /**从场景中移除*/
    public onRemove() {
        this.goldGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goldGroupTouch, this);
        this.diamondGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.diamondGroupTouch, this);

        CommomBtn.removeClick(this.backBtn,this.close,this);
        CommomBtn.removeClick(this.startBtn,this.startTouch,this);
    }

    /**更新四维 */
    private updateSiwei(){
        this.setConfig();
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
            egret.Tween.removeTweens(this.workHand);
            App.DataCenter.workGuide = false;
            App.DataCenter.guide.fill_nick_name = data.data.fill_nick_name;
            App.DataCenter.guide.emph_zone = data.data.emph_zone;
            App.DataCenter.guide.video = data.data.video;

            let http = new HttpSender();
            let json = ProtocolHttp.workStart;
            json.wid = App.DataCenter.Work[0].id;
            http.post(ProtocolHttpUrl.workStart, json, this.sendBack, this);
        } else {
            Tips.info("" + data.info);
        }
    }

    /**请求返回 */
    private sendBack(data) {
        if (data.code == 200) {
            if (App.DataCenter.Work[0] && App.DataCenter.Work[0].duration) {
                App.PanelManager.open(PanelConst.WorkProPanel, App.DataCenter.Work[0]);
                let work = <WorkProPanel>App.PanelManager.getPanel(PanelConst.WorkProPanel);
                let count = 100;
                let delay = App.DataCenter.Work[0].duration * 1000 / 100;
                work.countDown(delay, count);
            } else {
                Tips.info("数据错误");
            }

        }
        if (data.code !== 200) {
            Tips.info("" + data.info);
        }

    }

    /**关闭 */
    private close() {
        this.hide();
        var gamescene = App.SceneManager.getScene(SceneConst.GameScene) as GameScene;
        gamescene.enterAnimation();
    }

    /**创建Item */
    public addItem() {
        this.itemGroup.removeChildren();
        this.workBoxList = [];
        let wrok = App.DataCenter.Work;
        for (let i = 0; i < wrok.length; i++) {
            let data = wrok[i];
            let item = new WorkBox();
            this.workBoxList.push(item);   //添加进列表
            if (i == 0) {
                item.showJinyan(true);
                item.showShengzhi(false);
                item.showGongzuo(true);
                item.showSuo(false);
                item.setShengyuType(true);
                item.showCD(true);
                //经验条
                this.upgrade_exp = data.upgrade_exp;
                item.setEXP(data.exps, data.upgrade_exp);
                App.DataCenter.UserInfo.exps = data.exps;//保存工作经验

                item.setCishu(data.left_times);
                if (data.cd == 0) {
                    item.showCD(false);
                } else {
                    item.showCD(true);
                    item.setTimeText(data.cd, data.wait);
                }


            }
            if (i == 1) {
                item.showJinyan(false);
                item.showShengzhi(true);
                item.showGongzuo(false);
                item.showSuo(false);
                item.setShengyuType(false);
                item.setCishu(data.times);
                item.showCD(false);

            }
            if (i > 1) {
                item.showJinyan(false);
                item.showShengzhi(false);
                item.showGongzuo(false);
                item.showSuo(true);
                item.setShengyuType(false);
                item.setCishu(data.times);
                item.showCD(false);
            }

            item.setGoldText(data.gain_gold);
            item.setJinyanText(data.gain_exp);
            //类型
            item.setImg(data.pic);
            item.setTypeText(data.title);

            item.setType(i);
            //item.x = (item.width + 40) * i + 40;

            this.itemGroup.addChild(item);
        }
    }

    /**更新数据,刷新计时 */
    private refreshData(data) {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                let cd = data[i].cd;
                let wait = data[i].wait;
                let item: WorkBox = this.workBoxList[i];
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

    /**接受到等待更新等待时间事件 */
    private waitLisenter(data) {
        console.log("wait", data, "upgrade_exp", this.upgrade_exp);
        if (data) {
            if (data.cd == 0) {
                this.workBoxList[0].showCD(false);
            } else {
                this.workBoxList[0].showCD(true);
                this.workBoxList[0].setTimeText(data.cd, data.wait);
            }

            console.log("item", this.workBoxList[0]);
            App.DataCenter.UserInfo.exps = data.exps;//保存工作经验
            this.workBoxList[0].setEXP(data.exps, this.upgrade_exp);
            this.workBoxList[0].setCishu(data.left_times);
            App.DataCenter.UserInfo.workCount = data.left_times;//修改剩余工作次数
            this.setGoldText(data.gold);
        }
    }

    /**出场动画 */
    public outAnimation(finishCallback: Function = null) {

    }

    /**入场动画 */
    public enterAnimation() {

    }

    /**配置数值 */
    public setConfig() {
        this.setDiamendText(App.DataCenter.UserInfo.diamond);
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
    /**设置砖石 */
    public setDiamendText(str) {
        
            this.diamendLabel.text = str;
        
    }

    /**金币Group点击 */
    public goldGroupTouch() {
        App.PanelManager.open(PanelConst.ShopPanel,  1);
        let shop = <ShopPanel>App.PanelManager.getPanel(PanelConst.ShopPanel);
        shop.isBack = true;
    }

    /**砖石Group点击 */
    public diamondGroupTouch() {
        App.PanelManager.open(PanelConst.ShopPanel,  2);
        let shop = <ShopPanel>App.PanelManager.getPanel(PanelConst.ShopPanel);
        shop.isBack = true;
    }

    /**引导 */
    public setGuide() {
        if (App.DataCenter.workGuide) {
            this.yindaoGroup.visible = true;
            egret.Tween.get(this.workHand, { loop: true })
            .set({ x: this.handX, y: 614 })
            .to({ x: this.handX + 40, y: 614 }, 600)
            .to({ x: this.handX, y: 614 }, 800)
            .wait(100);
        }
    }
}