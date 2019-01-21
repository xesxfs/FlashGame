/**
 *电话接通面板
 * @author xiongjian
 * @date 2017/08/24
 */
class JietongPanel extends BasePanel {

    public girlName: eui.Label;
    public guaduanBtn: eui.Button;
    public avater: eui.Image;
    public timeLabel: eui.Label;
    // public msgGroup: eui.Group;
    public msgScroller: eui.Scroller;
    public heartPlugin: HeartsPlugins;
    public maskImg: eui.Image;
    public grilImg: eui.Image;


    public messageList: eui.List;

    private arr = []; //list数据
    /**list 控制器 */
    private ac: eui.ArrayCollection;

    /**历史消息 */
    private history: any[];

    public channel: egret.SoundChannel;//声道

    private timeout;//延时

    private count: number = 0;

    private nexttel: any[];
    private chatLen = 0;//字数

    private msgType;

    private dialogList: any[] = [];//dialog数组

    private oldMsg;//旧消息
    private addmsg;//要添加的消息

    //创建 Sound 对象
    private sound:egret.Sound;

    /**拨号计时器*/
    private callTimer: egret.Timer = new egret.Timer(1000, 0);

    /**延时 */
    public addTimeout;
    private timeout2;

    /**是否正在发送中。用于通话中退出界面再次进入时，如果处于发送中，则继续发送；不在发送中，则请求下一跳*/
    private bSending: boolean = false;

    public constructor() {
        super();
        this.skinName = "JietongPanelSkin";
    }

    protected childrenCreated() {

    }

    public onEnable() {
        App.SoundManager.stopBGM();
        this.grilImg.mask = this.maskImg;
        if (App.DataCenter.Tel) {
            this.grilImg.source = App.DataCenter.Tel.head;
        }
        // this.setData();
        this.init();
        this.setScolltoEnd();
        this.setConfig();
        // this.guaduanBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.guanduanTouch, this);
        CommomBtn.btnClick(this.guaduanBtn, this.guanduanTouch, this, 1);
        this.girlName.text = App.DataCenter.ConfigInfo.girl_name;
        this.startOverTimer();

        if (this.bSending) {
            this.sendMessageTouch();
        } else {
            this.setNextMsg(this.nexttel);
        }
    }
    public onRemove() {
        clearTimeout(this.timeout);
        clearTimeout(this.timeout2);
        CommomBtn.removeClick(this.guaduanBtn, this.guanduanTouch, this);
        this.sound && this.sound.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.sound && this.sound.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onError,this);
        this.channel && this.channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
        this.channel && this.channel.stop();
        this.stopOverTimer();
    }


    private init() {

        this.ac = new eui.ArrayCollection();
        this.arr = [];
        var data = this.setData();
        this.arr = data;
        this.ac.source = this.arr;
        this.messageList.dataProvider = this.ac;
        this.messageList.itemRenderer = MessageListItem;
        this.messageList.useVirtualLayout = false;
        this.girlName.text = App.DataCenter.ConfigInfo.girl_name;
    }

    /**数据处理 */
    private setData() {

        let tel = App.DataCenter.Tel;
        let replyId = 0;
        let arr = []
        console.log("tel", tel);
        let history = tel.history;


        //拿最后一条电话历史
        let json = ProtocolHttpData.wechat
        json = history[0];

        for (let k = 0; k < json.dialog.length; k++) {
            let obj = new Object();
            let dialog = ProtocolHttpData.dialog;
            dialog = json.dialog[k];
            obj["msg"] = dialog;
            console.log("dialog", dialog);
            arr.push(obj);
        }


        let nexttel = tel.nexttel;
        this.nexttel = nexttel;



        console.log("nexttel", this.nexttel);
        console.log("arr", arr);
        this.history = arr;
        // //有一条重复数据
        // if (tel.nexttel.length == 1 && tel.nexttel[0].pid == 0 && tel.history[0].start_id == 0) {
        //     console.log("进jjjj");

        //     arr = [];
        //     this.history = [];
        // }
        return arr;
    }

    /**处理下条数据 */
    private setNextMsg(msg) {
        console.log("JietongPanel >> 发送下一条数据:", msg);

        if (msg && msg.length == 1) {

            if (msg != this.oldMsg) {
                let obj = new Object();
                obj["msg"] = msg[0];
                console.log("obj", obj, "history", this.history);


                this.addMsg(obj);




            }
            this.oldMsg = msg;

            let url = msg[0].audio;
            this.msgType = msg[0];
            if (App.DeviceUtils.IsNative) {
                this.soundPlay(url);
            } else {
                this.soundPlay(url);
                //this.soundPlay("resource/assets/xindong/music/2.mp3");
            }

        }
        if (msg && msg.length == 2) {
            console.log("nexttel", this.nexttel);
            let messageList = App.MessageListManager.getBoxA();
            messageList.showMsg(this, this.nexttel, 0, 0, false);
           messageList.setOK(this.okCallBack,this);
        }
        if (msg && msg.length == 3) {

            let messageList = App.MessageListManager.getBoxB();
            messageList.showMsg(this, this.nexttel, 0, 0, false);
            messageList.setOK(this.okCallBack,this);
        }
        if (msg && msg.length == 4) {

            console.log("nexttel", this.nexttel);
            let messageList = App.MessageListManager.getBoxC();
            messageList.showMsg(this, this.nexttel,  0, 0, false);
            messageList.setOK(this.okCallBack,this);
        }

    }

    private okCallBack(msglistName){
         this.msgListTouch(msglistName);
    }

    /**msglist 点击返回 */
    private msgListTouch(msglistName: MessageListName) {
        switch (msglistName) {
            case MessageListName.one:
                console.log("1");
                App.MessageListManager.recycleAllBox();
                this.msgType = this.nexttel[0];
                let obj = new Object();
                obj["msg"] = this.nexttel[0]
                this.addmsg = obj;
                this.addMsg(obj);

                this.sendMessageTouch();
                break;
            case MessageListName.two:
                App.MessageListManager.recycleAllBox();
                console.log("2");
                this.msgType = this.nexttel[1];
                let obj1 = new Object();
                obj1["msg"] = this.nexttel[1]
                this.addmsg = obj1;
                this.addMsg(obj1);
                this.sendMessageTouch();
                break;
            case MessageListName.there:
                App.MessageListManager.recycleAllBox();
                console.log("3");
                this.msgType = this.nexttel[2];
                let obj2 = new Object();
                obj2["msg"] = this.nexttel[2]
                this.addmsg = obj2;
                this.addMsg(obj2);
                this.sendMessageTouch();
                break;
            case MessageListName.four:
                App.MessageListManager.recycleAllBox();
                console.log("4");
                this.msgType = this.nexttel[3];
                let obj3 = new Object();
                obj3["msg"] = this.nexttel[3]
                this.addmsg = obj3;
                this.addMsg(obj3);
                this.sendMessageTouch();
                break;
        }
    }

    /**添加消息 */
    private addMsg(msg) {
        let tel = App.DataCenter.Tel;
        //重复数据不添加
        if (tel.nexttel.length == 1 && tel.history[0].dialog.length == 0) {
            console.log("不添加");
        }else {
            console.log("没进判");
            console.log("next",tel.nexttel,"dialog",tel.history[0].dialog);
            console.log(tel.nexttel.length,tel.history[0].dialog.length,tel.nexttel[0].pid, tel.history[0].dialog[tel.history[0].dialog.length-1].reply)
            if(tel.nexttel.length == 1 && tel.history[0].dialog.length > 0 && tel.nexttel[0].pid ==  tel.history[0].dialog[tel.history[0].dialog.length-1].reply){
                 console.log("不添加2");
            }else{
                this.history.push(msg);
            }
            
        }
        if (App.DataCenter.Tel && App.DataCenter.Tel.history && App.DataCenter.Tel.history.length > 0) {

            let len = App.DataCenter.Tel.history.length;
            App.DataCenter.Tel.history[0].dialog.push(msg["msg"]);
            console.log("history", App.DataCenter.Tel.history);


        }
        let data = this.history;
        console.log("refresh", data);
        if (msg.msg && msg.msg.says) {
            this.chatLen = msg.msg.says.length;
        } else {
            this.chatLen = 0;
        }

        this.arr = data;
        //this.ac.source = this.arr;
        this.ac.addItem(msg);
        this.setScolltoEnd(true);
        App.SoundManager.playEffect(SoundManager.sent_msg);
    }

    /**设置scroll到末尾 */
    private setScolltoEnd(bUseTween: boolean = false) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            if (this.msgScroller.viewport.contentHeight > this.msgScroller.height) {
                let count = Math.floor(this.chatLen / 11);
                let scrollV = this.msgScroller.viewport.contentHeight - this.msgScroller.height + count * 30;
                if (bUseTween) {
                    egret.Tween.get(this.msgScroller.viewport).to({ scrollV }, 200);
                }
                this.msgScroller.viewport.scrollV = scrollV;
            }

        }, 100);

    }

    /**发送点击点击 */
    private sendMessageTouch() {
        console.log("JietongPanel >> 是否发送中:", this.bSending);
        console.log(this.msgType);
        this.bSending = true;
        this.timeout = setTimeout(() => {
            if (this.msgType && this.msgType.id) {
                let http = new HttpSender();
                let data = ProtocolHttp.chat;
                data.id = this.msgType.id;
                data.pid = this.msgType.pid;
                data.sid = this.msgType.sid;
                http.post(ProtocolHttpUrl.chat, data, this.sendMsgBack, this);
            }
        }, 1000);
    }

    /**发送消息返回 */
    private sendMsgBack(data) {
        this.bSending = false;
        console.log(data);
        if (data.code == 200) {
            // this.addMsg(this.addmsg);
            let msg = this.msgType;
            this.nexttel = data.data.chat;
            this.dialogList.push(msg);
            this.setNextMsg(this.nexttel);
            let heart = data.data.hearts;
            if (heart != 0 && data.data.chat.length == 1) {

                TipsHeat.showHeat(heart);
                let userheart = App.DataCenter.UserInfo.hearts
                App.DataCenter.UserInfo.hearts = userheart + heart;
                App.DataCenter.Tel.nexttel = data.data.chat;
                console.log("hearts", App.DataCenter.UserInfo.hearts);
                this.setConfig();
            }


            if (data.data.chat.length == 0) {
                App.DataCenter.Tel.nexttel = [];
                App.DataCenter.UserInfo.tel_main = true;//主事件完成
                App.DataCenter.UserInfo.nextTel = false;
                //获取新的tel
                this.getNewTel();

            }
        }
    }

    /**获取新的电话历史 */
    private getNewTel() {
        let http = new HttpSender();
        let data = {}
        http.post(ProtocolHttpUrl.userChats, data, this.getTelBack, this);
    }

    /**获取电话历史返回 */
    private getTelBack(data) {
        console.log(data);
        if (data.code == 200) {
            let wechat = data.data.wechat;
            let tel = data.data.tel
            if (tel) {
                App.DataCenter.Tel = tel;
            }
            if (wechat) {
                App.DataCenter.Wechat = wechat;
            }
            this.hide();
            App.SoundManager.playBGM(SoundManager.bgm);
            clearTimeout(this.timeout);
            App.PanelManager.open(PanelConst.DianhuaPanel, App.DataCenter.UserInfo.tel_main);
        }

    }

    //开始超时计时
    private startOverTimer() {
        this.callTimer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.callTimer.reset();
        this.callTimer.start();
    }

    //停止超时计时
    private stopOverTimer() {
        this.count = 0;
        this.callTimer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.callTimer.reset();
        this.callTimer.stop();
    }

    /**每秒监听 */
    private onTimer() {
        // console.log("count",this.count);
        if (this.count < 60) {
            if (this.count < 10) {
                this.timeLabel.text = "00:0" + this.count
            } else {
                this.timeLabel.text = "00:" + this.count
            }

        }
        if (this.count >= 60) {
            let fen = Math.floor(this.count / 60);//分钟
            let miao = Math.floor(this.count % 60);//秒
            if (fen < 10) {
                if (miao < 10) {
                    this.timeLabel.text = "0" + fen + ":0" + miao
                } else {
                    this.timeLabel.text = "0" + fen + ":" + miao
                }
            }
            if (fen >= 10 && fen < 60) {
                if (miao < 10) {
                    this.timeLabel.text = fen + ":0" + miao
                } else {
                    this.timeLabel.text = fen + ":" + miao
                }
            }
            if (fen == 0) {
                if (miao < 10) {
                    this.timeLabel.text = "00:0" + miao
                } else {
                    this.timeLabel.text = "00:" + miao
                }
            }

        }
        this.count++
    }

    /**挂断按钮点击 */
    private guanduanTouch() {
        App.SoundManager.playBGM(SoundManager.bgm);
        App.MessageListManager.recycleAllBox();
        this.hide();
        App.PanelManager.open(PanelConst.DianhuaPanel);
        clearTimeout(this.timeout);
        this.timeLabel.text = "00:00";
    }

    /**暂停 */
    private pause() {

    }

    /**播放 */
    private play() {

    }

    /**播放语音 */
    private soundPlay(url) {
        //相同的sound在多次重复加载后，可能会出现加载不成功的情况
        this.sound = new egret.Sound();
        this.sound.type = egret.Sound.EFFECT;
        //添加加载完成侦听
        this.sound.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.sound.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onError,this);
        //开始加载
        this.sound.load(url);
    }

    /**加载失败 */
    private onError(){
        console.log("JietongPanel >> 声音加载错误");
        Tips.info("声音加载失败，请检查您的网络后重试");
    }

    //完成监听
    private onLoadComplete(event: egret.Event): void {
        console.log("声音加载完成");
        //获取加载到的 Sound 对象
        this.sound = <egret.Sound>event.target;

        if(this.channel){
            this.channel && this.channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
            this.channel && this.channel.stop();
        }

        //播放音乐
        this.channel = this.sound.play(0, 1);
        this.channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
    }

    /*播放完成监听 */
    private onSoundComplete(event: egret.Event): void {
        egret.log("onSoundComplete");
        this.sendMessageTouch();
        
    }

    /**出场动画 */
    public outAnimation(finishCallback: Function = null) {

    }

    /**入场动画 */
    public enterAnimation() {

    }

    /**配置数值 */
    public setConfig() {
        this.setXinText(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts);
    }

    /**设置爱心 */
    public setXinText(str, h) {
        if (h && h != "") {
            this.heartPlugin.setJindu(str, h);
        }
    }
}