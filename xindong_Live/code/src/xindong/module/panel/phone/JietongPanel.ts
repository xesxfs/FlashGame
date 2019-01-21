/**
 *电话接通面板
 * @author xiongjian
 * @date 2017/08/24
 */
class JietongPanel extends BasePanel {
    private telGuideGroup: eui.Group;   //引导
    private telGuideImg: eui.Image;
    private telHand: eui.Image;

    /**选择回答列表 */
    private selectList: MessageList;
    /**选择答案Group */
    private selectGroup: eui.Group;
    /**聊天数组集合 */
    private ac: eui.ArrayCollection;
    /**聊天显示List */
    public messageList: eui.List;
    /**上一条聊天记录 */
    private oldMsg;
    /**历史消息 */
    private history;
    /**下一步准备要发送的消息 */
    private nexttel: any[];
    /**当前说的话 */
    private msgType;

    /**昵称文本 */
    private girlName: eui.Label;
    /**挂断按钮 */
    private guaduanBtn: eui.Button;
    /**通话时间 */
    private timeLabel: eui.Label;
    /**消息滚动容器 */
    private msgScroller: eui.Scroller;
    /**头像遮罩 */
    private maskImg: eui.Image;
    /**头像 */
    private grilImg: eui.Image;

    /**拨号计时器*/
    private callTimer: egret.Timer = new egret.Timer(1000, 0);
    /**通话计时计数 */
    private count: number = 0;
    /**计时器ID */
    private timeID;//延时

    /**是否正在发送中。用于通话中退出界面再次进入时，如果处于发送中，则继续发送；不在发送中，则请求下一条*/
    private bSending: boolean = false;

    public topMenu: TopMenu;   //顶部菜单

    public constructor() {
        super();
        this.skinName = "JietongPanelSkin";
    }

    protected childrenCreated() {

    }

    public onEnable() {
        //停止背景音乐
        App.SoundManager.allowPlayBGM = false;
        App.SoundManager.stopBGM();

        //顶部菜单
        this.topMenu.setAssetUI();
        this.topMenu.showConfig(false, false, TopMenuTitle.Calling);

        //初始化头像和昵称
        if (App.DataCenter.telInfo) {
            this.grilImg.source = App.DataCenter.telInfo.head;
        }
        this.girlName.text = App.DataCenter.ConfigInfo.girl_name;

        //隐藏选项框
        this.hideSelect();

        //初始化通话记录
        this.initHistory();

        //开始通话计时
        this.startOverTimer();

        //未在发送中，则发送
        if (this.bSending == false) {
            this.dealRevMsg(App.DataCenter.telInfo.nexttel);
        } else {
            //发送中，则不处理
        }

        //按钮监听
        CommomBtn.btnClick(this.guaduanBtn, this.guanduanTouch, this, 1);
    }
    public onRemove() {
        clearTimeout(this.timeID);
        CommomBtn.removeClick(this.guaduanBtn, this.guanduanTouch, this);
        App.TalkManager.stopSound();
        this.stopOverTimer();
    }

    /**初始化通话记录 */
    private initHistory() {
        this.ac = new eui.ArrayCollection();
        this.messageList.dataProvider = this.ac;
        this.messageList.itemRenderer = MessageListItem;
        this.messageList.useVirtualLayout = false;

        //获取历史记录
        this.ac.source = App.DataCenter.telInfo.getLastHistoryCopy();
        this.setScolltoEnd();

        console.log("JietongPanel >> 历史通话记录:", App.DataCenter.telInfo.getLastHistoryCopy());
    }


    /**处理接收到的数据，女主数据播放声音，男主数据则显示选择框 */
    private dealRevMsg(nexttel: Array<TelNextVo>) {
        //没有消息，则不处理
        if (nexttel == null) {
            return;
        }

        //消息只有一条，表示女主说话
        if (nexttel.length == 1) {
            //显示说的话
            this.addMsg(nexttel[0]);

            //不再通话界面时，不播放声音
            let url = nexttel[0].audio;
            //TODO 测试语音
            url = "resource/assets/main/test/talk.mp3";
            if (this.parent) {
                App.TalkManager.playSound(url, this.onSoundComplete, this.onError, this);
            }
            //消息>=1条，表示我说话
        } else {
            //引导，当时第一条对话时，显示引导
            if (App.DataCenter.telInfo.isFirstTel()) {
                this.showGuide();
            }

            this.showSelect(nexttel);
        }
    }

    //显示引导
    private showGuide() {
        this.telGuideGroup.visible = true;
        egret.Tween.get(this.telHand, { loop: true })
            .to({ y: this.telHand.y - 40 }, 600)
            .to({ y: this.telHand.y }, 800)
            .wait(100);
        GuideCircle.getInstacen().show(this.telGuideImg);
        this.telGuideImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTelGuideTouch, this);
    }

    //点击指引，固定选中第二项
    private onTelGuideTouch() {
        GuideCircle.getInstacen().hide();
        this.hideGuide();
        this.hideSelect();
        this.selectHandler(MessageSelectEnum.two);
    }

    //隐藏引导
    private hideGuide() {
        this.telGuideImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTelGuideTouch, this);
        this.telGuideGroup.visible = false;
        egret.Tween.removeTweens(this.telHand);
    }

    /**选择回答后的处理 */
    private selectHandler(select: MessageSelectEnum) {
        //隐藏选择
        this.hideSelect();

        //选项在规定范围内
        if (select >= MessageSelectEnum.one && select <= MessageSelectEnum.four) {
            //发送的数据存在
            let nexttel: Array<TelHistVO> = App.DataCenter.telInfo.nexttel;
            if (nexttel[select] && nexttel[select].content) {
                this.addMsg(nexttel[select]);

                //发送我说的话
                this.sendMessageTouch(nexttel[select]);
            }
        }
    }

    /**添加消息 */
    private addMsg(telNextVO: TelNextVo) {

        //相同数据不添加
        let hist: Array<TelHistVO> = App.DataCenter.telInfo.history[0].hist;
        for (let i = 0; i < hist.length; i++) {
            if (hist[i].id == telNextVO.id) {
                return;
            }
        }

        //添加到历史通话
        App.DataCenter.telInfo.addLastHistory(telNextVO);

        //添加聊天到数据源
        this.ac.addItem(telNextVO);

        this.setScolltoEnd(true);
        App.SoundManager.playEffect(SoundManager.sent_msg);
    }

    /**设置scroll到末尾 */
    private setScolltoEnd(bUseTween: boolean = false) {
        clearTimeout(this.timeID);
        this.timeID = setTimeout(() => {
            if (this.msgScroller.viewport.contentHeight > this.msgScroller.height) {
                let scrollV = this.msgScroller.viewport.contentHeight - this.msgScroller.height;
                if (bUseTween) {
                    egret.Tween.get(this.msgScroller.viewport).to({ scrollV }, 200);
                }
                this.msgScroller.viewport.scrollV = scrollV;
            }

        }, 100);

    }

    /**发送点击点击 */
    private sendMessageTouch(msg: TelHistVO) {
        this.bSending = true;
        let http = new HttpSender();
        let data = ProtocolHttp.chat;
        data.id = msg.id;
        http.post(ProtocolHttpUrl.telFinish, data, this.sendMsgBack, this);
    }


    /**发送消息返回 */
    private sendMsgBack(data) {
        if (data.code == 200) {
            App.LoadingLock.lockScreen();
            //TODO 这里可以设置回答延迟，减少等待时间
            egret.Tween.get(this).wait(1000).call(() => {
                App.LoadingLock.unLockScreen();
                //有回复
                if (data.data.tel.length >= 1) {
                    App.DataCenter.telInfo.nexttel = data.data.tel;
                    this.dealRevMsg(data.data.tel);
                    this.bSending = false;
                    //没有回复
                } else {
                    App.DataCenter.telInfo.nexttel = [];
                    App.DataCenter.UserInfo.tel_main = true;//主事件完成
                    App.DataCenter.UserInfo.nextTel = false;

                    //请求结算
                    this.reqTelScore();

                }
            }, this);
        } else {
            this.bSending = false;
            Tips.info(data.info);
        }
    }

    /**请求结算分数 */
    private reqTelScore() {
        let http: HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.telScore, {}, this.revTelScore, this);
    }

    /**返回结算分数 */
    private revTelScore(data) {
        if (data.code == 200) {
            //保存获得的总心动值
            let hearts: number = data.data.hearts;
            App.DataCenter.UserInfo.hearts += hearts;
            Utils.heartFlutter(hearts);
            this.topMenu.setAssetUI();

            //弹出结算框
            let dialog: SureDialog = new SureDialog();

            //如果是指引，则完成指引
            if (App.DataCenter.dianhuaGuide) {
                dialog.setTelScore(hearts, this.reqGuideFinish, this);
            } else {
                dialog.setTelScore(hearts, this.getNewTel, this);
            }

            dialog.show();
        } else {
            Tips.info(data.info);
            this.bSending = false;
        }
    }

    /**请求引导完成 */
    private reqGuideFinish() {
        let http = new HttpSender();
        let param = {};
        http.post(ProtocolHttpUrl.guideDone, param, this.finishGuideBack, this);
    }

    /**引导完成返回 */
    private finishGuideBack(data) {
        if (data.code == 200) {
            this.telGuideGroup.visible = false;
            egret.Tween.removeTweens(this.telHand);
            App.DataCenter.dianhuaGuide = false;
            App.DataCenter.guide.fill_nick_name = data.data.fill_nick_name;
            App.DataCenter.guide.emph_zone = data.data.emph_zone;
            App.DataCenter.guide.video = data.data.video;

            //获取新的电话历史
            this.getNewTel();
        } else {
            Tips.info(data.info);
        }
    }

    /**获取新的电话历史 */
    private getNewTel() {
        let http = new HttpSender();
        let data = {};
        http.post(ProtocolHttpUrl.userChats, data, this.getTelBack, this);
    }

    /**获取电话历史返回 */
    private getTelBack(data) {
        if (data.code == 200) {
            //更新微信
            let wechat = data.data.wechat;
            if (wechat) {
                App.DataCenter.Wechat = wechat;
            }
            //更新电话
            let tel = data.data.tel
            if (tel) {
                App.DataCenter.telInfo.readData(tel);
            }

            //等待2s后，自动挂断
            egret.Tween.get(this.guaduanBtn).wait(2000).call(() => {
                this.guanduanTouch();
            }, this);

        } else {
            Tips.info(data.info);
            this.bSending = false;
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
        this.timeLabel.text = StringTool.formatClock(this.count);
        this.count++
    }

    /**挂断按钮点击 */
    private guanduanTouch() {
        //移除监听
        egret.Tween.removeTweens(this.guaduanBtn);
        clearTimeout(this.timeID);
        //重置界面
        this.timeLabel.text = "00:00";
        this.hideSelect();
        this.bSending = false;
        //继续播放音乐
        App.SoundManager.allowPlayBGM = true;
        App.SoundManager.playBGM(SoundManager.bgm);
        App.TalkManager.stopSound();
        //跳转界面
        this.hide();
        var gamescene = App.SceneManager.getScene(SceneConst.GameScene) as GameScene;
        gamescene.enterAnimation();

    }

    /**加载失败 */
    private onError() {
        Tips.info("声音加载失败，请检查您的网络后重试");
    }

    /*播放完成监听 */
    private onSoundComplete(event: egret.Event): void {
        egret.log("onSoundComplete");
        this.sendMessageTouch(App.DataCenter.telInfo.nexttel[0]);
    }


    /**显示回答列表 */
    private showSelect(nexttel: Array<TelNextVo>) {
        this.selectGroup.visible = true;
        this.selectList.showMsg(nexttel);
        this.selectList.setOK(this.selectHandler, this);
    }

    /**隐藏回答列表 */
    private hideSelect() {
        this.selectGroup.visible = false;
    }
}