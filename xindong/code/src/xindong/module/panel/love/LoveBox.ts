/**
 * 恋爱组件
 * @author xiongjian 
 * @date 2017/9/5
 */
class LoveBox extends BaseUI {

    public typeImg: eui.Image;
    public timeLabel: eui.Label;
    public typeLabel: eui.Label;
    public tiliLabel: eui.Label;
    public daojuLabel: eui.Label;
    public kaifangLabel: eui.Label;
    public kaifangGroup: eui.Group;
    public startBtn: eui.Button;

    public xinLabel: eui.Label;
    public cdGroup: eui.Group;
    public daojuGroup: eui.Group;

    public type: number;

    private transData;//传递数据

    private timer: DateTimer;
    private waitTime: number;
    private cdTime = 0;

    public constructor() {
        super();
        this.skinName = "LoveBoxSkin"
    }

    /**组件创建完毕*/
    protected childrenCreated() {

    }

    /**添加到场景中*/
    protected onEnable() {
        CommomBtn.btnClick(this.startBtn,this.startBtnTouch,this,1);
    }

    /**从场景中移除*/
    protected onRemove() {
        CommomBtn.removeClick(this.startBtn,this.startBtnTouch,this);
    }

    /**开始按钮点击 */
    private startBtnTouch() {
        console.log("type", this.type);
        let love = App.DataCenter.Love;
        switch (this.type) {
            case LoveBoxType.one:
                this.transData = love[0];
                this.sendHttp();
                break;
            case LoveBoxType.two:
                this.transData = love[1];
                this.sendHttp();
                break;
            case LoveBoxType.there:
                this.transData = love[2];
                this.sendHttp();
                break;
            case LoveBoxType.four:
                this.transData = love[3];
                this.sendHttp();
                break;
            case LoveBoxType.five:
                this.transData = love[4];
                this.sendHttp();
                break;
            case LoveBoxType.six:
                this.transData = love[5];
                this.sendHttp();
                break;
            case LoveBoxType.seven:
                this.transData = love[6];
                this.sendHttp();
                break;
            case LoveBoxType.eight:
                this.transData = love[7];
                this.sendHttp();
                break;
            case LoveBoxType.nine:
                this.transData = love[8];
                this.sendHttp();
                break;
            case LoveBoxType.ten:
                this.transData = love[9];
                this.sendHttp();
                break;
        }
    }

    /**是否显示按钮 */
    public showBtn(boo: boolean) {
        if (boo) {
            this.startBtn.visible = true;
            this.kaifangGroup.visible = false;
        } else {
            this.startBtn.visible = false;
            this.kaifangGroup.visible = true;
        }
    }

    /**设置开放天数 */
    public setKaifangText(num) {
        if (num != "") {
            this.kaifangLabel.text = "游戏内时间第" + num + "天开放";
        }

    }

    /**设置类型 */
    public setTypeText(str) {
        if (str != "") {
            this.typeLabel.text = str;
        }
    }

    /**设置体力 */
    public setTiliText(num) {
        if (num != "") {
            this.tiliLabel.text = num;
        }

    }

    /**设置道具 */
    public setDaojuText(str) {
        if (str != "") {
            this.daojuLabel.text = str;
        }

    }

    /**道具显示 */
    public showDaoju(bo: boolean) {
        if (bo) {
            this.daojuGroup.visible = true;
        } else {
            this.daojuGroup.visible = false;
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

    /**设置心 */
    public setXinText(num) {
        if (num && num != "") {
            this.xinLabel.text = num;
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
        let data = ProtocolHttp.loveStart;
        data.lid = this.transData.lid;
        http.post(ProtocolHttpUrl.loveStart, data, this.sendBack, this);

    }

    /**请求返回 */
    private sendBack(data) {
        if (data.code == 200) {
            if (this.transData && this.transData.duration) {
                App.PanelManager.open(PanelConst.LoveProPanel, this.transData);
                let love = <LoveProPanel>App.PanelManager.getPanel(PanelConst.LoveProPanel);
                let count = 100;
                let delay = this.transData.duration* 1000 / 100;
                love.countDown(delay, count);
            } else {
                Tips.info("数据错误");
            }
        //811提示请购买   812道具不足
        }else if(data.code == 811 || data.code == 812){
            this.askBuyLoveTool();
        }else{
            Tips.info("" + data.info);
        }

        //809冷却中且未购买礼包，则弹礼包
         if(data.code == 809 && !App.DataCenter.keybuy.wulengque.hasbuy){
             App.PanelManager.open(PanelConst.LibaoCDPanel);
         }

    }

    //询问购买恋爱道具
    private askBuyLoveTool(){
        if(this.transData.need_tool > 0){
            //获取所需恋爱道具信息
            let tools = App.DataCenter.Shop.tools;
            let price:number = 0;
            let tool_name = this.transData.tool_name
            let tool_id = this.transData.tool_id;
            let need_tool = this.transData.need_tool;
            for(let key in tools){
                let toolObj = tools[key];
                if(toolObj.id == this.transData.tool_id){
                    price = toolObj.price;
                    break;
                }
            }
            //弹出购买提示
            let askDialog:ConfirmDialog = new ConfirmDialog();
            askDialog.setOk(()=>{
                this.sendBuyLoveTool(tool_id, need_tool);
            },this);
            askDialog.setBuyLove(tool_name, price*need_tool);
            askDialog.show();
        }
    }

    //发送购买恋爱道具
    private sendBuyLoveTool(tool_id, need_tool){
        let gid = tool_id;
        let http = new HttpSender();
        let data = ProtocolHttp.toolsBuy;
        data.gid = gid;
        data.count = need_tool;
        http.post(ProtocolHttpUrl.toolsBuy, data, this.revBuyLoveTool, this);
    }

    //购买恋爱道具返回
    private revBuyLoveTool(data){
        console.log("tool", data);
        if (data.code == 200) {
            App.DataCenter.UserInfo.diamond = data.data.diamond;
            App.DataCenter.UserInfo.gold = data.data.gold;
            App.DataCenter.UserInfo.hearts = data.data.hearts;
            App.DataCenter.UserInfo.power = data.data.power;

            //更新限购次数
            console.log("BuyToolPanel >> 购买返回，剩余限购次数:", data.data.left_times);
            let leftTimes = {"id":this.transData.tool_id, "left_times": data.data.left_times};
            App.EventManager.sendEvent(EventConst.UPDATE_LEFT_TIMES, leftTimes);

            //更新四维
            App.EventManager.sendEvent(EventConst.UPDATE_SIWEI);
            
            //DataCenter里数据不是唯一的...
            //DataCenter和BuyToolPanel、DaojuListItem里面分别保存了三份数据，而数据不一致...
            //这里先应付下更新数据问题...
            let buyToolPanel:BuyToolPanel = App.PanelManager.getPanel(PanelConst.BuyToolPanel);
            buyToolPanel && buyToolPanel.setXiangou(data.data.left_times);
            let tools = App.DataCenter.Shop.tools;
            let tool_id = this.transData.tool_id;
            let need_tool = this.transData.need_tool;
            for(let key in tools){
                let toolObj = tools[key];
                if(toolObj.id == this.transData.tool_id){
                    toolObj.left_times = data.data.left_times;
                    break;
                }
            }
            
            Tips.info("购买成功");

            let panel = App.PanelManager.getPanel(PanelConst.ShopPanel);
            panel && panel.setGoldText(App.DataCenter.UserInfo.gold);

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

enum LoveBoxType {
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