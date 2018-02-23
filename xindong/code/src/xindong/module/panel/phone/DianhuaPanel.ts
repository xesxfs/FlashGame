/**
 *电话面板
 * @author xiongjian
 * @date 2017/08/24
 */
class DianhuaPanel extends BasePanel {
    public recData;
    public girlName: eui.Label;
    private backBtn: eui.Button;
    private callBtn: eui.Button;
    public grilImg: eui.Image;
    public maskImg: eui.Image;

    private guaduanBtn: eui.Button;

    public dianhuaScroller: eui.Scroller;
    public dianhuaList: eui.List;

    //引导
    public yindaoGroup: eui.Group;
    public yd_dianhuaImg: eui.Image;
    public dianhuaHand: eui.Image;


    private arr = []; //list数据
    /**list 控制器 */
    private ac: eui.ArrayCollection;
    /**详细数据 */
    private itemData = [];

    /**历史消息 */
    private history: any[];

    private handY:number;

    public constructor() {
        super();
        this.skinName = "DianhuaPanelSKin";
        this.girlName.fontFamily = "fzyc";
    }

    protected childrenCreated() {
        this.handY = this.dianhuaHand.y;
    }

    public onEnable(data:any = null) {
        this.recData = data;
        this.grilImg.mask = this.maskImg;
        if (App.DataCenter.Tel) {
            this.grilImg.source = App.DataCenter.Tel.head;
        }
        this.init();
        this.girlName.text = App.DataCenter.ConfigInfo.girl_name;

        this.dianhuaList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTouch, this);
        this.yd_dianhuaImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.yd_dianhuaImgTouch, this);

        CommomBtn.btnClick(this.backBtn, this.backTouch, this, 2);
        CommomBtn.btnClick(this.callBtn, this.callBtnTouch, this, 1);

        //从接通面板，完成通话事件后返回。recData保存着tel_main主事件
        //由于recData是持久化的，而不是在onEnable中作为参数传入，所以每次退出得清零...
        if(this.recData == true){
            this.playBackBtnAnim();
        }
    }
    public onRemove() {
        this.dianhuaList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTouch, this);
        this.yd_dianhuaImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.yd_dianhuaImgTouch, this);

        CommomBtn.removeClick(this.backBtn, this.backTouch, this);
        CommomBtn.removeClick(this.callBtn, this.callBtnTouch, this);
        
        egret.Tween.removeTweens(this.dianhuaHand);

        this.stopBackBtnAnim();
        this.recData = null;
    }

    /**拨号按钮监听 */
    private callBtnTouch() {
        App.PanelManager.open(PanelConst.CallingPanel);
        this.hide();

    }

    /**item点击 */
    private itemTouch(e: eui.ItemTapEvent) {
        console.log("item", e.itemIndex);
        let tel = App.DataCenter.Tel;
        if (this.itemData) {
            let data = this.itemData[e.itemIndex];
            console.log("data", data);
            App.PanelManager.open(PanelConst.CallHistoryPanel, data);
            this.hide();
        }

    }

    /**引导拨打电话 */
    private yd_dianhuaImgTouch() {

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
            App.PanelManager.open(PanelConst.CallingPanel);
            App.LocalStorageUtil.telGuide = "1";
            this.hide();
        } else {
            Tips.info("" + data.info);
        }
    }

    /**返回按钮监听 */
    private backTouch() {
        this.hide();
        var gamescene = App.SceneManager.getScene(SceneConst.GameScene) as GameScene;
        gamescene.enterAnimation();
    }

    private init() {

        this.ac = new eui.ArrayCollection();
        this.arr = [];
        var data = this.setData();
        this.arr = data;
        this.ac.source = this.arr;
        this.dianhuaList.dataProvider = this.ac;
        this.dianhuaList.itemRenderer = CallListItem;

        //引导
        this.setGuide();
    }

    /**数据处理 */
    private setData() {
        let tel = App.DataCenter.Tel;
        let replyId = 0;
        let arr = []
        this.itemData = [];
        console.log("tel", tel);
        let history = tel.history;
        let nexttel = tel.nexttel;
        console.log("nexttel", nexttel);
        if (nexttel && nexttel.length > 0) {
            this.showCallBtn(true);
        } else {
            this.showCallBtn(false);
        }

        let count = 1;
        for (let i = 0; i < history.length; i++) {
            if (history[i].dialog.length == 0) {
                continue;
            } else {
                //console.log(count);
                let obj = new Object();
                obj["num"] = count;
                obj["history"] = history[i]
                if (history[i].dialog && history[i].dialog.length > 0) {
                    arr.push(obj);
                    this.itemData.push(history[i]);
                }
                count++;
            }

        }
        console.log("arr", arr);
        return arr;
    }

    /**刷新数据 */
    private refresh(msg) {
        this.history.push(msg);
        let data = this.history;
        console.log("refresh", data);
        this.arr = data;
        this.ac.source = this.arr;
    }


    /**显示拨打按钮 */
    private showCallBtn(boo: boolean) {
        if (boo) {
            this.callBtn.visible = true;
        } else {
            this.callBtn.visible = false;
        }

    }

    /**出场动画 */
    public outAnimation(finishCallback: Function = null) {

    }

    /**入场动画 */
    public enterAnimation() {

    }

    /**引导 */
    public setGuide() {
        if (App.DataCenter.dianhuaGuide) {
            this.yindaoGroup.visible = true;
            egret.Tween.get(this.dianhuaHand, { loop: true })
            .set({ y: this.handY })
            .to({  y: this.handY-40 }, 600)
            .to({  y: this.handY }, 800)
            .wait(100);
        }
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