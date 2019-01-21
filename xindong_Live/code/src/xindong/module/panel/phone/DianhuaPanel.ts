/**
 *电话面板
 * @author xiongjian
 * @date 2017/08/24
 */
class DianhuaPanel extends BasePanel {
    public recData;

    //引导
    public telGuideGroup: eui.Group;
    public telGuideImg: eui.Image;
    public telHand: eui.Image;

    /**详细数据 */
    private itemData = [];

    /**历史消息 */
    private history: any[];

    //======第二版=====      
    public girlName: eui.Label;       //女主昵称
    public grilImg: eui.Image;        //女主头像

    private callBtn: eui.Button;     //拨打电话    女色电话按钮
    private callingBtn: eui.Button;   //正在拨打ing 红色电话按钮

    public dianhuaList: eui.List;    //历史电话列表
    private ac: eui.ArrayCollection; //list数据源

    private callTimer: egret.Timer = new egret.Timer(3000, 1);   //计时器
    private chanel: egret.SoundChannel;                          //拨打电话的声音

    public constructor() {
        super();
        this.skinName = "DianhuaPanelSKin";
    }

    protected childrenCreated() {
        this.callingBtn.visible = false;
    }

    public onEnable(data: any = null) {
        this.recData = data;

        //顶部菜单
        this.topMenu.setAssetUI();
        this.topMenu.configListeners();

        //标题
        this.topMenu.showConfig(false, false, TopMenuTitle.Phone);

        //拨打电话
        this.callBtn.visible = true;
        this.callingBtn.visible = false;

        //电话头像和昵称
        this.grilImg.source = RES.getRes(App.DataCenter.telInfo.head);
        this.girlName.text = App.DataCenter.ConfigInfo.girl_name;

        //历史通话记录
        this.ac = new eui.ArrayCollection();
        this.ac.source = this.getHistoryArr();
        this.dianhuaList.dataProvider = this.ac;
        this.dianhuaList.itemRenderer = CallListItem;

        //引导
        this.setGuide();

        //按钮监听
        this.dianhuaList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTouch, this);
        this.telGuideImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTelGuideTouch, this);

        CommomBtn.btnClick(this.callBtn, this.callBtnTouch, this);
        CommomBtn.btnClick(this.callingBtn, this.onCallingTouch, this);


        //从接通面板，完成通话事件后返回。recData保存着tel_main主事件
        //由于recData是持久化的，而不是在onEnable中作为参数传入，所以每次退出得清零...
        // if(this.recData == true){
        //     this.playBackBtnAnim();
        // }
    }

    public onRemove() {
        this.dianhuaList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTouch, this);
        this.telGuideImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTelGuideTouch, this);

        CommomBtn.removeClick(this.callBtn, this.callBtnTouch, this);

        egret.Tween.removeTweens(this.telHand);

        this.stopBackBtnAnim();
        this.recData = null;
    }

    /**拨号按钮监听 */
    private callBtnTouch() {
        //设置标题
        this.topMenu.showConfig(false, false, TopMenuTitle.Call);
        //设置拨打按钮
        this.callBtn.visible = false;
        this.callingBtn.visible = true;
        //停止监听
        this.dianhuaList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTouch, this);
        this.topMenu.deConfigListeners();
        //计时器
        this.startOverTimer();
        //播放声音
        this.chanel = App.SoundManager.playEffect(SoundManager.calling, 0, 0);
        this.telGuideGroup.visible = false;
    }

    //挂断点击
    private onCallingTouch() {
        //设置标题
        this.topMenu.showConfig(false, false, TopMenuTitle.Phone);
        //设置拨打按钮
        this.callBtn.visible = true;
        this.callingBtn.visible = false;
        //停止监听
        this.dianhuaList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTouch, this);
        this.topMenu.configListeners();
        //计时器
        this.stopOverTimer();
        //停止声音
        App.SoundManager.stopEffect(this.chanel);
    }

    /**item点击 */
    private itemTouch(e: eui.ItemTapEvent) {
        let tel = App.DataCenter.telInfo;
        if (this.itemData) {
            let data = this.itemData[e.itemIndex];
            App.PanelManager.open(PanelConst.CallHistoryPanel, data);
            this.hide();
        }

    }

    /**引导拨打电话 */
    private onTelGuideTouch() {
        GuideCircle.getInstacen().hide();
        this.callBtnTouch();
    }

    /**返回按钮监听 */
    private backTouch() {
        this.hide();
        var gamescene = App.SceneManager.getScene(SceneConst.GameScene) as GameScene;
        gamescene.enterAnimation();
    }

    /**数据处理 */
    private getHistoryArr() {
        let tel = App.DataCenter.telInfo;
        let replyId = 0;
        let arr = []
        this.itemData = [];

        let history = tel.history;
        let nexttel = tel.nexttel;
        /***排序 */
        var compareDays = function (property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value2 - value1;
            }
        }

        history.sort(compareDays("days"));
        //有通话，则显示拨打按钮；否则隐藏，不让用户拨打电话
        if (nexttel && nexttel.length > 0) {
            this.showCallBtn(true);
        } else {
            this.showCallBtn(false);
        }

        //保存历史通话数据到itemData
        let count = 1;
        for (let i = 0; i < history.length; i++) {
            if (history[i].hist.length == 0) {
                continue;
            } else {
                let obj = new Object();
                obj["num"] = count;
                obj["history"] = history[i]
                if (history[i].hist && history[i].hist.length > 0) {
                    arr.push(obj);
                    this.itemData.push(history[i]);
                }
                count++;
            }
        }

        return arr;
    }


    /**显示拨打按钮 */
    private showCallBtn(boo: boolean) {
        if (boo) {
            this.callBtn.visible = true;
        } else {
            this.callBtn.visible = false;
        }

    }

    /**引导 */
    public setGuide() {
        if (App.DataCenter.dianhuaGuide) {
            this.telGuideGroup.visible = true;
            egret.Tween.get(this.telHand, { loop: true })
                .to({ y: this.telHand.y - 40 }, 600)
                .to({ y: this.telHand.y }, 800)
                .wait(100);
            GuideCircle.getInstacen().show(this.telGuideImg);
        }
    }

    //播放退出提示
    private playBackBtnAnim() {
        this.topMenu.playBackAnim();
    }

    //停止退出提示
    private stopBackBtnAnim() {
        this.topMenu.stopBackAnim();
    }

    //开始超时计时
    private startOverTimer() {
        this.callTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
        this.callTimer.reset();
        this.callTimer.start();
    }

    //停止超时计时
    private stopOverTimer() {
        this.callTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
        this.callTimer.stop();
    }

    //超时
    private onTimerComplete() {
        App.PanelManager.open(PanelConst.JietongPanel);
        App.SoundManager.stopEffect(this.chanel);
        this.hide();
        this.stopOverTimer();
    }
}