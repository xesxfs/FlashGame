/**
 * 微信面板
 * @author xiongjian
 * @date 2017/08/24
 */
class WeixinPanel extends BasePanel {

    private backBtn: eui.Button;
    private chatLen = 0;//字数

    public messageScroller: eui.Scroller;
    public messageList: eui.List;
    public sendMessage: SendMessage;  //发送消息控件
    public grilImg: eui.Image;
    public maskImg:eui.Image;

    public grilname: eui.Label;
    public showGold = false;//是否显示金币回复

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

    /** 发送消息实体 */
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

    /**新手指引手指初始位置 */
    private handY:number;
    /**是否需要弹礼包 在金币不足时弹一次*/
    private bOpenLiBao:boolean = true;

    private constructor() {
        super();
        this.skinName = "WeixinPanelSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {
        this.handY = this.weixinHand.y;
    }

    /**添加到场景中*/
    public onEnable() {
        this.bOpenLiBao = true;
        

        this.grilImg.mask = this.maskImg;
        if (App.DataCenter.Wechat) {
            this.grilImg.source = App.DataCenter.Wechat.head;
        }

        this.init();

        if (App.DataCenter.UserInfo.tel_main) {
            if(this.isWaitingReply == false){
                this.sendnext();
            }
        } else {
            this.sendMessage.showInput(false);
        }

        this.setScolltoEnd();
        this.setConfig();
        this.openLibao();
    
        this.sendMessage.send.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendMessageTouch, this);
        this.sendMessage.labelGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.labelTouch, this);
        this.sendMessage.goldGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goldTouch, this);
        this.yd_weixinImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.yd_weixinImgTouch, this);
        this.ydsend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ydsendTouch, this);
        this.goldGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goldGroupTouch, this);

        CommomBtn.btnClick(this.backBtn, this.backTouch, this, 2);

        App.EventManager.addEvent(EventConst.UPDATE_SIWEI,this.updateSiwei,this);
        App.EventManager.addEvent(EventConst.UPDATE_LIBAO,this.updateSiwei,this);

    }

    /**从场景中移除*/
    public onRemove() {
        this.sendMessage.send.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.sendMessageTouch, this);
        this.sendMessage.labelGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.labelTouch, this);
        this.sendMessage.goldGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goldTouch, this);
        this.yd_weixinImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.yd_weixinImgTouch, this);
        this.ydsend.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.ydsendTouch, this);
        this.goldGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goldGroupTouch, this);

        CommomBtn.removeClick(this.backBtn, this.backTouch, this);

        this.stopBackBtnAnim();
    }

    /**更新四维 */
    private updateSiwei(){
        this.setConfig();
    }

    /**微信引导点击 */
    private yd_weixinImgTouch() {
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
                let messageList = App.MessageListManager.getBoxA();
                messageList.showMsg(this, this.sendMsg, this.sendMessage.x, this.sendMessage.y);
                messageList.setOK(this.okCallBack, this);
            }
            if (this.sendMsg.length == 3) {
                this.sendMessage.showInput(false);
                let messageList = App.MessageListManager.getBoxB();
                messageList.showMsg(this, this.sendMsg, this.sendMessage.x, this.sendMessage.y);
                messageList.setOK(this.okCallBack, this);
            }
        } else {
            Tips.info("" + data.info);
        }
    }

    private okCallBack(msglistName){
        this.msgListTouch(msglistName);
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
        this.sendMessage.msgLabel.text = "";
        App.MessageListManager.recycleAllBox();
        this.sendMessage.showInput(true);
    }

    /**金币Group点击 */
    private goldGroupTouch() {
        App.PanelManager.open(PanelConst.ShopPanel, 1);
        let shop = <ShopPanel>App.PanelManager.getPanel(PanelConst.ShopPanel);
        shop.isBack = true;
    }

    /**出场动画 */
    public outAnimation(finishCallback: Function = null) {

    }

    /**入场动画 */
    public enterAnimation() {

    }

    private init() {
        this.ac = new eui.ArrayCollection();
        var data = this.setData();
        this.messageList.useVirtualLayout = false;  //关闭虚拟布局，防止item项高度不一致时抖动
        this.messageList.dataProvider = this.ac;
        this.messageList.itemRenderer = MessageListItem;
        this.grilname.text = App.DataCenter.ConfigInfo.girl_name;
        this.setGuide();

        this.addHistoryChat();

        this.messageScroller.addEventListener(eui.UIEvent.CHANGE_END, this.msgScrollChangeEnd, this);
    }

    //聊天信息滚动改变结束
    private msgScrollChangeEnd() {
        if (this.messageScroller.viewport.scrollV <= 200) {
            this.addHistoryChat();
        }
    }

    /**一次增加10条历史聊天记录到List组件中 防止一次性添加卡顿*/
    private addHistoryChat() {
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


    /**数据处理 */
    private setData() {
        let wechat = App.DataCenter.Wechat;
        let replyId = 0;
        let arr = []

        let history = wechat.history;

        for (let i = 0; i < history.length; i++) {
            let json = ProtocolHttpData.wechat
            json = history[i];

            for (let k = 0; k < json.dialog.length; k++) {
                let obj = new Object();
                let dialog = ProtocolHttpData.dialog;
                dialog = json.dialog[k];
                obj["msg"] = dialog;
                arr.push(obj);
            }
        }

        let nextwechat = wechat.nextwechat;

        //等待回复时，不重置数据
        if(this.isWaitingReply == false){
            this.sendMsg = nextwechat;
        }
        this.history = arr;
        return arr;
    }

    /**如果第一条是服务器回话，请求下一段话 */
    private sendnext() {
        console.log("sendnext:", this.sendMsg, this.sendMsg.length);
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
            http.post(ProtocolHttpUrl.chat, data, this.sendnextBack, this);
        }

        if (this.sendMsg.length > 1) {
            if (!this.showGold) {
                this.sendMessage.showGold(false);
                this.sendMessage.showInput(true);
            } else {
                this.sendMessage.showGold(true);
                this.sendMessage.showInput(true);
            }

        }

        if (this.sendMsg.length == 0) {
            this.sendMessage.showInput(false);
        }
    }

    /**发送下一段话返回 */
    private sendnextBack(data) {
        this.showGold = false;
        console.log("sendnextBack:", data);
        if (data.code == 200) {
            this.sendMessage.showGold(false);
            if (data.data.chat && data.data.chat.length > 0) {
                //先刷新再赋值
                let msg = this.sendMsg[0];
                let obj = new Object();
                obj["msg"] = msg;
                this.refresh(obj);
                this.sendMsg = data.data.chat;
                App.DataCenter.Wechat.nextwechat = data.data.chat;
                App.DataCenter.UserInfo.nextWechat = true;
                this.sendMessage.setGoldText(data.data.chat[0].instant_gold);

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

                //增加返回提示
                this.playBackBtnAnim();
            }

        }

    }

    /**发送按钮点击 */
    private sendMessageTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        if (this.msgType && this.msgType.id && this.bSending == false) {
            this.bSending = true;
            let http = new HttpSender();
            let data = ProtocolHttp.chat;
            data.id = this.msgType.id;
            data.pid = this.msgType.pid;
            data.sid = this.msgType.sid;
            data.instant = 0;
            http.post(ProtocolHttpUrl.chat, data, this.sendMsgBack, this);
        } else {
            Tips.info("点击左侧输入框，选择回复内容");
        }

    }

    /**发送消息返回 */
    private sendMsgBack(data) {
        this.showGold = false;
        console.log("sendMsgBack:", data);
        if (data.code == 200) {
            // App.SoundManager.playEffect(SoundManager.sent_msg);
            this.sendMessage.setText(" ");

            //刷新界面
            let msg = this.msgType;
            let obj = new Object();
            obj["msg"] = msg;
            this.refresh(obj);

            //心动值
            let heart = data.data.hearts;
            if (heart != 0 && data.data.chat.length == 1) {
                TipsHeat.showHeat(heart);
                let userheart = App.DataCenter.UserInfo.hearts
                App.DataCenter.UserInfo.hearts = userheart + heart;
                this.setConfig();
                this.sendMessage.setGoldText(data.data.chat[0].instant_gold);
            }
            //等待下一条回复
            let waitMsg = data.data.chat;
            this.waitnextmsg = data.data.chat;

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
        let wait = msg.wait;
        console.log("waitMsg:", msg, wait);
        if (wait == 0) {
            let timeout = setTimeout(() => {
                clearTimeout(timeout);
                this.sendMessage.showGold(false);
                this.sendnext();
            }, 1000);
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
        if (this.sendMsg.length == 2) {
            this.sendMessage.showInput(false);
            let messageList = App.MessageListManager.getBoxA();
            messageList.showMsg(this, this.sendMsg, this.sendMessage.x, this.sendMessage.y);
            messageList.setOK(this.okCallBack, this);
        }
        if (this.sendMsg.length == 3) {
            this.sendMessage.showInput(false);
            let messageList = App.MessageListManager.getBoxB();
            messageList.showMsg(this, this.sendMsg,  this.sendMessage.x, this.sendMessage.y);
            messageList.setOK(this.okCallBack, this);
        }

    }

    /**msglist 点击返回 */
    private msgListTouch(msglistName: MessageListName) {
        console.log("msgListTouch:", msglistName);
        this.bSending = false;
        switch (msglistName) {
            case MessageListName.one:
                App.MessageListManager.recycleAllBox();
                this.sendMessage.showInput(true);
                this.sendMessage.msgLabel.text = this.sendMsg[0].says;
                this.msgType = this.sendMsg[0];
                break;
            case MessageListName.two:
                App.MessageListManager.recycleAllBox();
                this.sendMessage.showInput(true);
                this.sendMessage.msgLabel.text = this.sendMsg[1].says;
                this.msgType = this.sendMsg[1];
                break;
            case MessageListName.there:
                App.MessageListManager.recycleAllBox();
                this.sendMessage.showInput(true);
                this.sendMessage.msgLabel.text = this.sendMsg[2].says;
                this.msgType = this.sendMsg[2];
                break;
            case MessageListName.bage:
                App.MessageListManager.recycleAllBox();
                this.sendMessage.showInput(true);
                break;
        }
    }

    /**刷新数据 */
    private refresh(msg) {
        this.history.push(msg);
        if (App.DataCenter.Wechat && App.DataCenter.Wechat.history && App.DataCenter.Wechat.history.length > 0) {
            let len = App.DataCenter.Wechat.history.length;
            App.DataCenter.Wechat.history[len - 1].dialog.push(msg["msg"]);
        }
        let data = this.history;
        if (msg.msg && msg.msg.says) {
            this.chatLen = msg.msg.says.length;
        } else {
            this.chatLen = 0;
        }
        this.ac.addItem(msg);
        this.setScolltoEnd1();

        App.SoundManager.playEffect(SoundManager.sent_msg);
    }

    /**设置scroll到末尾 */
    private setScolltoEnd() {
        clearTimeout(this.timeout);
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
        this.waitTime--
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
        http.post(ProtocolHttpUrl.chat, data, this.goldTouchBack, this);
    }
    
    /**金币立即回复返回 */
    private goldTouchBack(data) {
        this.showGold = false;
        this.sendMessage.goldGroup.touchEnabled = true;
        
        if (data.code == 200) {
            console.log("goldTouchBack:", data);
            this.sendMessage.showGold(false);
            App.DataCenter.UserInfo.gold = data.data.gold;
            this.setGoldText(App.DataCenter.UserInfo.gold);
            if (data.data.chat && data.data.chat.length > 0) {
                //先刷新再赋值
                let msg = this.sendMsg[0];
                let obj = new Object();
                obj["msg"] = msg;
                this.refresh(obj);
                this.sendMsg = data.data.chat;

                this.removeTimer();
                
                App.DataCenter.Wechat.nextwechat = data.data.chat;
                App.DataCenter.UserInfo.nextWechat = true;

            } else {
                //先刷新再赋值
                let msg = this.sendMsg[0];
                let obj = new Object();
                obj["msg"] = msg;
                this.refresh(obj);
                this.sendMsg = data.data.chat;

                this.removeTimer();

                App.DataCenter.UserInfo.nextWechat = false;
                App.DataCenter.Wechat.nextwechat = [];
                this.sendMessage.showInput(false);
                App.DataCenter.UserInfo.wechat_main = true;//主事件完成

                //增加返回提示
                this.playBackBtnAnim();
            }

        } else {
            //金币不足，弹出礼包提示，且只弹一次
            if(data.code == 809 && App.DataCenter.keybuy.miaohui.hasbuy == false && this.bOpenLiBao == true){
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
            .set({ y: this.handY })
            .to({  y: this.handY -40 }, 600)
            .to({  y: this.handY }, 800)
            .wait(100);
        }
    }

    /**弹礼包面板 */
    public openLibao() {
        //随机生成一个一到四的数
        let num = Math.floor(Math.random() * App.DataCenter.UserInfo.randNum) + 1
        if (num == 1 && !App.DataCenter.keybuy.miaohui.hasbuy && App.DataCenter.guide.emph_zone !="ZONE_WEIXIN") {
            App.PanelManager.open(PanelConst.LibaomiaohuiPanel);
        }
    }

    /**是否在等待女主回复 */
    private get isWaitingReply(){
        return (this.timer != null);
    }

    private playBackBtnAnim(){
        egret.Tween.get(this.backBtn,{loop:true}).to({scaleX:1.15,scaleY:1.15},500).to({scaleX:1,scaleY:1},500);
    }

    private stopBackBtnAnim(){
        this.backBtn.scaleX = 1;
        this.backBtn.scaleY = 1;
        egret.Tween.removeTweens(this.backBtn);
    }

}