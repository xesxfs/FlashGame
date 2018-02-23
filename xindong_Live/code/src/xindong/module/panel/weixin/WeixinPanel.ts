/**
 * 微信面板
 * @author xiongjian
 * @date 2017/08/24
 */
class WeixinPanel extends BasePanel {
    /**回答选择 */
    private selectList: MessageList;
    /**选择背景 用于点击关闭*/
    private selectBg: eui.Rect;
    /**回答选择容器 */
    private selectGroup: eui.Group;

    /**返回按钮 */
    private closeBtn: eui.Button;
    private chatLen = 0;//字数

    public messageScroller: eui.Scroller;
    public messageList: eui.List;
    public sendMessage: SendMessage;  //发送消息控件
    public grilImg: eui.Image;
    public maskImg: eui.Image;

    public grilname: eui.Label;
    /**是否显示金币回复 */
    public showGold = false;

    public heartPlugin: HeartsPlugins;
    public goldGroup: eui.Group;

    public goldLabel: eui.Label;

    /**是否正在发送消息中 */
    public bSending: boolean = false;

    /**引导 */
    public yindaoGroup: eui.Group;
    public yd_weixinImg: eui.Image;
    public weixinHand: eui.Image;
    public ydsend: eui.Button;
    private waitnextmsg //等待下一条消息

    //private arr = []; //list数据
    /**list 控制器 */
    private ac: eui.ArrayCollection;

    /**历史消息 */
    private history: any[];

    /** 发送消息实体 当前要发送的数据wechat.nextwechat */
    private sendMsg = [];
    /**要发送的消息 */
    private msgType;
    /**应答id */
    private reply;
    /**开始id */
    private start_id;
    /**延时 */
    private timeout;
    private timeout2;

    private timer: egret.Timer;
    private waitTime: number;

    /**是否需要弹礼包 在金币不足时弹一次*/
    private bOpenLiBao: boolean = true;

    //========= 第二版 ===========
    public topMenu: TopMenu;    //顶部菜单

    private constructor() {
        super();
        this.skinName = "WeixinPanelSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {

    }

    /**添加到场景中*/
    public onEnable() {
        //顶部菜单
        this.topMenu.setAssetUI();
        this.topMenu.showConfig(false, false, TopMenuTitle.Wechat);

        //初始化滚动容器
        this.ac = new eui.ArrayCollection();
        this.messageList.useVirtualLayout = false;  //关闭虚拟布局，防止item项高度不一致时抖动
        this.messageList.dataProvider = this.ac;
        this.messageList.itemRenderer = WechatMessageList;

        //初始化女主名字和头像
        this.grilname.text = App.DataCenter.ConfigInfo.girl_name;
        this.grilImg.source = App.DataCenter.Wechat.head;

        //重置打开礼包标志位
        this.bOpenLiBao = true;
        this.openLibao();

        //隐藏回答列表框
        this.hideSelect();

        //屏蔽引导
        this.setGuide();

        //显示历史数据
        this.getHistoryArr();
        this.addHistoryChat();
        this.setScolltoEnd();

        //显示数值
        this.setConfig();

        //电话主事件完成，才能继续
        console.log("WeixinPanel >> 是否等待回复:", this.isWaitingReply);
        if (App.DataCenter.UserInfo.tel_main) {
            if (this.isWaitingReply == false) {
                this.sendnext();
            }
            //电话主事件未完成，什么也不做
        } else {
            this.sendMessage.showInput(false);
        }

        CommomBtn.btnClick(this.sendMessage.send, this.sendMessageTouch, this);
        // this.sendMessage.send.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendMessageTouch, this);
        this.sendMessage.labelGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.labelTouch, this);
        this.sendMessage.goldGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goldTouch, this);
        this.yd_weixinImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.yd_weixinImgTouch, this);
        //this.ydsend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ydsendTouch, this);
        //this.goldGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goldGroupTouch, this);
        this.messageScroller.addEventListener(eui.UIEvent.CHANGE_END, this.msgScrollChangeEnd, this);

        CommomBtn.btnClick(this.closeBtn, this.backTouch, this, 2);

        App.EventManager.addEvent(EventConst.UPDATE_SIWEI, this.updateSiwei, this);
        App.EventManager.addEvent(EventConst.UPDATE_LIBAO, this.updateSiwei, this);
    }

    /**从场景中移除*/
    public onRemove() {
        this.sendMessage.send.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.sendMessageTouch, this);
        this.sendMessage.labelGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.labelTouch, this);
        this.sendMessage.goldGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goldTouch, this);
        this.yd_weixinImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.yd_weixinImgTouch, this);
        //this.ydsend.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.ydsendTouch, this);
        //this.goldGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goldGroupTouch, this);
        this.messageScroller.removeEventListener(eui.UIEvent.CHANGE_END, this.msgScrollChangeEnd, this);

        CommomBtn.removeClick(this.closeBtn, this.backTouch, this);

        this.stopBackBtnAnim();
    }

    /**更新四维 */
    private updateSiwei() {
        this.setConfig();
    }

    /**微信引导点击 */
    private yd_weixinImgTouch() {
        GuideCircle.getInstacen().hide();
        let http = new HttpSender();
        let param = {};
        http.post(ProtocolHttpUrl.guideDone, param, this.finishGuideBack, this);

    }

    /**引导完成返回 */
    private finishGuideBack(data) {
        if (data.code == 200) {
            this.yindaoGroup.visible = false;
            egret.Tween.removeTweens(this.weixinHand);
            App.DataCenter.weixinGuide = false;
            App.DataCenter.guide.fill_nick_name = data.data.fill_nick_name;
            App.DataCenter.guide.emph_zone = data.data.emph_zone;
            App.DataCenter.guide.video = data.data.video;

            if (this.sendMsg.length == 2) {
                this.sendMessage.showInput(false);
                this.showSelect(this.sendMsg);
            }
            if (this.sendMsg.length == 3) {
                this.sendMessage.showInput(false);
                this.showSelect(this.sendMsg);
            }
        } else {
            Tips.info(data.info);
        }
    }

    /**引导发送 */
    private ydsendTouch() {
        this.sendMessageTouch();
    }

    /**退出 */
    private backTouch() {
        this.hide();
        var gamescene = App.SceneManager.getScene(SceneConst.GameScene) as GameScene;
        gamescene.enterAnimation();
        this.sendMessage.setText("");
        this.hideSelect();
        this.sendMessage.showInput(true);
    }

    /**点击结算框的退出 */
    private onResultBack() {
        this.hide();
        this.sendMessage.setText("");
        this.hideSelect();
        this.sendMessage.showInput(true);

        //如果当前是微信指引，则返回大厅时，需要显示升级指引
        if (App.DataCenter.telInfo.isFirstWx()) {
            var gamescene = App.SceneManager.getScene(SceneConst.GameScene) as GameScene;
            gamescene.enterAnimation(true);
        } else {
            var gamescene = App.SceneManager.getScene(SceneConst.GameScene) as GameScene;
            gamescene.enterAnimation();
        }
    }

    /**金币Group点击 */
    private goldGroupTouch() {
        App.PanelManager.open(PanelConst.ShopPanel, ShopPage.Gold);
        let shop = <ShopPanel>App.PanelManager.getPanel(PanelConst.ShopPanel);
    }

    //聊天信息滚动改变结束
    private msgScrollChangeEnd() {
        if (this.messageScroller.viewport.scrollV <= 200) {
            this.addHistoryChat();
        }
    }

    /**一次增加10条历史聊天记录到List组件中 防止一次性添加卡顿*/
    private addHistoryChat() {
        console.log("==============添加聊天数据");
        let curChatNum = this.messageList.dataProvider.length;
        let totalChatNum = this.history.length;
        //当前还有聊天记录未加入到list中时，选择10条加入list中
        if (curChatNum < totalChatNum) {
            let lastContentHeight = this.messageScroller.viewport.contentHeight;
            let curIndex = totalChatNum - curChatNum;
            let startIndex = curIndex - 10;
            startIndex = (startIndex < 0) ? 0 : startIndex;
            let chatData = this.history.slice(startIndex, curIndex);
            let chatLen = chatData.length;
            for (let i = chatLen - 1; i >= 0; i--) {
                this.ac.addItemAt(chatData[i], 0);
            }
            this.messageScroller.viewport.validateNow();
            this.messageScroller.viewport.scrollV = this.messageScroller.viewport.contentHeight - lastContentHeight;
        }
    }


    /**获取历史数据 */
    private getHistoryArr() {
        let wechat = App.DataCenter.Wechat;
        let arr = []
        let history = wechat.history;

        for (let i = 0; i < history.length; i++) {
            let obj = new Object();
            obj["msg"] = history[i];
            arr.push(obj);
        }

        //等待回复时，不重置数据
        if (this.isWaitingReply == false) {
            this.sendMsg = wechat.nextwechat;
        }

        this.history = arr;
        return arr;
    }

    /**如果第一条是服务器回话，请求下一段话 */
    private sendnext() {
        console.log("WeixinPanel >> 决定请求下一句还是出现选择框:", this.sendMsg);

        //当前女主回话，现在去请求男主的3个回答
        if (this.sendMsg.length == 1) {
            let msg = this.sendMsg[0];

            if (msg.reply == -1) {
                this.sendMessage.showInput(false);
                return;
            }
            this.bSending = true;
            let http = new HttpSender();
            let data = ProtocolHttp.chat;
            data.id = msg.id;
            data.pid = msg.pid;
            data.sid = msg.sid;
            data.instant = 0;
            http.post(ProtocolHttpUrl.wechatFinish, data, this.sendnextBack, this);
        }
        //显示我要选择的回答
        else if (this.sendMsg.length > 1) {
            if (!this.showGold) {
                this.sendMessage.showGold(false);
                this.sendMessage.showInput(true);
            } else {
                this.sendMessage.showGold(true);
                this.sendMessage.showInput(true);
            }
        }
        //没有聊天
        else if (this.sendMsg.length == 0) {
            this.sendMessage.showInput(false);
        }
    }

    /**发送下一段话返回 */
    private sendnextBack(data) {
        console.log("WeixinPanel >> 请求下一句返回:", data);
        this.showGold = false;
        if (data.code == 200) {
            this.sendMessage.showGold(false);
            //有回复，则等待用户点击发送栏
            if (data.data.wechat && data.data.wechat.length > 0) {
                //先刷新再赋值
                let msg = this.sendMsg[0];
                let obj = new Object();
                obj["msg"] = msg;
                this.refresh(obj);
                this.sendMsg = data.data.wechat;
                App.DataCenter.Wechat.nextwechat = data.data.wechat;
                App.DataCenter.UserInfo.nextWechat = true;
                this.sendMessage.setGoldText(data.data.wechat[0].cons);
                //无回复，表示对话结束
            } else {
                //先刷新再赋值
                let msg = this.sendMsg[0];
                let obj = new Object();
                obj["msg"] = msg;
                this.refresh(obj);
                App.DataCenter.UserInfo.nextWechat = false;
                App.DataCenter.Wechat.nextwechat = [];
                this.sendMessage.showInput(false);
                App.DataCenter.UserInfo.wechat_main = true;//主事件完成

                //请求结算
                this.reqWechatScore();
            }

        }
    }

    //请求微信结算
    private reqWechatScore() {
        let http: HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.wechatScore, {}, this.revWechatScore, this);
    }

    //返回微信结算
    private revWechatScore(data) {
        if (data.code == 200) {
            //保存心动值
            let heart: number = data.data.hearts;
            App.DataCenter.UserInfo.hearts += heart;
            Utils.heartFlutter(heart);
            //延迟3s后，防止最后一句话看不清
            App.LoadingLock.lock();
            egret.Tween.get(this).wait(3000).call(() => {
                App.LoadingLock.unlock();
                let sureDialog: SureDialog = new SureDialog();
                sureDialog.setWechatScore(heart, this.onResultBack, this);
                sureDialog.show();
            }, this);
        } else {
            Tips.info(data.info);
        }
    }


    /**发送按钮点击 */
    private sendMessageTouch() {
        console.log("WeixinPanel >> 点击发送我说的话:", this.msgType, this.bSending);
        App.SoundManager.playEffect(SoundManager.button);
        if (this.msgType && this.msgType.id && this.bSending == false) {
            this.bSending = true;
            let http = new HttpSender();
            let data = ProtocolHttp.chat;
            data.id = this.msgType.id;
            data.pid = this.msgType.pid;
            data.sid = this.msgType.sid;
            data.instant = 0;
            http.post(ProtocolHttpUrl.wechatFinish, data, this.sendMsgBack, this);
        } else {
            Tips.info("点击左侧输入框，选择回复内容");
        }

    }

    /**发送消息返回 */
    private sendMsgBack(data) {
        console.log("WeixinPanel >> 发送我的话的返回数据:", data.data.wechat);
        this.showGold = false;
        if (data.code == 200) {
            //重置输入文本
            this.sendMessage.setText(" ");

            //保存聊天记录，并显示聊天到界面上
            let obj = new Object();
            obj["msg"] = this.msgType;
            this.refresh(obj);

            this.setConfig();
            this.sendMessage.setGoldText(data.data.wechat[0].cons);

            //等待下一条回复
            let waitMsg = data.data.wechat;
            this.waitnextmsg = data.data.wechat;

            if (waitMsg && waitMsg.length == 1) {
                this.sendMsg = waitMsg;
                this.waitMsg(waitMsg[0]);
            }
            if (waitMsg.length == 0) {
                this.sendMsg = [];
                this.sendMessage.showInput(false);
            }


        }
    }

    /**等待下一条回复 */
    private waitMsg(msg) {
        let wait = App.DataCenter.UserInfo.wc_wait;
        //TODO 测试
        wait = 1;

        //秒回
        if (wait == 0) {
            let timeout = setTimeout(() => {
                clearTimeout(timeout);
                this.sendMessage.showGold(false);
                this.sendnext();
            }, 1000);
            //非秒回，设置计时器等待
        } else {
            this.sendMessage.showGold(true);
            this.waitTime = wait;
            this.removeTimer();
            this.timer = new egret.Timer(1000, wait);
            this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
            this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
            this.timer.start();
        }
    }


    /**输入框文本点击 */
    private labelTouch(e: TouchEvent) {
        console.log("labelTouch:", this.sendMsg, this.sendMsg.length);
        if (this.sendMsg.length >= 2) {
            this.sendMessage.showInput(false);
            this.showSelect(this.sendMsg);
        }
    }

    /**msglist 点击返回 */
    private selectHandler(select: MessageSelectEnum) {
        console.log("msgListTouch:", select);
        this.bSending = false;

        this.hideSelect();
        this.sendMessage.showInput(true);
        this.sendMessage.setText(this.sendMsg[select].content);
        this.msgType = this.sendMsg[select];
    }

    /**保存历史聊天，并添加聊天到界面上 */
    private refresh(msg) {
        //保存历史聊天
        this.history.push(msg);
        if (App.DataCenter.Wechat && App.DataCenter.Wechat.history) {
            App.DataCenter.Wechat.history.push(msg["msg"]);
        }

        //计算聊天文字长度
        if (msg.msg && msg.msg.content) {
            this.chatLen = msg.msg.content.length;
        } else {
            this.chatLen = 0;
        }

        //添加聊天到界面上
        this.ac.addItem(msg);
        this.setScolltoEnd1();
        App.SoundManager.playEffect(SoundManager.sent_msg);
    }

    /**设置scroll到末尾 */
    private setScolltoEnd(bUseTween: boolean = true) {
        clearTimeout(this.timeout);
        this.messageScroller.validateNow();
        this.timeout = setTimeout(() => {
            if (this.messageScroller.viewport.contentHeight > this.messageScroller.height) {
                this.messageScroller.viewport.scrollV = this.messageScroller.viewport.contentHeight - this.messageScroller.height;
            }

        }, 100);
    }

    /**刷新调到末尾 */
    private setScolltoEnd1() {
        clearTimeout(this.timeout2);
        this.timeout2 = setTimeout(() => {
            if (this.messageScroller.viewport.contentHeight > this.messageScroller.height) {
                let count = Math.floor(this.chatLen / 11);
                let scrollV = this.messageScroller.viewport.contentHeight - this.messageScroller.height + count * 30;
                egret.Tween.get(this.messageScroller.viewport).to({ scrollV }, 200);
            }

        }, 50);

    }

    /**每秒倒计时 */
    private timerFunc() {
        this.waitTime--;
        console.log("-------------", this.waitTime)
        this.showGold = true;
    }

    /**倒计时结束 */
    private timerComFunc() {
        this.showGold = false;
        this.sendnext();
        this.removeTimer();

    }

    /**清楚倒计时 */
    private removeTimer() {
        this.timer && this.timer.stop();
        this.timer && this.timer.reset();
        this.timer && this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer && this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
        this.timer = null;
    }

    /**配置数值 */
    public setConfig() {
        this.topMenu.setAssetUI();
    }

    /**金币立即回复点击 */
    private goldTouch() {
        console.log("goldTouch");
        this.bSending = true;

        this.sendMessage.goldGroup.touchEnabled = false;

        let http = new HttpSender();
        let data = ProtocolHttp.chat;
        data.id = this.waitnextmsg[0].id;
        data.pid = this.waitnextmsg[0].pid;
        data.sid = this.waitnextmsg[0].sid;
        data.instant = 1;
        http.post(ProtocolHttpUrl.wechatFinish, data, this.goldTouchBack, this);
    }

    /**金币立即回复返回 */
    private goldTouchBack(data) {
        this.showGold = false;
        this.sendMessage.goldGroup.touchEnabled = true;

        if (data.code == 200) {
            console.log("goldTouchBack:", data);
            this.sendMessage.showGold(false);
            App.DataCenter.UserInfo.gold = data.data.gold;
            this.setConfig();
            if (data.data.wechat && data.data.wechat.length > 0) {
                //先刷新再赋值
                let msg = this.sendMsg[0];
                let obj = new Object();
                obj["msg"] = msg;
                this.refresh(obj);
                this.sendMsg = data.data.wechat;

                this.removeTimer();

                App.DataCenter.Wechat.nextwechat = data.data.wechat;
                App.DataCenter.UserInfo.nextWechat = true;

            } else {
                //先刷新再赋值
                let msg = this.sendMsg[0];
                let obj = new Object();
                obj["msg"] = msg;
                this.refresh(obj);
                this.sendMsg = data.data.wechat;

                this.removeTimer();

                App.DataCenter.UserInfo.nextWechat = false;
                App.DataCenter.Wechat.nextwechat = [];
                this.sendMessage.showInput(false);
                App.DataCenter.UserInfo.wechat_main = true;//主事件完成

                //请求结算
                this.reqWechatScore();
            }

        } else {
            //金币不足，弹出礼包提示，且只弹一次
            if (data.code == 809 && App.DataCenter.keybuy.miaohui.hasbuy == false && this.bOpenLiBao == true) {
                this.bOpenLiBao = false;
                App.PanelManager.open(PanelConst.LibaomiaohuiPanel);
            }
            Tips.info(data.info);
        }
    }

    /**引导 */
    public setGuide() {
        if (App.DataCenter.weixinGuide) {
            this.yindaoGroup.visible = true;
            egret.Tween.get(this.weixinHand, { loop: true })
                .to({ y: this.weixinHand.y - 40 }, 600)
                .to({ y: this.weixinHand.y }, 800)
                .wait(100);
            GuideCircle.getInstacen().show(this.yd_weixinImg);
        }
    }

    /**弹礼包面板 */
    public openLibao() {
        //随机生成一个一到四的数
        let num = Math.floor(Math.random() * App.DataCenter.UserInfo.randNum) + 1
        if (num == 1 && !App.DataCenter.keybuy.miaohui.hasbuy && App.DataCenter.guide.emph_zone != "ZONE_WEIXIN") {
            App.PanelManager.open(PanelConst.LibaomiaohuiPanel);
        }
    }

    /**是否在等待女主回复 */
    private get isWaitingReply() {
        return (this.timer != null);
    }

    private playBackBtnAnim() {
        egret.Tween.get(this.closeBtn, { loop: true }).to({ scaleX: 1.1, scaleY: 1.1 }, 500).to({ scaleX: 1, scaleY: 1 }, 500);
    }

    private stopBackBtnAnim() {
        this.closeBtn.scaleX = 1;
        this.closeBtn.scaleY = 1;
        egret.Tween.removeTweens(this.closeBtn);
    }

    /**显示回答列表 */
    private showSelect(msg) {
        this.selectGroup.visible = true;
        this.selectBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.lookChat, this);
        this.selectList.showMsg(msg);
        this.selectList.setOK(this.selectHandler, this);
    }

    /**隐藏回答列表 */
    private hideSelect() {
        this.selectGroup.visible = false;
    }

    /**关闭选择框，并查看聊天 */
    private lookChat() {
        this.hideSelect();
        if (!this.showGold) {
            this.sendMessage.showGold(false);
            this.sendMessage.showInput(true);
        } else {
            this.sendMessage.showGold(true);
            this.sendMessage.showInput(true);
        }
    }
}