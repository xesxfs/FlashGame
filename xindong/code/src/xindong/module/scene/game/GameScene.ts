/**
 * 游戏界面
 * @author xiongjian
 * @date 2017/08/24
 */
class GameScene extends BaseScene {
    /**控制模块*/
    protected ctrl: GameMediator;

    /**钻石UI */
    private diamondUI:DiamondUI; 
    /**金币UI */
    private goldUI:GoldUI;
    /**体力UI */
    private powerUI:PowerUI;

    private rectGroup: eui.Group //定位Group
    private btnGroup: eui.Group;  //按钮Group
    private btnBG: eui.Image;     //按钮背景
    private upGroup: eui.Group;//上部分group
    private leftGroup: eui.Group;//左边部分
    private downGroup: eui.Group;//下边部分
    public gameBG: eui.Image;    //背景图
    public mohuBG: eui.Image;    //模糊背景

    private isOut: boolean = true;
    private finishIn: boolean = false;
    private finishOut: boolean = true;

    public heartPlugin: HeartsPlugins;

    public setBtn: SetBtn;          //设置

    public dateLabel: eui.BitmapLabel;    //天数lebel
    public qiandaoBtn: eui.Button;
    public fuliBtn: eui.Button;

    /**引导 */
    public yindaoGroup: eui.Group;
    public yindaodianhuaGroup: eui.Group;
    public yindaolianaiGroup: eui.Group;
    public yindaoGongzuoGroup: eui.Group;
    public yindaoShipinGroup: eui.Group;
    public yindaoweixinGroup: eui.Group;
    public yd_dianhuaImg: eui.Image;
    public dianhuaHand: eui.Image;

    public yd_lianaiImg: eui.Image;
    public lianaiHand: eui.Image;

    public yd_gongzuoImg: eui.Image;
    public gongzuoHand: eui.Image;

    public yd_shipinImg: eui.Image;
    public shipinHand: eui.Image;

    public yd_weixinImg: eui.Image;
    public weixinHand: eui.Image;

    /**任务提示 */
    private taskTipUI:TaskTipUI;

    //底部按钮
    private dianhuaBtn: DianhuaBtn;
    private weixinBtn: WeixinBtn;
    private weiboBtn: WeiboBtn;
    private lianaiBtn: LianaiBtn;
    private gongzuoBtn: GongzuoBtn;
    private beibaoBtn: BeibaoBtn;
    // private shipinBtn: ShipinBtn;
    private shangchengBtn: ShangchengBtn;

    public shipinBtn: eui.Button;

    private inited: boolean = false  //资源是否加载完毕
    private timeout;//延时
    private timeout1;//延时1

    private rectList = []       //按钮定位
    private btnList = []  //按钮配置
    private testlist = [1, 2, 3, 4, 5, 6, 7, 8]

    private shareBtn:ShareBtn;      //分享按钮
    private actBtn:ActBtn;          //活动中心
    private shouChongBtn:eui.Image; //首冲礼包

    /**游戏结束弹框 */
    private gameOverDialog:GameOverDialog;

    public constructor(ctrl:GameMediator) {
        super();
        this.skinName = "GameSceneSkin";
        this.ctrl = ctrl;
    }

    protected childrenCreated() {
        this.setActiveBtn();
        this.rectPoint();
        this.setBottomBtn(this.btnList);
        this.enterAnimation();
        this.inited = true;
        this.setConfig();

        //引导
        this.setGuide();  
    }

    public onEnable() {
        console.log("GameScene >> 进入游戏界面");
        this.rectGroup.visible = false;
        if (this.inited) {
            this.enterAnimation();
        }

        if (App.DataCenter.isVideoPlaying) {
            App.SoundManager.stopBGM();
        } else {
            App.SoundManager.playBGM(SoundManager.bgm);

        }

        CommomBtn.btnClick(this.setBtn, this.setBtnTouch, this);

        this.lianaiBtn && this.lianaiBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.lianaiBtnTouch, this);
        this.gongzuoBtn && this.gongzuoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gongzuoBtnTouch, this);
        this.shipinBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shipinBtnTouch, this);
        this.fuliBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.fuliBtnTouch, this);

        this.yd_dianhuaImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.yd_dianhuaImgTouch, this);
        this.yd_lianaiImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.yd_lianaiImgTouch, this);
        this.yd_gongzuoImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.yd_gongzuoImgTouch, this);
        this.yd_shipinImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.yd_shipinImgTouch, this);
        this.yd_weixinImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.yd_weixinImgTouch, this);

        this.goldUI.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goldGroupTouch, this);
        this.diamondUI.addEventListener(egret.TouchEvent.TOUCH_TAP, this.diamondGroupTouch, this);
        this.powerUI.addEventListener(egret.TouchEvent.TOUCH_TAP, this.powerGroupTouch, this);

        CommomBtn.btnClick(this.shareBtn, this.onShareTouch, this,1);
        CommomBtn.btnClick(this.actBtn, this.onActTouch, this, 1);

        App.EventManager.addEvent(EventConst.guide, this.guideBack, this);
        App.EventManager.addEvent(EventConst.UPDATE_RED_TIP, this.onUpdateRedTip, this);

        App.StageUtils.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.stageTouch, this);
    }

    public onRemove() {

    }

    /**定位按钮位置 */
    private rectPoint() {
        this.rectList = [];
        for (let i = 0; i < this.rectGroup.numChildren; i++) {
            this.rectList.push(new egret.Point(this.rectGroup.getChildAt(i).x, this.rectGroup.getChildAt(i).y));
        }
        console.log("rectPoint", this.rectList);
    }

    /**配置底部按钮 */
    private setBottomBtn(list) {
        this.btnGroup.removeChildren();
        var allBtn = [];
        list.sort();//排下序
        for (let i = 0; i < list.length; i++) {
            switch (list[i]) {
                case 0:
                    break;
                case 1:
                    this.dianhuaBtn = new DianhuaBtn();
                    allBtn.push(this.dianhuaBtn);
                    break;
                case 2:
                    this.weixinBtn = new WeixinBtn();
                    allBtn.push(this.weixinBtn);
                    break;
                case 3:
                    this.lianaiBtn = new LianaiBtn();
                    allBtn.push(this.lianaiBtn);
                    break;
                case 4:
                    this.gongzuoBtn = new GongzuoBtn();
                    allBtn.push(this.gongzuoBtn);
                    break;
                case 5:
                    this.weiboBtn = new WeiboBtn();
                    allBtn.push(this.weiboBtn);
                    break;
                case 6:
                    this.beibaoBtn = new BeibaoBtn();
                    allBtn.push(this.beibaoBtn);
                    break;
                case 7:
                    this.shangchengBtn = new ShangchengBtn();
                    allBtn.push(this.shangchengBtn);
                    break;
                case 8:
                    this.shipinBtn.visible = true;
                    break;

            }
        }

        for (let i = 0; i < allBtn.length; i++) {
            let num = this.rectList.length - allBtn.length + i;
            allBtn[i].x = this.rectList[num].x;
            allBtn[i].y = this.rectList[num].y;
            this.btnGroup.addChild(allBtn[i]);
        }
        this.btnBG.width = allBtn.length * 115 + 75;

    }


    /**入场动画 */
    public enterAnimation() {
        this.btnGroup.touchChildren = true;

        // //更新数据
        this.setConfig();
        this.setActive();

        //是否能升级
        console.log("isUpgrade", this.isUpgrade());
        if (this.isUpgrade()) {
            this.upGrade();
        }

        //上面部分
        egret.Tween.get(this.upGroup).set({ x: 1278, y: 12 })
            .to({ x: 963, y: 12 }, 250)
            .to({ x: 943, y: 12 }, 200)
            .to({ x: 953, y: 12 }, 150)
            .call(() => {
                egret.Tween.removeTweens(this.upGroup);
            });

        //左边部分
        egret.Tween.get(this.leftGroup).set({ x: -800, y: 0 })
            // .to({ x: -26, y: -17 }, 250)
            // .to({ x: -6, y: -17 }, 200)
            .to({ x: 0, y: 0 }, 250)
            .call(() => {
                egret.Tween.removeTweens(this.leftGroup);
            });
        //下边部分
        egret.Tween.get(this.downGroup).set({ x: 1280, y: 517 })
            // .to({ x: 370, y: 517 }, 150)
            // .to({ x: 350, y: 517 }, 200)
            .to({ x: 360, y: 517 }, 250)
            .call(() => {
                egret.Tween.removeTweens(this.downGroup);
            });

        /**背景模糊 */
        egret.Tween.get(this.mohuBG).set({ alpha: 1 })
            .to({ alpha: 0 }, 500)
            .call(() => {
                egret.Tween.removeTweens(this.mohuBG);
            });

    }
    /**出场动画 */
    public outAnimation(finishCallback: Function = null) {
        this.btnGroup.touchChildren = false;
        clearTimeout(this.timeout1);
        //下面部分
        egret.Tween.get(this.upGroup).set({ x: 953, y: 12 })
            .to({ x: 943, y: 12 }, 150)
            .to({ x: 963, y: 12 }, 200)
            .to({ x: 1278, y: 12 }, 250)
            .call(() => {
                egret.Tween.removeTweens(this.upGroup);
            });

        //左边部分
        egret.Tween.get(this.leftGroup).set({ x: 0, y: 0 })
            .to({ x: -800, y: 0 }, 250)
            .call(() => {
                egret.Tween.removeTweens(this.leftGroup);
            });
        //下边部分
        egret.Tween.get(this.downGroup).set({ x: 360, y: 517 })
            .to({ x: 1280, y: 517 }, 250)
            .call(() => {
                egret.Tween.removeTweens(this.downGroup);
            });

        this.timeout1 = setTimeout(finishCallback, 70 * this.btnGroup.numChildren + 250);

        /**背景模糊 */
        egret.Tween.get(this.mohuBG).set({ alpha: 0 })
            .to({ alpha: 1 }, 500)
            .call(() => {
                egret.Tween.removeTweens(this.mohuBG);
            });

    }

    /**视频按钮点击 */
    private shipinBtnTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        let http:HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.videoList, {}, this.revVideoList, this);
    }

    //接收视频列表
    private revVideoList(data){
        if(data.code == 200){
            //保存视频数据
            App.DataCenter.Video.mem = data.data.mem;
            App.DataCenter.Video.fav = data.data.fav;
            
            this.outAnimation(() => {
                App.PanelManager.open(PanelConst.ShipinPanel);
            });
        }else{
            Tips.info(data.info);
        }
    }


    /**电话引导点击 */
    private yd_dianhuaImgTouch() {
        this.yindaoGroup.visible = false;
        this.yindaodianhuaGroup.visible = false;
        App.DataCenter.dianhuaGuide = true;//电话二级引导
        egret.Tween.removeTweens(this.dianhuaHand);

        App.SoundManager.playEffect(SoundManager.button);
        let gameScene = <GameScene>App.SceneManager.getScene(SceneConst.GameScene);
        gameScene.outAnimation(() => {
            App.PanelManager.open(PanelConst.DianhuaPanel);
        });
    }
    /**引发微信点击 */
    private yd_weixinImgTouch() {

        this.yindaoGroup.visible = false;
        this.yindaoweixinGroup.visible = false;
        App.DataCenter.weixinGuide = true;//电话二级引导
        egret.Tween.removeTweens(this.weixinHand);

        App.SoundManager.playEffect(SoundManager.button);
        this.outAnimation(() => {
            App.PanelManager.open(PanelConst.WeixinPanel);
        });
    }

    /**恋爱引导 */
    private yd_lianaiImgTouch() {
        this.yindaoGroup.visible = false;
        this.yindaolianaiGroup.visible = false;
        App.DataCenter.loveGuide = true;//电话二级引导
        egret.Tween.removeTweens(this.lianaiHand);

        App.SoundManager.playEffect(SoundManager.button);
        this.outAnimation(() => {
            App.PanelManager.open(PanelConst.LovePanel);
        });
    }
    /**工作引导 */
    private yd_gongzuoImgTouch() {
        this.yindaoGroup.visible = false;
        this.yindaoGongzuoGroup.visible = false;
        App.DataCenter.workGuide = true;//电话二级引导
        egret.Tween.removeTweens(this.gongzuoHand);

        App.SoundManager.playEffect(SoundManager.button);
        this.outAnimation(() => {
            App.PanelManager.open(PanelConst.WorkPanel);
        })
    }

    /**视频引导 */
    private yd_shipinImgTouch() {
        this.yindaoGroup.visible = false;
        this.yindaoShipinGroup.visible = false;
        App.DataCenter.shipinGuide = true;//电话二级引导
        egret.Tween.removeTweens(this.shipinHand);

        this.outAnimation(() => {
            App.PanelManager.open(PanelConst.ShipinPanel);
        });
    }

    /**金币Group点击 */
    private goldGroupTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        App.PanelManager.open(PanelConst.ShopPanel, 1);

    }

    /**砖石Group点击 */
    private diamondGroupTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        App.PanelManager.open(PanelConst.ShopPanel, 2);

    }

    /**体力Group点击 */
    private powerGroupTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        App.PanelManager.open(PanelConst.ShopPanel, 4);

    }

    /**体力图片点击 */
    private tiliImgTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        this.outAnimation(() => { App.SceneManager.open(SceneConst.LoginScene) });
    }
    /**设置点击 */
    private setTouch() {
        App.SoundManager.playEffect(SoundManager.button);
    }

    /**福利按钮点击 */
    private fuliBtnTouch() {

    }
    /**签到按钮点击 */
    private qiandaoBtnTouch() {
        App.PanelManager.open(PanelConst.WorkProPanel);
        let love = <LoveProPanel>App.PanelManager.getPanel(PanelConst.WorkProPanel);
        let count = 100;
        let delay = 10000 / 100;
        love.countDown(delay, count);
    }

    /**活动按钮点击 */
    private huodongBtnTouch() {
        TipsHeat.showHeat(10);
        App.SoundManager.playEffect(SoundManager.button);
    }
    /**福利按钮点击 */
    private fuBtnTouch() {
        App.SoundManager.playEffect(SoundManager.button);
    }
    /**设置按钮点击 */
    private setBtnTouch() {
        this.getMail();
    }
    /**免费按钮点击 */
    private mianfeiBtnTouch() {
        App.LoadingLock.httpLock(() => {
            console.log("请求超时");
        })
    }
    /**恋爱按钮点击 */
    private lianaiBtnTouch() {

        App.SoundManager.playEffect(SoundManager.button);
        this.outAnimation(() => {
            App.PanelManager.open(PanelConst.LovePanel);
        });

    }

    /**工作按钮点击 */
    private gongzuoBtnTouch() {

        App.SoundManager.playEffect(SoundManager.button);
        this.outAnimation(() => {
            App.PanelManager.open(PanelConst.WorkPanel);
        })
    }

    /**商城按钮点击 */
    private shopTouch() {
        this.outAnimation(() => {
            App.PanelManager.open(PanelConst.ShopPanel);
        })
    }

    /**电话按钮点击 */
    private beibaoBtnTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        this.outAnimation(() => {
            this.ctrl.reqBags();
        })
    }

    //点击分享
    private onShareTouch(){
        App.PanelManager.open(PanelConst.SharePanel);
    }

    //活动中心
    private onActTouch(){
        this.ctrl.reqLoginReward();
    }

    /**设置爱心 */
    public setXinText(str, h) {
        if (h && h != "") {
            this.heartPlugin.setJindu(str, h);
        }
    }

    /**设置天数 */
    public setDateText(str) {
        if (str && str != "") {
            if (str >= 10 && str < 100) {
                this.dateLabel.scaleX = 0.8;
                this.dateLabel.scaleY = 0.8;
            }
            if (str >= 100 && str < 1000) {
                this.dateLabel.scaleX = 0.6;
                this.dateLabel.scaleY = 0.6;
            }
            if (str >= 1000) {
                this.dateLabel.scaleX = 0.4;
                this.dateLabel.scaleY = 0.4;
            }

            this.dateLabel.text = str;
        }
    }
    /**设置砖石 */
    public setDiaMondText(str) {
        this.diamondUI.setDiamond(str);
    }


    /**配置数值 */
    public setConfig() {
        console.log("config", App.DataCenter.UserInfo.days);
        this.setDateText(App.DataCenter.UserInfo.days);
        this.diamondUI.setDiamond(App.DataCenter.UserInfo.diamond);
        this.goldUI.setGold(App.DataCenter.UserInfo.gold);
        this.powerUI.setPower(App.DataCenter.UserInfo.power);
        this.setXinText(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts);

    }

    /**现阶段可操作选项 */
    public setActive() {

        this.taskTipUI.visible = false;

        let power = App.DataCenter.UserInfo.power;  //体力
        let workCount = App.DataCenter.UserInfo.workCount; //剩余工资次数

        let nextWeixin = App.DataCenter.UserInfo.nextWechat; //是否有下阶段微信
        let nextTel = App.DataCenter.UserInfo.nextTel; //是否有下阶段电话

        let main_event = App.DataCenter.ConfigInfo.main_event;//必须完成的主事件
        let finish_event = App.DataCenter.ConfigInfo.finish_main_event;//已经完成的主事件
        let mail = App.DataCenter.mail;                       //邮件

        //第一阶段微信在电话打完后出现
        if (App.DataCenter.ConfigInfo.days == 1 && App.DataCenter.UserInfo.tel_main) {
            let ispush = false;
            for (let i = 0; i < this.btnList.length; i++) {
                if (this.btnList[i] == 2) {
                    ispush = true;
                }
            }
            if (!ispush) {
                this.btnList.push(2);
            }
            this.setBottomBtn(this.btnList);
            this.setGuide();
        }

        console.log("tel", nextTel, "we", nextWeixin);
        console.log("uheart", App.DataCenter.UserInfo.hearts, "cheart", App.DataCenter.ConfigInfo.hearts);

        //微博
        let nextWeibo = false;//是否有可操作微博
        let weibo = App.DataCenter.Weibo;
        for (let i = 0; i < weibo.data.length; i++) {
            if (weibo.data[i].is_approve == 0 || weibo.data[i].is_reply == 0) {
                nextWeibo = true;
            } else {
                nextWeibo = false;
            }

        }

        if (nextWeibo) {
            this.weiboBtn && this.weiboBtn.showRedPoint(true);
        } else {
            this.weiboBtn && this.weiboBtn.showRedPoint(false);
        }


        // //微信
        if (nextWeixin && App.DataCenter.UserInfo.tel_main) {

            console.log(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts)
            if (App.DataCenter.UserInfo.hearts >= App.DataCenter.ConfigInfo.hearts) {
                this.weixinBtn && this.weixinBtn.showRedPoint(true);
                this.taskTipUI.visible = true;
                this.taskTipUI.setTip("快给小野发个微信吧~");
            } else {
                this.weixinBtn && this.weixinBtn.showRedPoint(true);

            }
        } else {
            this.weixinBtn && this.weixinBtn.showRedPoint(false);
        }

        //电话
        if (nextTel) {
            if (App.DataCenter.UserInfo.hearts >= App.DataCenter.ConfigInfo.hearts) {
                this.dianhuaBtn.showRedPoint(true);
                this.taskTipUI.visible = true;
                this.taskTipUI.setTip("快给小野打个电话吧~");
            } else {
                this.dianhuaBtn.showRedPoint(true);
            }
        } else {
            this.dianhuaBtn.showRedPoint(false);
        }

        //更新红点提示
        App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);
    }

    /**能否升级 */
    public isUpgrade() {


        let tel_event = App.DataCenter.UserInfo.tel_main;//电话主事件
        let wechat_event = App.DataCenter.UserInfo.wechat_main;//微信主事件
        console.log("tel_event", tel_event, "wechat_event", wechat_event);
        let myhearts = App.DataCenter.UserInfo.hearts;
        let configHeart = App.DataCenter.ConfigInfo.hearts;

        if (tel_event && wechat_event && myhearts >= configHeart) {
            return true;
        } else {
            return false;
        }
    }

    /**升级 */
    public upGrade() {
        App.LoadingLock.lockScreen();
        console.log("GameScene >> 询问是否可以升级");
        let http = new HttpSender();
        http.post(ProtocolHttpUrl.prepare, {}, this.prepareBack, this);

    }

    

    /**能否升级返回 */
    private prepareBack(data) {
        if (data.code == 200) {
            console.log("GameScene >> 请求升级");
            let http = new HttpSender();
            http.post(ProtocolHttpUrl.upgrade, {}, this.upgradeBack, this);
        } else if(data.code == 911){
           //已经满级，游戏结束
           if(this.gameOverDialog == null){
               this.gameOverDialog = new GameOverDialog();
               this.gameOverDialog.show();
           }
           App.LoadingLock.unLockScreen();
        }else{
            Tips.info("" + data.info);
            App.LoadingLock.unLockScreen();
        }
    }

    /**升级返回 */
    private upgradeBack(data) {
        if(data.code == 200){
            App.DataCenter.readGameInfo(data);
            this.playUpgradeAnim();
            //更新红点提示
            App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);
        } else {
            App.LoadingLock.unLockScreen();
            Tips.info("" + data.info);
        }
    }

    //播放升级动画
    private playUpgradeAnim() {
        console.log("GameScene >> 播放升级动画")

        App.LoadingLock.lockNoAnim();

        var anim: UpgradeAnim = new UpgradeAnim();
        App.LayerManager.topLayer.addChild(anim);
        anim.x = (App.StageUtils.stageWidth - 590) / 2;
        anim.y = (App.StageUtils.stageHeight - 534) / 2;
        anim.play();
        anim.once(egret.Event.COMPLETE, this.onUpgradeAnimComplete, this);

        App.SoundManager.playEffect(SoundManager.levelup);
    }

    //动画播放完成，请求播放视频
    private onUpgradeAnimComplete(e: egret.Event) {
        var anim: UpgradeAnim = e.target;
        anim.destoryMe();

        this.sendPalyVideo();
    }

    //升级完成后，激活界面
    private upgradeActiveView(){
        //延迟执行，防止动画、视频、引导显示过于集中
        let t = setTimeout(() => {
            clearTimeout(t);
            App.LoadingLock.unlock();
            this.setConfig();
            this.setActiveBtn();
            this.setBottomBtn(this.btnList);
            this.setGuide();
            this.setActive();
        }, 2000);
    }


    /**升级视频播放 */
    public sendPalyVideo() {
        if (App.DeviceUtils.IsIos && App.DeviceUtils.IsNative) {
            let http = new HttpSender();
            let param = { ossvid: App.DataCenter.ConfigInfo.video };
            http.post(ProtocolHttpUrl.videoPlay, param, this.videoUrlBack, this);
        } else {
            let http = new HttpSender();
            let param = { ossvid: App.DataCenter.ConfigInfo.video };
            http.post(ProtocolHttpUrl.videoUrl, param, this.videoUrlBack, this);
        }
    }

    /**请求视频Url */
    public videoUrlBack(data) {
        if (data.code == 200) {
            //web版本需要点击播放
            if(App.DeviceUtils.IsWeb){
                let dialog:PlayVideoDialog = new PlayVideoDialog();
                dialog.setContent("快去看看小野在干什么");
                dialog.setOk(()=>{
                    this.upgradeActiveView();
                    if(App.DeviceUtils.IsWeb){
                        App.EventManager.sendEvent(EventConst.PLAY_WEB_VIDEO, data.data.url);
                    }else if(App.DeviceUtils.IsIos && App.DeviceUtils.IsNative){
                        App.NativeBridge.sendPlayVideo("1", data.data);
                    }else if(App.DeviceUtils.IsAndroid && App.DeviceUtils.IsNative){
                        App.NativeBridge.sendPlayVideo("1", data.data.url);
                    }
                    
                },this);
                dialog.show(false);
            //非web版本，直接播放视频
            }else{
                this.upgradeActiveView();
                if(App.DeviceUtils.IsWeb){
                    App.EventManager.sendEvent(EventConst.PLAY_WEB_VIDEO, data.data.url);
                }else if(App.DeviceUtils.IsIos && App.DeviceUtils.IsNative){
                    App.NativeBridge.sendPlayVideo("1", data.data);
                }else if(App.DeviceUtils.IsAndroid && App.DeviceUtils.IsNative){
                    App.NativeBridge.sendPlayVideo("1", data.data.url);
                }
            }
        } else {
            App.LoadingLock.unLockScreen();
            Tips.info("" + data.info);
        }
    }

    /**获取邮件列表 */
    private getMail() {
        let http = new HttpSender();
        let param = {};
        http.post(ProtocolHttpUrl.mailList, param, this.mailBack, this);
    }

    /**获取邮件列表返回 */
    private mailBack(data) {
        if (data.code == 200) {
            App.DataCenter.mail = data.data;
            this.outAnimation(() => {
                App.PanelManager.open(PanelConst.SetPanel);
            });
            //更新红点提示
            App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);
        } else {
            Tips.info("" + data.info);
        }
    }

    /**
     * 主界面的引导
     */
    public setGuide() {
        let guide = App.DataCenter.guide;
        let type = guide.emph_zone;
        console.log("GameScene >> 当前引导:", guide);
        if (guide.video) {
            if (App.DeviceUtils.IsNative) {
                let http = new HttpSender();
                let param = { ossvid: guide.video };
                http.post(ProtocolHttpUrl.videoPlay, param, this.videoUrlBack, this);

            } else {

                let http = new HttpSender();
                let param = { ossvid: guide.video };
                http.post(ProtocolHttpUrl.videoUrl, param, this.videoUrlBack, this);
                this.guideBack();
            }
        }else if (guide.fill_nick_name) {
            App.PanelManager.open(PanelConst.InputNamePanel);
        }else{
            this.checkFirstLogin();
            this.checkShouChong();
        }

        switch (type) {
            case "ZONE_PHONE":
                this.yindaoGroup.visible = true;
                this.yindaodianhuaGroup.visible = true;
                egret.Tween.get(this.dianhuaHand, { loop: true }).set({ x: 921, y: 476 }).to({ x: 924, y: 436 }, 600).to({ x: 921, y: 476 }, 800).wait(100);

                break;
            case "ZONE_WEIXIN":
                this.yindaoGroup.visible = true;
                this.yindaoweixinGroup.visible = true;
                egret.Tween.get(this.weixinHand, { loop: true }).set({ x: 921, y: 476 }).to({ x: 924, y: 436 }, 600).to({ x: 921, y: 476 }, 800).wait(100);
                break;
            case "ZONE_LOVE":
                this.yindaoGroup.visible = true;
                this.yindaolianaiGroup.visible = true;
                egret.Tween.get(this.lianaiHand, { loop: true }).set({ x: 921, y: 476 }).to({ x: 924, y: 436 }, 600).to({ x: 921, y: 476 }, 800).wait(100);
                break;
            case "ZONE_WORK":
                this.yindaoGroup.visible = true;
                this.yindaoGongzuoGroup.visible = true;
                egret.Tween.get(this.gongzuoHand, { loop: true }).set({ x: 921, y: 476 }).to({ x: 924, y: 436 }, 600).to({ x: 921, y: 476 }, 800).wait(100);
                break;
            case "ZONE_VIDEO":
                this.yindaoGroup.visible = true;
                this.yindaoShipinGroup.visible = true;
                egret.Tween.get(this.shipinHand, { loop: true }).set({ x: 1136, y: 154 }).to({ x: 1136, y: 114 }, 600).to({ x: 1136, y: 154 }, 800).wait(100);
                break;

        }
    }

    /**引导视频结束 */
    private guideBack() {
        if (App.DataCenter.guide.video) {
            this.finishGuide();
        }
    }

    /**完成引导 */
    private finishGuide() {
        let http = new HttpSender();
        let param = {};
        http.post(ProtocolHttpUrl.guideDone, param, this.finishGuideBack, this);
    }

    /**引导完成返回 */
    private finishGuideBack(data) {
        if (data.code == 200) {
            this.yindaoGroup.visible = false;
            egret.Tween.removeTweens(this.dianhuaHand);
            App.DataCenter.dianhuaGuide = false;
            App.DataCenter.guide.fill_nick_name = data.data.fill_nick_name;
            App.DataCenter.guide.emph_zone = data.data.emph_zone;
            App.DataCenter.guide.video = data.data.video;
            this.setGuide();
        } else {
            Tips.info("" + data.info);
        }
    }

    /**设置解锁按钮 */
    private setActiveBtn() {
        this.btnList = [];
        let data = App.DataCenter.ConfigInfo.avilable_event;
        for (let i = 0; i < data.length; i++) {
            switch (data[i].type) {
                case "tel":
                    this.btnList.push(1);
                    break;
                case "wechat":
                    if (App.DataCenter.ConfigInfo.days != 1 || App.DataCenter.guide.emph_zone != "ZONE_PHONE") {
                        this.btnList.push(2);
                    }
                    break;
                case "love":
                    this.btnList.push(3);
                    break;
                case "work":
                    this.btnList.push(4);
                    break;
                case "weibo":
                    this.btnList.push(5);
                    break;
                case "back":
                    this.btnList.push(6);
                    break;
                case "shop":
                    this.btnList.push(7);
                    break;
                case "video":
                    this.btnList.push(8);
                    break;
            }
        }
    }

    //更新游戏场景中红心提示
    private onUpdateRedTip() {
        //邮件提示
        let mail = App.DataCenter.mail;
        if (mail && mail.length > 0) {
            this.setBtn.showRedPoint(true);
        } else {
            this.setBtn.showRedPoint(false);
        }

        //活动中心提示
        if(App.DataCenter.isPower || 
         App.DataCenter.login_reward == LoginRewardStatus.RedTip || 
            !App.DataCenter.first_gift){
            this.actBtn.showRedPoint(true);
        }else{
            this.actBtn.showRedPoint(false);
        }

        //首冲按钮显示
        this.checkShouChong();
    }

    /**舞台点击 */
    private stageTouch(e: egret.TouchEvent) {
        let dianji:DianjiAnim = ObjectPool.getPool(DianjiAnim.NAME).getObject();
        App.LayerManager.topLayer.addChild(dianji);
        dianji.x = e.stageX;
        dianji.y = e.stageY;
        dianji.gotoAndPlay(1);
        dianji.once(egret.Event.COMPLETE, this.onDianjiAnimComplete, this);
    }

    /**点击动画播放完成 */
    private onDianjiAnimComplete(e: egret.Event) {
        let dianji: UpgradeAnim = e.target;
        dianji.destoryMe();
        ObjectPool.getPool(DianjiAnim.NAME).returnObject(dianji);
    }


    /**当有首冲标志位true时，显示首冲按钮*/
    private checkShouChong(){
        if(App.DataCenter.first_gift == false){
            CommomBtn.btnClick(this.shouChongBtn, this.onShouChongTouch, this);
        }else{
            this.shouChongBtn.visible = false;
        }
    }
    
    /**点击首冲礼包 */
    private onShouChongTouch(){
        this.ctrl.reqLoginReward(2);
    }

    /**检查是否首次登录(首次登录，自动打开活动中心)*/
    private checkFirstLogin(){
        if(App.DataCenter.is_first_login){
            App.DataCenter.is_first_login = false;
            this.ctrl.reqLoginReward();
        }
    }
}