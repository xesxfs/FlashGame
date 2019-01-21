/**
 * 恋爱组件
 * @author xiongjian 
 * @date 2017/9/5
 */
class WorkBox extends BaseUI {

    public typeImg: eui.Image;
    public typeLabel: eui.Label;
    public cishuLabel: eui.Label;
    public jinyanLabel: eui.Label;
    public goldLabel: eui.Label;
    public jinyanGroup: eui.Group;
    public jindutiao: eui.Image;
    public jindutiaodi: eui.Image;
    public jinyantiaoLabel: eui.Label;
    public startBtn: eui.Button;
    public shenzhiBtn: eui.Button;
    public suoGroup: eui.Group;
    public suoBtn: eui.Button;
    public cdGroup: eui.Group;
    public cdTypeLabel: eui.Label;
    public timeLabel: eui.Label;
    public shenyutype: eui.Label;

    public type: number;

    private transData;//传递数据

    private timer: DateTimer;
    private waitTime: number;
    private cdTime = 0;

    public constructor() {
        super();
        this.skinName = "WorkBoxSkin"
    }

    /**组件创建完毕*/
    protected childrenCreated() {

    }

    /**添加到场景中*/
    protected onEnable() {
        CommomBtn.btnClick(this.startBtn,this.startBtnTouch,this,1);
        CommomBtn.btnClick(this.shenzhiBtn,this.shenzhiBtnTouch,this,1);
    }

    /**从场景中移除*/
    protected onRemove() {
        this.startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.startBtnTouch, this);
    }

    /**开始按钮点击 */
    private startBtnTouch() {
        console.log("type", this.type);
        let work = App.DataCenter.Work;
        switch (this.type) {
            case WorkBoxType.one:
                this.transData = work[0];
                this.sendHttp();
                break;
            case WorkBoxType.two:
                this.transData = work[1];
                this.sendHttp();
                break;
            case WorkBoxType.there:
                this.transData = work[2];
                this.sendHttp();
                break;
            case WorkBoxType.four:
                this.transData = work[3];
                this.sendHttp();
                break;
            case WorkBoxType.five:
                this.transData = work[4];
                this.sendHttp();
                break;
            case WorkBoxType.six:
                this.transData = work[5];
                this.sendHttp();
                break;
            case WorkBoxType.seven:
                this.transData = work[6];
                this.sendHttp();
                break;
            case WorkBoxType.eight:
                this.transData = work[7];
                this.sendHttp();
                break;
            case WorkBoxType.nine:
                this.transData = work[8];
                this.sendHttp();
                break;
            case WorkBoxType.ten:
                this.transData = work[9];
                this.sendHttp();
                break;
        }
    }

    /**升职按钮点击 */
    private shenzhiBtnTouch() {
        console.log("type", this.type);
        let work = App.DataCenter.Work;
        switch (this.type) {
            case WorkBoxType.one:
                this.transData = work[0];
                this.shengzhiHttp();
                break;
            case WorkBoxType.two:
                this.transData = work[1];
                this.shengzhiHttp();
                break;
            case WorkBoxType.there:
                this.transData = work[2];
                this.shengzhiHttp();
                break;
            case WorkBoxType.four:
                this.transData = work[3];
                this.shengzhiHttp();
                break;
            case WorkBoxType.five:
                this.transData = work[4];
                this.shengzhiHttp();
                break;
            case WorkBoxType.six:
                this.transData = work[5];
                this.shengzhiHttp();
                break;
            case WorkBoxType.seven:
                this.transData = work[6];
                this.shengzhiHttp();
                break;
            case WorkBoxType.eight:
                this.transData = work[7];
                this.shengzhiHttp();
                break;
            case WorkBoxType.nine:
                this.transData = work[8];
                this.shengzhiHttp();
                break;
            case WorkBoxType.ten:
                this.transData = work[9];
                this.shengzhiHttp();
                break;
        }
    }

    /**设置类型 */
    public setTypeText(str) {
        if (str && str != "") {
            this.typeLabel.text = str;
        }
    }


    /**显示cd */
    public showCD(bo: boolean) {
        if (bo) {
            this.cdGroup.visible = true;
        } else {
            this.cdGroup.visible = false;
        }

    }

    /**设置金币 */
    public setGoldText(num) {
        if (num != "") {
            this.goldLabel.text = num;
        }
    }

    /**设置剩余次数 */
    public setCishu(num) {

        this.cishuLabel.text = num;

    }

    /**显示锁 */
    public showSuo(bo: boolean) {
        if (bo) {
            this.suoGroup.visible = true;
        } else {
            this.suoGroup.visible = false;
        }
    }

    /**显示工作 */
    public showGongzuo(bo: boolean) {
        if (bo) {
            this.startBtn.visible = true;
        } else {
            this.startBtn.visible = false;
        }
    }

    /**显示升职 */
    public showShengzhi(bo: boolean) {
        if (bo) {
            this.shenzhiBtn.visible = true;
        } else {
            this.shenzhiBtn.visible = false;
        }
    }

    /**显示经验条 */
    public showJinyan(bo: boolean) {
        if (bo) {
            this.jinyanGroup.visible = true;
        } else {
            this.jinyanGroup.visible = false;
        }
    }

    /**
     * 设置经验值
     */
    public setEXP(a, b) {
        this.setJinyantiaoText(a, b);
        this.setJinyanJindu(a, b);
    }

    /**
     * 设置经验条值
     */
    public setJinyantiaoText(a, b) {
        if (b && b != "") {
            this.jinyantiaoLabel.text = a + "/" + b;
        }
    }

    /**
     * 设置经验条进度
     */
    public setJinyanJindu(num1, num2) {
        if (num2 && num2 != "") {
            if (num1 / num2 > 1) {
                this.jindutiao.width = this.jindutiaodi.width;
            } else {
                this.jindutiao.width = num1 / num2 * this.jindutiaodi.width;
            }

        }
    }

    /**设置获得经验值 */
    public setJinyanText(str) {
        if (str && str != "") {
            this.jinyanLabel.text = str;
        }
    }

    /**设置可工作次数 */
    public setWorkNum(num) {
        if (num && num != "") {
            this.cishuLabel.text = num;
        }
    }

    /**设置剩余工作类型 */
    public setShengyuType(bo: boolean) {
        if (bo) {
            this.shenyutype.text = "剩余次数：";
        } else {
            this.shenyutype.text = "工作次数：";
        }
    }

    /**设置时间 */
    public setTimeText(cd, wait) {
        if (wait == 0) {
            this.cdTime = cd;
            console.log("cd", cd);
            if (cd && cd != "") {
                if (cd < 60) {
                    this.timeLabel.text = cd + "分钟";
                }
                if (cd >= 60 && cd < 120) {
                    let s = cd - 60
                    if (s == 0) {
                        this.timeLabel.text = "1小时";
                    }
                    if (s > 0) {
                        this.timeLabel.text = "1小时" + s + "分钟";
                    }
                }
                if (cd >= 120 && cd < 180) {
                    let s = cd - 120
                    if (s == 0) {
                        this.timeLabel.text = "2小时";
                    }
                    if (s > 0) {
                        this.timeLabel.text = "2小时" + s + "分钟";
                    }
                }
            }
        } else {

            this.waitTime = wait;
            this.removeTimer();
            this.timer = new DateTimer(1000, wait);
            this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
            this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
            this.timer.start();

        }
    }

    /**设置等待时间 */
    public setWaitText(str) {
        if (str) {
            let fen = Math.floor(str / 60);//分钟
            let miao = Math.floor(str % 60);//秒
            let shi = Math.floor(str / 60 / 60);//时
            //秒
            if (fen < 1) {
                if (str < 10) {
                    this.timeLabel.text = "00:0" + str;
                } else {
                    this.timeLabel.text = "00:" + str;
                }

            }
            //分
            if (fen >= 1 && fen < 60) {
                if (miao < 10) {
                    this.timeLabel.text = fen + ":0" + miao;
                } else {
                    this.timeLabel.text = fen + ":" + miao;
                }

            }
            //时
            if (shi >= 1) {
                let time = str - shi * 3600;//分秒
                let f = Math.floor(time / 60);//分钟
                let m = Math.floor(time % 60);//秒
                if (f < 10) {
                    if (m < 10) {
                        this.timeLabel.text = shi + ":0" + f + ":0" + m;
                    } else {
                        this.timeLabel.text = shi + ":0" + f + ":" + m;
                    }

                } else {
                    if (m < 10) {
                        this.timeLabel.text = shi + ":" + f + ":0" + m;
                    } else {
                        this.timeLabel.text = shi + ":" + f + ":" + m;
                    }
                }

            }
        }
    }


    /**每秒倒计时 */
    private timerFunc() {
        this.waitTime--
        this.setWaitText(this.waitTime);
        if (this.waitTime <= 0) {
            this.removeTimer();
            if (this.transData) {
            this.cdTime = this.transData.cd;
            }
            console.log("cd", this.cdTime);
            this.setTimeText(this.cdTime, 0);
        }
    }

    /**倒计时结束 */
    private timerComFunc() {
        this.removeTimer();
        if (this.transData) {
            this.cdTime = this.transData.cd;
        }
        console.log("cd", this.cdTime);
        this.setTimeText(this.cdTime, 0);
    }

    /**清楚倒计时 */
    private removeTimer() {
        this.timer && this.timer.stop();
        this.timer && this.timer.reset();
        this.timer && this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer && this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
        this.timer = null;
    }

    /**设置图片 */
    public setImg(url) {
        if (url && url != "") {
            this.typeImg.source = url;
        }
    }

    /**设置类型 */
    public setType(num) {
        this.type = num;

    }

    /**发送开始请求 */
    public sendHttp() {
        let http = new HttpSender();
        let data = ProtocolHttp.workStart;
        data.wid = this.transData.id;
        http.post(ProtocolHttpUrl.workStart, data, this.sendBack, this);

    }

    /**请求返回 */
    private sendBack(data) {
        if (data.code == 200) {
            if (this.transData && this.transData.duration) {
                App.PanelManager.open(PanelConst.WorkProPanel, this.transData);
                let work = <WorkProPanel>App.PanelManager.getPanel(PanelConst.WorkProPanel);
                let count = 100;
                let delay = this.transData.duration * 1000 / 100;
                work.countDown(delay, count);
            } else {
                Tips.info("数据错误");
            }

        }
        if (data.code != 200) {
            Tips.info("" + data.info);
        }
        //809冷却中且未购买礼包,弹礼包
         if(data.code == 809 && !App.DataCenter.keybuy.wulengque.hasbuy){
             App.PanelManager.open(PanelConst.LibaoCDPanel);
         }

    }

    private shengzhiHttp() {
        let work = App.DataCenter.Work;
        if (work && work[0]) {
            // if (work[0].exps >= work[0].upgrade_exp) {
                let http = new HttpSender();
                let data = ProtocolHttp.workStart;
                data.wid = this.transData.id;
                http.post(ProtocolHttpUrl.workPromotion, data, this.shengzhiBack, this);
            // } else {
            //     Tips.info("经验值不足");
            // }
        }

    }

    private shengzhiBack(data) {
        console.log("shengzhi", data);
        if (data.code == 200) {
            App.DataCenter.Work = data.data;
            let panel = <WorkPanel>App.PanelManager.getPanel(PanelConst.WorkPanel);
            panel.addItem();
        } else {
            Tips.info("" + data.info);
        }

    }

    /**出场动画 */
    public outAnimation(finishCallback: Function = null) {

    }

    /**入场动画 */
    public enterAnimation() {

    }
}

enum WorkBoxType {
    one,
    two,
    there,
    four,
    five,
    six,
    seven,
    eight,
    nine,
    ten
}