/**
 * @author xiongjian 
 * @date 2017/9/4
 * 砖石列表item
 */
class ShopDiamondsListItem extends BaseUI {

    public maskImg: eui.Image;
    public daojuImg: eui.Image;
    public buyGroup: eui.Group;
    public zhuanshiImg: eui.Image;
    public renminbiImg: eui.Image;
    public goldLabel: eui.BitmapLabel;
    public doubleImg:eui.Image;

    public transData;

    public constructor() {
        super();
        this.skinName = "ShopDiamondsListItemSkin";

    }

    /**设置数据 */
    public setData(data) {
        this.transData = data;
    }

    /**组件创建完毕*/
    protected childrenCreated() {
        if (this.transData.coin_type == "rmb") {
            this.showtype(2);
        }
        if (this.transData.coin_type == "diamond") {
            this.showtype(1);
        }
        this.setImg(this.transData.pic);
        this.setPrice(this.transData.price);
    }

    /**添加到场景中*/
    protected onEnable() {
        this.daojuImg.mask = this.maskImg;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.diamondsItemTouch, this);
    }

    /**从场景中移除*/
    protected onRemove() {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.diamondsItemTouch, this);
    }

    /**砖石Item点击 */
    private diamondsItemTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        var confirmDialog:ConfirmDialog = new ConfirmDialog();
        confirmDialog.setTitle("提示");
        confirmDialog.show();
        confirmDialog.setOk(this.sendGiftBuy, this);
        confirmDialog.setBuyUseRmb(this.transData.price);
    }

    private sendGiftBuy(){
        //Android支付,sdk自己下单         
        if(App.DeviceUtils.IsAndroid && App.DeviceUtils.IsNative){
            let goodPro = this.transData.package[0];
            let { price } = this.transData;
            let goodsDes = {
                name: "购买"+goodPro["num"] + goodPro["cname"],
                price: price+"元",
                desc: `只需${price}元即可获得${goodPro["num"]}${goodPro["cname"]}`
            };
            App.NativeBridge.sendAndroidPay(this.transData.id, goodsDes);
        }else{
            let http = new HttpSender();
            let data = ProtocolHttp.giftBuy;
            data.gid = this.transData.id;
            let channel = window["channel"];
            if(channel) data["channel"] = channel;
            http.post(ProtocolHttpUrl.giftBuy, data, this.buyDiamondsBack, this);
        }
    }

    /**购买砖石返回 */
    private buyDiamondsBack(data) {
        if (data.code == 200) {
            if (this.transData.coin_type == "rmb") {
                App.NativeBridge.sendPay(data);
            }
            if (this.transData.coin_type == "diamond") {
                Tips.info("购买成功")
                App.DataCenter.UserInfo.diamond = data.data.diamond;
                App.DataCenter.UserInfo.gold = data.data.gold;
                App.DataCenter.UserInfo.hearts = data.data.hearts;
                App.DataCenter.UserInfo.power = data.data.power;
                let panel = <ShopPanel>App.PanelManager.getPanel(PanelConst.ShopPanel);
                panel.setXinText(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts);
                panel.setGoldText(App.DataCenter.UserInfo.gold);
                panel.setDiaMondText(App.DataCenter.UserInfo.diamond);

                //购买钻石成功
                //App.EventManager.sendEvent(ShopEvent.UPDATE_DOUBLE_TIP);
                
                //更新四维
                App.EventManager.sendEvent(EventConst.UPDATE_SIWEI);
            }

        } else {
            Tips.info("" + data.info);
        }
    }

    /**显示购买类型 */
    private showtype(num) {
        switch (num) {
            case 1:
                this.zhuanshiImg.visible = true;
                this.renminbiImg.visible = false;
                break;
            case 2:
                this.zhuanshiImg.visible = false;
                this.renminbiImg.visible = true;
                break;
        }
    }


    /**设置图片 */
    public setImg(url) {
        if (url != "") {
            this.daojuImg.source = url;
        }

    }

        /**设置价格 */
    public setPrice(num){
        if(num !=""){
            this.goldLabel.text = num;
        }
    }

    //设置是否显示首次双倍
    public setFirstPay(bFirst:boolean){
        this.transData.first_pay = bFirst;
        this.doubleImg.visible = bFirst;
    }
}