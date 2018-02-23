/**
 * 游戏界面
 * @author xiongjian
 * @date 2017/08/24
 */
class GameScene extends BaseScene {
    /**控制模块*/
    protected ctrl: GameMediator;

    private guideGroup: eui.Group;         //引导总Group

    private telGuideGroup: eui.Group;      //电话引导
    private telGuideImg: eui.Image;
    private telHand: eui.Image;

    private loveGuideGroup: eui.Group;     //恋爱引导
    private loveGuideImg: eui.Image;
    private loveHand: eui.Image;

    private workGuideGroup: eui.Group;     //工作引导
    private workGuideImg: eui.Image;
    private workHand: eui.Image;

    private wxGuideGroup: eui.Group;       //微信引导
    private wxGuideImg: eui.Image;
    private wxHand: eui.Image;
    private wxGuideOne:eui.Group;
    private wxGuideTwo:eui.Group;
    private wxGuideLabel:eui.Label;         

    private colGuideGroup: eui.Group;      //珍藏引导
    private colGuideImg: eui.Image;
    private colHand: eui.Image;

    private upgradeGuideGroup:eui.Group;   //升级指引
    private upgradeGuideImg:eui.Image;
    private upgradeHand:eui.Image; 

    private interactGuideGorup:eui.Group;  //互动指引
    private interactGuideImg:eui.Image;
    private interactHand:eui.Image;
    
    

    private taskTipUI:TaskTipUI;  //任务提示
    private btnList = []          //按钮配置


    //================ 新版 =============
    public gameBG: eui.Image;     //背景图
    public mohuBG: eui.Image;     //模糊背景

    public topMenu:TopMenu;            //顶部菜单
    private topGroup:eui.Group;        //顶部Group
    private leftGroup:eui.Group;       //左边Group
    private rightGroup:eui.Group;      //右边Group
    private buttomGroup:eui.Group;     //底部Group
    private parGro:eui.Group;          //底部心粒子容器
    private topTween:eui.Group;        //Tween移动距离定位用的，因为3款皮肤移动距离各不一样
    private leftTween:eui.Group;  
    private rightTween:eui.Group;
    private buttomTween:eui.Group;

    private rankBtn:MenuBtn;        //排行榜
    private actBtn:MenuBtn;         //活动中心
    private shouChongBtn:MenuBtn;   //首冲礼包
    private interactBtn:MenuBtn;    //互动
    private telBtn: MenuBtn;        //电话
    private wechatBtn: MenuBtn;     //微信          
    private loveBtn: MenuBtn;       //恋爱
    private workBtn: MenuBtn;       //工作
    private bagBtn: MenuBtn;        //背包
    private shopBtn: MenuBtn;       //商城
    private collectionBtn:MenuBtn;  //收藏
    private setBtn: MenuBtn;        //设置

    private dayUI:DayUI;            //日期
    
    /**游戏结束弹框 */
    private gameOverDialog:GameOverDialog;

    public constructor(ctrl:GameMediator) {
        super();
        this.skinName = "GameSceneSkin";
        this.ctrl = ctrl;
    }

    protected childrenCreated() {
        this.guideGroup.visible = false;

        this.setActiveBtn();
        this.setBottomBtn(this.btnList);
        this.enterAnimation();

        this.updateAsset();
        //引导
        this.setGuide();  
    }

    public onEnable() {
        console.log("GameScene >> 进入游戏大厅");

        this.enterAnimation();

        SoundManager.bgm = App.DataCenter.UserInfo.bgm;
        if (App.SoundManager.allowPlayBGM) {
            App.SoundManager.playBGM(SoundManager.bgm);
        } else {
            App.SoundManager.stopBGM();
        }

        CommomBtn.btnClick(this.setBtn, this.onMenuTouch, this);
        CommomBtn.btnClick(this.actBtn, this.onMenuTouch, this);
        CommomBtn.btnClick(this.rankBtn, this.onMenuTouch, this);
        CommomBtn.btnClick(this.shouChongBtn, this.onMenuTouch, this);
        CommomBtn.btnClick(this.interactBtn, this.onMenuTouch, this);
        CommomBtn.btnClick(this.telBtn, this.onMenuTouch, this);
        CommomBtn.btnClick(this.wechatBtn, this.onMenuTouch, this);
        CommomBtn.btnClick(this.loveBtn, this.onMenuTouch, this);
        CommomBtn.btnClick(this.workBtn, this.onMenuTouch, this);
        CommomBtn.btnClick(this.bagBtn, this.onMenuTouch, this);
        CommomBtn.btnClick(this.shopBtn, this.onMenuTouch, this);
        CommomBtn.btnClick(this.collectionBtn, this.onMenuTouch, this);
        CommomBtn.btnClick(this.setBtn, this.onMenuTouch, this);
        CommomBtn.btnClick(this.rankBtn, this.onMenuTouch, this);

        this.telGuideImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTelGuideTouch, this);
        this.loveGuideImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoveGuideTouch, this);
        this.workGuideImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWorkGuideTouch, this);
        this.colGuideImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onColGuideTouch, this);
        this.wxGuideImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWxGuideTouch, this);
        this.interactGuideImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onInteractGuideTouch, this);
        

        App.EventManager.addEvent(EventConst.guide, this.guideBack, this);
        App.EventManager.addEvent(EventConst.UPDATE_RED_TIP, this.onUpdateRedTip, this);

        App.StageUtils.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.stageTouch, this);
        this.showParticle();
        this.changeBgImg();
        FloatTips.Instance(App.LayerManager.topLayer);

        // 测试特效用
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }

    /**全屏点击，主要用于测试 */
    private onTouch() {
        // Utils.goldFlutter(100);
        Utils.heartFlutter(100);
    }

    public onRemove() {
        
    }

    //点击菜单按钮
    private onMenuTouch(e:egret.TouchEvent){
        switch(e.target){
            case this.setBtn:         //设置
                // this.outAnimation(() => {
                //     this.ctrl.reqMail();
                // },this);
                this.ctrl.reqBgmList();
            break;
            case this.actBtn:         //活动
              this.outAnimation(() => {
                    this.ctrl.reqAct();
              },this);
            break;
            case this.rankBtn:        //排行
                this.outAnimation(() => {
                    this.ctrl.reqRank();
                },this);
            break;
            case this.shouChongBtn:   //收藏
            break;
            case this.interactBtn:    //互动
                this.outAnimation(() => {
                    this.ctrl.reqInteractAnsCost();
                },this);
            break;
            case this.telBtn:     //电话
                this.outAnimation(() => {
                    App.PanelManager.open(PanelConst.DianhuaPanel);
                },this);
            break;
            case this.wechatBtn:      //微信
                this.outAnimation(() => {
                    App.PanelManager.open(PanelConst.WeixinPanel);
                },this);
            break;
            case this.loveBtn:      //恋爱
                this.outAnimation(() => {
                    this.ctrl.reqLove();
                },this);
            break;  
            case this.workBtn:     //工作
                this.outAnimation(() => {
                    this.ctrl.reqWork();
                },this);
            break;
            case this.bagBtn:      //背包
                this.outAnimation(() => {
                    this.ctrl.reqBags();
                },this);
            break;
            case this.shopBtn:  //商城
                this.outAnimation(() => {
                    App.PanelManager.open(PanelConst.ShopPanel);
                },this);
            break;
            case this.collectionBtn:  //收藏
                this.outAnimation(() => {
                    this.ctrl.reqCollection();
                },this)
            break;
        }
    }

    /**配置底部按钮 */
    private setBottomBtn(list) {
        var allBtn = [];
        list.sort();//排下序
        for (let i = 0; i < list.length; i++) {
            switch (list[i]) {
                case 0:
                    break;
                case 1:
                    // this.dianhuaBtn = new MenuBtn();
                    // allBtn.push(this.dianhuaBtn);
                    break;
                case 2:
                    // this.weixinBtn = new MenuBtn();
                    // allBtn.push(this.weixinBtn);
                    break;
                case 3:
                    // this.lianaiBtn = new MenuBtn();
                    // allBtn.push(this.lianaiBtn);
                    break;
                case 4:
                    // this.gongzuoBtn = new MenuBtn();
                    // allBtn.push(this.gongzuoBtn);
                    break;
                case 5:
                    //微博
                    break;
                case 6:
                    // this.beibaoBtn = new MenuBtn();
                    // allBtn.push(this.beibaoBtn);
                    break;
                case 7:
                    // this.shangchengBtn = new MenuBtn();
                    // allBtn.push(this.shangchengBtn);
                    break;
                case 8:
                    //this.collectionBtn.visible = true;
                    break;

            }
        }

    }


    /**
     * 入场动画
     * @param guide 是否需要指引(用于第一次微信电话后，需要指引后才能请求升级，默认false)
     */
    public enterAnimation(guide:boolean = false) {
        //锁定屏幕
        App.LoadingLock.lockScreen();

        //更新个人资产
        this.updateAsset();

        //上部
        egret.Tween.get(this.topGroup).to({x:0,y:0},500);
        //左部
        egret.Tween.get(this.leftGroup).to({x:0,y:0},500);
        //下部
        egret.Tween.get(this.buttomGroup).to({x:0,y:0},500);
        //右部
        egret.Tween.get(this.rightGroup).to({x:0,y:0},500);
        

        /**背景模糊 */
        egret.Tween.get(this.mohuBG)
            .to({ alpha: 0 }, 500)
            .call(() => {
                egret.Tween.removeTweens(this.mohuBG);
                //新手引导、红点提示等...
                this.setActive();
                //显示升级指引
                if(guide){
                    this.showUpgradeGuide();
                }else{
                    //是否能升级
                    if (this.isUpgrade()) {
                        this.upGrade();
                    }
                }
                //解锁屏幕
                App.LoadingLock.unLockScreen();
            });

    }
    /**出场动画 */
    public outAnimation(cb: Function = null, thisObj:any = null) {
        //锁定屏幕
        App.LoadingLock.lockScreen();
         //上部
        egret.Tween.get(this.topGroup).set({x:0,y:0}).to({y:-this.topTween.height},500);
        //左部
        egret.Tween.get(this.leftGroup).set({x:0,y:0}).to({x:-this.leftGroup.width},500);
        //下部
        egret.Tween.get(this.buttomGroup).set({x:0,y:0}).to({y:App.StageUtils.stageHeight + this.buttomTween.height},500);
        //右部
        egret.Tween.get(this.rightGroup).set({x:0,y:0}).to({x:App.StageUtils.stageWidth + this.rightTween.width},500);

        /**背景模糊 */
        egret.Tween.get(this.mohuBG).set({ alpha: 0 })
            .to({ alpha: 1 }, 500)
            .call(() => {
                egret.Tween.removeTweens(this.mohuBG);
            });
        
        //回调
        egret.Tween.get(this).wait(500).call(()=>{
            if(cb && thisObj){
                cb.call(thisObj);
            }
             //解锁屏幕
             App.LoadingLock.unLockScreen();
         },this);
        
    }

    //显示升级指引
    private showUpgradeGuide(){
        //显示飞行的心形
        FlyHeart.getInstace().show(this.topMenu.heartUI.x, this.topMenu.heartUI.y, ()=>{
            //飞行结束，显示指引
            this.guideGroup.visible = true;
            this.upgradeGuideGroup.visible = true;
            egret.Tween.get(this.upgradeHand,{loop:true})
            .to({y:this.upgradeHand.y - 40},600)
            .to({y:this.upgradeHand.y},800).wait(100);
            //点击任意位置继续下一步
            App.StageUtils.stage.once(egret.TouchEvent.TOUCH_TAP, ()=>{
                 egret.Tween.removeTweens(this.upgradeHand);
                this.guideGroup.visible = false;
                this.upgradeGuideGroup.visible = false;
                //是否能升级
                if (this.isUpgrade()) {
                    this.upGrade();
                }
            },this);
        },this);
    }


    /**电话引导点击 */
    private onTelGuideTouch() {
        this.guideGroup.visible = false;
        this.telGuideGroup.visible = false;
        App.DataCenter.dianhuaGuide = true;//电话二级引导
        egret.Tween.removeTweens(this.telHand);
        GuideCircle.getInstacen().hide();

        App.SoundManager.playEffect(SoundManager.button);
        let gameScene = <GameScene>App.SceneManager.getScene(SceneConst.GameScene);
        gameScene.outAnimation(() => {
            App.PanelManager.open(PanelConst.DianhuaPanel);
        },this);
    }
    /**引发微信点击 */
    private onWxGuideTouch() {

        this.guideGroup.visible = false;
        this.wxGuideGroup.visible = false;
        App.DataCenter.weixinGuide = true;//电话二级引导
        egret.Tween.removeTweens(this.wxHand);
        GuideCircle.getInstacen().hide();

        App.SoundManager.playEffect(SoundManager.button);
        this.outAnimation(() => {
            App.PanelManager.open(PanelConst.WeixinPanel);
        },this);
    }

    /**恋爱引导 */
    private onLoveGuideTouch() {
        this.guideGroup.visible = false;
        this.loveGuideGroup.visible = false;
        App.DataCenter.loveGuide = true;//电话二级引导
        egret.Tween.removeTweens(this.loveHand);
        GuideCircle.getInstacen().hide();

        App.SoundManager.playEffect(SoundManager.button);
        this.outAnimation(() => {
            App.PanelManager.open(PanelConst.LovePanel);
        },this);
    }
    /**工作引导 */
    private onWorkGuideTouch() {
        this.guideGroup.visible = false;
        this.workGuideGroup.visible = false;
        App.DataCenter.workGuide = true;//电话二级引导
        egret.Tween.removeTweens(this.workHand);
        GuideCircle.getInstacen().hide();

        App.SoundManager.playEffect(SoundManager.button);
        this.outAnimation(() => {
            App.PanelManager.open(PanelConst.WorkPanel);
        },this)
    }

    /**视频引导 */
    private onColGuideTouch() {
        this.guideGroup.visible = false;
        this.colGuideGroup.visible = false;
        egret.Tween.removeTweens(this.colHand);
        GuideCircle.getInstacen().hide();

        this.outAnimation(() => {
            App.PanelManager.open(PanelConst.CollectionPanel);
        },this);
    }

    /**互动引导 */
    private onInteractGuideTouch(){
        this.guideGroup.visible = false;
        this.interactGuideGorup.visible = false;
        egret.Tween.removeTweens(this.interactHand);
        GuideCircle.getInstacen().hide();

        this.outAnimation(() => {
            App.PanelManager.open(PanelConst.InteractPanel);
        },this);
    }


    /**更新个人资产 */
    public updateAsset() {
        this.dayUI.setDay(App.DataCenter.UserInfo.days);
        this.topMenu.setAssetUI();
    }

    /**现阶段可操作选项 */
    public setActive() {

        //this.taskTipUI.visible = false;
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

        //电话显示红点
        if(App.DataCenter.UserInfo.tel_main){
            this.telBtn.showRedPoint(false);
        }else{
            this.telBtn.showRedPoint(true);
            //this.taskTipUI.visible = true;
            //this.taskTipUI.setTip("快给小野打个电话吧~");
        }

        //微信显示红点
        if(App.DataCenter.UserInfo.wechat_main == false && App.DataCenter.UserInfo.tel_main){
            this.wechatBtn.showRedPoint(true);
            //this.taskTipUI.visible = true;
            //this.taskTipUI.setTip("快给小野发个微信吧~");
        }else{
            this.wechatBtn.showRedPoint(false);
        }
  
        

        //更新红点提示
        this.onUpdateRedTip();
    }

    /**能否升级 */
    public isUpgrade() {
        let tel_event = App.DataCenter.UserInfo.tel_main;//电话主事件
        let wechat_event = App.DataCenter.UserInfo.wechat_main;//微信主事件
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
        let http = new HttpSender();
        http.post(ProtocolHttpUrl.prepare, {}, this.prepareBack, this);
    }

    /**能否升级返回 */
    private prepareBack(data) {
        if (data.code == 200) {
            let http = new HttpSender();
            http.post(ProtocolHttpUrl.upgrade, {}, this.upgradeBack, this);
        } else if(data.code == 911){
           //已经满级，游戏结束
           if(this.gameOverDialog == null){
               this.gameOverDialog = new GameOverDialog();
               this.gameOverDialog.show();
           }
        }else{
            Tips.info(data.info);
        }
    }

    /**升级返回 */
    private upgradeBack(data) {
        if(data.code == 200){
            App.DataCenter.readGameInfo(data);
            this.updateAsset();
            this.playUpgradeAnim();
            //更新红点提示
            App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);
        } else {
            Tips.info(data.info);
        }
    }

    //播放升级动画
    private playUpgradeAnim() {
        App.LoadingLock.lockScreen();
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
        App.LoadingLock.unLockScreen();
        var anim: UpgradeAnim = e.target;
        anim.destoryMe();

        this.sendPalyVideo();
    }

    //升级完成后，激活界面
    private upgradeActiveView(){
        //延迟执行，防止动画、视频、引导显示过于集中
        let t = setTimeout(() => {
            clearTimeout(t);
            App.LoadingLock.unLockScreen();
            App.LoadingLock.unlock();
            this.updateAsset();
            this.setActiveBtn();
            this.setBottomBtn(this.btnList);
            this.setGuide();
            this.setActive(); 
        }, 1000);
    }


    /**升级视频播放 */
    public sendPalyVideo() {
        let http = new HttpSender();
        let param = { vname: App.DataCenter.ConfigInfo.video };
        http.post(ProtocolHttpUrl.videoUrl, param, this.videoUrlBack, this);
    }

    /**请求视频Url */
    public videoUrlBack(data) {
        if (data.code == 200) {
            this.upgradeActiveView();

            //弹框提示播放视频
            let sureDialog:SureDialog = new SureDialog();
            sureDialog.setContent("快去找" + App.DataCenter.ConfigInfo.girl_name + "来一场美丽的邂逅吧。");
            sureDialog.setOk(()=>{
                App.NativeBridge.sendPlayVideo(VideoType.mem, data.data.url);
            },this);
            sureDialog.show();
             
        } else {
            Tips.info(data.info);
        }
    }

    /**
     * 主界面的引导
     */
    public setGuide() {
        let guide = App.DataCenter.guide;
        let type = guide.emph_zone;
        if (guide.video) {
            let http = new HttpSender();
            let param = { vname: guide.video };
            http.post(ProtocolHttpUrl.videoUrl, param, this.videoUrlBack, this);
            this.guideBack();
        }else if (guide.fill_nick_name) {
            App.PanelManager.open(PanelConst.InputNamePanel);
        }else if(type){
            
        }else{
            this.checkFirstLogin();
            //this.checkShouChong();
        }   
        

        switch (type) {
            case "ZONE_PHONE":
                //电话第一步指引，弹框提示
                let sureDialog:SureDialog = new SureDialog();
                sureDialog.setContent("那是我与女神的第一次见面，那种怦然心动，我永世难忘，为此我要来了她的电话号码。");
                sureDialog.show();
                sureDialog.setOk(()=>{
                    //电话第二步指引，手指指引
                    this.guideGroup.visible = true;
                    this.telGuideGroup.visible = true;
                    egret.Tween.get(this.telHand, { loop: true })
                    .to({y: this.telHand.y - 40 }, 600)
                    .to({y: this.telHand.y }, 800).wait(100);
                    GuideCircle.getInstacen().show(this.telGuideImg);
                },this);
                break;
            case "ZONE_WEIXIN":
                this.guideGroup.visible = true;
                this.wxGuideGroup.visible = true;
                //微信第一步指引，加好友提示
                this.wxGuideOne.visible = true;
                this.wxGuideOne.y = -this.wxGuideOne.height;
                egret.Tween.get(this.wxGuideOne).to({y:0},500).wait(2000).to({y:-this.wxGuideOne.height},500).call(()=>{
                    //微信第二步提示，手指指引
                    this.wxGuideOne.visible = false;
                    this.wxGuideTwo.visible = true;
                    egret.Tween.get(this.wxHand, { loop: true })
                    .to({ y:this.wxHand.y - 40 }, 600)
                    .to({ y:this.wxHand.y }, 800).wait(100);
                    GuideCircle.getInstacen().show(this.wxGuideImg);
                },this);
                break;
            case "ZONE_LOVE":
                this.guideGroup.visible = true;
                this.loveGuideGroup.visible = true;
                egret.Tween.get(this.loveHand, { loop: true })
                .to({y:this.loveHand.y - 40 }, 600)
                .to({y:this.loveHand.y}, 800).wait(100);
                GuideCircle.getInstacen().show(this.loveGuideImg);
                break;
            case "ZONE_WORK":
                this.guideGroup.visible = true;
                this.workGuideGroup.visible = true;
                egret.Tween.get(this.workHand, { loop: true })
                .to({ y:this.workHand.y-40 }, 600)
                .to({ y:this.workHand.y }, 800).wait(100);
                GuideCircle.getInstacen().show(this.workGuideImg);
                break;
            case "ZONE_VIDEO":
                this.guideGroup.visible = true;
                this.colGuideGroup.visible = true;
                egret.Tween.get(this.colHand, { loop: true })
                .to({ y: this.colHand.y- 40 }, 600)
                .to({ y: this.colHand.y }, 800).wait(100);
                GuideCircle.getInstacen().show(this.colGuideImg);
                break;
            case "ZONE_INTERACT":
                this.guideGroup.visible = true;
                this.interactGuideGorup.visible = true;
                egret.Tween.get(this.interactHand, { loop: true })
                .to({ y: this.interactHand.y- 40 }, 600)
                .to({ y: this.interactHand.y }, 800).wait(100);
                GuideCircle.getInstacen().show(this.interactGuideImg);
                break;

        }
    }

    /**引导视频结束 */
    private guideBack() {
        //非游戏场景，不处理该请求
        if(App.SceneManager.getCurScene() != this){
            return;
        }

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
            this.guideGroup.visible = false;
            App.DataCenter.dianhuaGuide = false;
            App.DataCenter.guide.fill_nick_name = data.data.fill_nick_name;
            App.DataCenter.guide.emph_zone = data.data.emph_zone;
            App.DataCenter.guide.video = data.data.video;
            this.setGuide();
        } else {
            Tips.info(data.info);
        }
    }

    /**设置解锁按钮 */
    private setActiveBtn() {
        this.btnList = [];
        let data = App.DataCenter.ConfigInfo.avilable_event;
        for (let i = 0; i < data.length; i++) {
            switch (data[i].type) {
                case "tel":
                    //this.btnList.push(1);
                    break;
                case "wechat":
                    // if (App.DataCenter.ConfigInfo.days != 1 || App.DataCenter.guide.emph_zone != "ZONE_PHONE") {
                    //     this.btnList.push(2);
                    // }
                    break;
                case "love":
                    //this.btnList.push(3);
                    break;
                case "work":
                    //this.btnList.push(4);
                    break;
                case "weibo":
                    //this.btnList.push(5);
                    break;
                case "back":
                    //this.btnList.push(6);
                    break;
                case "shop":
                    //this.btnList.push(7);
                    break;
                case "video":
                    //this.btnList.push(8);
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
        if(App.DataCenter.actInfo.login.status == 0 ||                  //每日登录奖励，有可领取
           App.DataCenter.actInfo.lottery.status == 0 ||                //抽奖，有可免费抽奖
           App.DataCenter.actInfo.fdouble_on == true ||                 //首冲双倍
           App.DataCenter.actInfo.fpay.status != SCGainStatus.HasGain   //首冲礼包
           ){
            this.actBtn.showRedPoint(true);
        }else{
            this.actBtn.showRedPoint(false);
        }

        //首冲按钮显示
        //this.checkShouChong();

        // 恋爱红点
        let loveList = App.DataCenter.Love.loveList;
        let loveRed:boolean = false;
        for (let i = 0;i < loveList.length;i ++) {
            if (loveList[i].wait == 0) {
                loveRed = true;
                break;
            }
        }
        this.loveBtn.showRedPoint(loveRed);

        // 工作红点
        let workList = App.DataCenter.Work.workList;
        let workRed:boolean = false;
        for (let i = 0;i < workList.length;i ++) {
            // 有可领取
            if (workList[i].wait == 0) {
                workRed = true;
                break;
            }
            // 有免费次数且不在进行中
            if (!(workList[i].duration > workList[i].wait && workList[i].wait != 0) && (workList[i].free_times > 0 && workList[i].post == WorkStatus.work)) {
                workRed = true;
                break;
            }
        }
        this.workBtn.showRedPoint(workRed);
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
    // private checkShouChong(){
    //     if(App.DataCenter.first_gift == false){
    //         this.shouChongBtn.visible = true;
    //         CommomBtn.btnClick(this.shouChongBtn, this.onShouChongTouch, this);
            
    //     }else{
    //         this.shouChongBtn.visible = false;
    //     }
    // }
    
    /**点击首冲礼包 */
    private onShouChongTouch(){
        this.ctrl.reqLoginReward(2);
    }

    /**检查是否首次登录(首次登录，自动打开活动中心)*/
    private checkFirstLogin(){
        //TODO 暂时屏蔽
        // if(App.DataCenter.is_first_login){
        //     App.DataCenter.is_first_login = false;
        //     this.outAnimation(()=>{
        //         this.ctrl.reqLoginReward();
        //     });
        // }
    }

    /**爱心粒子效果 */
    private showParticle() {
        let parSys = new particle.GravityParticleSystem(RES.getRes("newParticle_png"), RES.getRes("newParticle_json"));
        parSys.start();
        this.parGro.addChild(parSys);
    }

    /**切换背景图 */
    public changeBgImg() {
        if (App.DataCenter.UserInfo.bgi.length > 3) {
            this.gameBG && (this.gameBG.source = App.DataCenter.UserInfo.bgi+"_png");
            this.mohuBG && (this.mohuBG.source = App.DataCenter.UserInfo.bgi+"_mohu_png")
        }
        else {
            console.warn("背景图url有点怪怪的");
        }
    }
}