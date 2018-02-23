/**
 *电话呼叫中面板
 * @author xiongjian
 * @date 2017/08/24
 */
class ShopPanel extends BasePanel {

    public diamendLabel: eui.Label;
    public goldLabel: eui.Label;
    public backBtn: eui.Button;
    public shopViewStack: eui.ViewStack;
    public xiangouGroup: eui.Group;
    public chaozhiGroup: eui.Group;
    public zhuanshiGroup: eui.Group;
    public goldGroup: eui.Group;
    public daojuScroller: eui.Scroller;
    public daojuGroup: eui.Group;
    public xiangouRadioBtn: eui.RadioButton;
    public heartPlugin: HeartsPlugins;
    public btnGroup: eui.RadioButtonGroup;
    public goldGroup1: eui.Group;
    public diamondGroup1: eui.Group;

    public goumaiRadioBtn: eui.RadioButton;
    public diamontRadioBtn: eui.RadioButton;
    public goldRadioBtn: eui.RadioButton;
    public daojuRadioBtn: eui.RadioButton;


    private goldListData: any[] = [];
    private diamondsListData: any[] = [];
    private giftpcakListData: any[] = [];
    private xiangouListData: any[] = [];
    private limitListData: any[] = [];

    public isBack = false;
    public select = 0;

    public constructor() {
        super();
        this.skinName = "ShopPanelSkin";
    }

    protected childrenCreated() {
        this.init();
    }

    public onEnable(data:any = null) {
        if (data) {
            this.select = data;
            this.shopViewStack.selectedIndex = this.select;
            this.setRadioBtn(this.select);
        }

        this.setGoldText(App.DataCenter.UserInfo.gold);
        this.setDiaMondText(App.DataCenter.UserInfo.diamond);
        this.setXinText(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts);

        this.xiangouRadioBtn.group.addEventListener(eui.UIEvent.CHANGE, this.changeViewStack, this);
      
        this.goldGroup1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goldGroup1Touch, this);
        this.diamondGroup1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.diamondGroup1Touch, this);
         CommomBtn.btnClick(this.backBtn,this.close,this,2);

        App.EventManager.addEvent(EventConst.payBack, this.payback, this);

        App.EventManager.addEvent(EventConst.UPDATE_FIRST_PAY, this.onUpdateFirstPay, this);
        App.EventManager.addEvent(EventConst.UPDATE_LEFT_TIMES, this.onUpdateLeftTimes, this);
        App.EventManager.addEvent(EventConst.TURN_DIAMOND_PAGE, this.onTurnDiamondPage, this);

    }
    public onRemove() {
        this.xiangouRadioBtn.group.removeEventListener(eui.UIEvent.CHANGE, this.changeViewStack, this);
        this.backBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
        this.goldGroup1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goldGroup1Touch, this);
        this.diamondGroup1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.diamondGroup1Touch, this);

        CommomBtn.removeClick(this.backBtn,this.close,this);
    }

    //更新商城道具(修改限购次数)
    private onUpdateLeftTimes(data){
        let id = data.id;
        let left_times = data.left_times;
        var len = this.daojuGroup.numChildren;
        for(var i=0;i<len;i++){
            var item:DaojuListItem = this.daojuGroup.getChildAt(i) as DaojuListItem;
            if(item.recData.id == id && item.recData.is_limit){
                item.recData.left_times = left_times;
                item.setBuyLimit(true, item.recData.buy_times, item.recData.left_times);
            }
        }
    }

    //跳转到购买钻石页面
    private onTurnDiamondPage(){
        this.shopViewStack.selectedIndex = 2;
        this.setRadioBtn(2);
    }

    //购买钻石道具成功，设置首次双倍显示
    private onUpdateFirstPay(){
        let diamondList = App.DataCenter.Shop.diamonds;  
        let dLen = diamondList.length;
        let len = this.zhuanshiGroup.numChildren;
        for(let i=0;i<len;i++){
            let item:ShopDiamondsListItem = this.zhuanshiGroup.getChildAt(i) as ShopDiamondsListItem;
            for(let j=0;j<dLen;j++){
                let diamonds = diamondList[j];
                if(item.transData.id == diamonds.id){
                    item.setFirstPay(diamonds.first_pay);
                }
            }
        }
    }

    /**切换ViewStark */
    private changeViewStack(e: eui.UIEvent) {
        var group: eui.RadioButtonGroup = e.target;
        this.shopViewStack.selectedIndex = group.selectedValue;
        console.log("g", group.selectedValue, "viewstack" + this.shopViewStack.selectedIndex);
        App.SoundManager.playEffect(SoundManager.page_switch);
    }

    private init() {
        let shop = App.DataCenter.Shop;
        let tools = shop.tools;
        this.goldListData = shop.golds;
        this.diamondsListData = shop.diamonds;
        this.giftpcakListData = shop.giftpcak;
        this.limitListData = shop.limitpack;

        //添加道具
        for (let i = 0; i < tools.length; i++) {
            let item = new DaojuListItem();
            //item.x = (366 + 48) * i + 48;
            //item.y = 20;
            // item.x = 366 * (i % 3) + 48;
            // item.y = 10 + Math.floor(i / 2) * 215;
            item.setData(tools[i]);
            item.setImg(tools[i].pic);
            item.setGold(tools[i].price);
            item.setEName(tools[i].ename);
            item.setCName(tools[i].cname);
            item.setMiaoShu(tools[i].des, tools[i].quantity);
            item.setBuyLimit(tools[i].is_limit, tools[i].buy_times, tools[i].left_times);
            this.daojuGroup.addChild(item);
        }

        /**金币道具 */
        for (let i = 0; i < this.goldListData.length; i++) {
            let item = new ShopGoldListItem();
            item.setData(this.goldListData[i]);
            //item.x = (366 + 48) * i + 48;
            //item.y = 20;
            this.goldGroup.addChild(item);
        }
        /**砖石道具 */
        for (let i = 0; i < this.diamondsListData.length; i++) {
            let item = new ShopDiamondsListItem();
            item.setData(this.diamondsListData[i]);
            item.setFirstPay(this.diamondsListData[i].first_pay);
            item.x = (366 + 48) * i + 48;
            item.y = 20;
            this.zhuanshiGroup.addChild(item);
        }
        /**限购礼包道具 */
        for (let i = 0; i < this.limitListData.length; i++) {
            let item = new ShopXiangouListItem();
            item.setData(this.limitListData[i]);
            item.x = (366 + 48) * i + 48;
            item.y = 20;
            this.xiangouGroup.addChild(item);
        }
        /**礼包道具 */
        for (let i = 0; i < this.giftpcakListData.length; i++) {
            let item = new ShopXiangouListItem();
            item.setData(this.giftpcakListData[i]);
            item.x = (366 + 48) * i + 48;
            item.y = 20;
            this.chaozhiGroup.addChild(item);
        }

        this.setGoldText(App.DataCenter.UserInfo.gold);
        this.setDiaMondText(App.DataCenter.UserInfo.diamond);
        this.setXinText(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts);


    }

    /**设置金币 */
    public setGoldText(str) {
        
            this.goldLabel.text = str;
        
    }

    /**设置砖石 */
    public setDiaMondText(str) {
       
            this.diamendLabel.text = str
        
    }

    /**设置radioBtn */
    public setRadioBtn(select) {
        switch (select) {
            case 0:
                this.xiangouRadioBtn.selected = false;
                this.goumaiRadioBtn.selected = false;
                this.goldRadioBtn.selected = false;
                this.diamontRadioBtn.selected = false;
                this.daojuRadioBtn.selected = true;
                break;
            case 1:
                this.xiangouRadioBtn.selected = false;
                this.goumaiRadioBtn.selected = false;
                this.goldRadioBtn.selected = true;
                this.diamontRadioBtn.selected = false;
                this.daojuRadioBtn.selected = false;
                break;
            case 2:
                this.xiangouRadioBtn.selected = false;
                this.goumaiRadioBtn.selected = false;
                this.goldRadioBtn.selected = false;
                this.diamontRadioBtn.selected = true;
                this.daojuRadioBtn.selected = false;
                break;
            case 3:
                this.xiangouRadioBtn.selected = true;
                this.goumaiRadioBtn.selected = false;
                this.goldRadioBtn.selected = false;
                this.diamontRadioBtn.selected = false;
                this.daojuRadioBtn.selected = false;
                break;
            case 4:
                this.xiangouRadioBtn.selected = false;
                this.goumaiRadioBtn.selected = true;
                this.goldRadioBtn.selected = false;
                this.diamontRadioBtn.selected = false;
                this.daojuRadioBtn.selected = false;
                break;
        }
    }

    /**设置爱心 */
    public setXinText(str, h) {
        if (h && h != "") {
            this.heartPlugin.setJindu(str, h);
        }
    }

    /**头部金币点击 */
    public goldGroup1Touch() {
        this.shopViewStack.selectedIndex = 1;
        this.setRadioBtn(1);
    }

    /**头部砖石点击 */
    public diamondGroup1Touch() {
        this.shopViewStack.selectedIndex = 2;
        this.setRadioBtn(2);
    }

    /**出场动画 */
    public outAnimation(finishCallback: Function = null) {

    }

    /**入场动画 */
    public enterAnimation() {

    }

    /**关闭面板 */
    private close() {
        if (this.isBack) {
            this.hide();
            this.isBack = false;
            let panel = <BagsPanel>App.PanelManager.getPanel(PanelConst.BagsPanel);
            //请求背包数据
            if (panel) {
                this.getBags();
            }

        } else {

            this.hide();
            var gamescene = App.SceneManager.getScene(SceneConst.GameScene) as GameScene;
            gamescene.enterAnimation();
        }

    }

    /**请求背包数据 */
    private getBags() {
        let http = new HttpSender();
        http.post(ProtocolHttpUrl.bags, {}, this.dataBack, this);
    }
    /**背包数据返回 */
    private dataBack(data) {
        if (data.code == 200) {
            App.DataCenter.Bags = data.data;
            let panel = <BagsPanel>App.PanelManager.getPanel(PanelConst.BagsPanel);
            panel.init();
        }
    }

    /**支付返回 */
    private payback() {
        this.setXinText(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts);
        this.setGoldText(App.DataCenter.UserInfo.gold);
        this.setDiaMondText(App.DataCenter.UserInfo.diamond);
    }

}