/**
 * @author xiongjian 
 * @date 2017/9/4
 * 砖石列表item
 */
class ShopDiamondsListItem extends BaseUI {

    public maskImg: eui.Rect;              //图片遮罩
    public daojuImg: eui.Image;            //道具图片
    private priceImg:eui.Image;            //价格图片
    private priceLabel:eui.Label;          //价格文本
    private nameLabel:eui.Label;           //道具名称
    private buyBtn:eui.Button;             //购买按钮
    public doubleImg:eui.Image;            //首冲双倍

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
        
    }

    /**添加到场景中*/
    protected onEnable() {
        this.nameLabel.text = "";
        //设置遮罩
        this.daojuImg.mask = this.maskImg;

        //设置道具图片
        this.daojuImg.source = RES.getRes(this.transData.pic);

        //设置价格
        this.priceLabel.text = this.transData.price + "元";
        if (this.transData.coin_type == "rmb") {
            //TODO 设置货币图片
            this.priceImg.source = RES.getRes("");
        }else if (this.transData.coin_type == "diamond") {
            //TODO 设置货币图片
            this.priceImg.source = RES.getRes("");
        }

        this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyTouch, this);
    }

    /**从场景中移除*/
    protected onRemove() {
        this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyTouch, this);
    }


    /**点击购买 */
    private onBuyTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        var confirmDialog:ConfirmDialog = new ConfirmDialog();
        confirmDialog.setTitle("提示");
        confirmDialog.show();
        confirmDialog.setOk(this.reqGiftBuyNew, this);
        confirmDialog.setBuyUseRmb(this.transData.price);
    }

    //请求购买
    private reqGiftBuy(){
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
            http.post(ProtocolHttpUrl.giftBuy, data, this.revGiftBuy, this);
        }
    }

    /**请求购买新版 */
    public reqGiftBuyNew() {
        let http = new HttpSender();
        let data = ProtocolHttp.giftBuy;
        data.gid = this.transData.id;
        data["channel"] = StaticCfg.channel;
        http.post(ProtocolHttpUrl.giftBuy, data, this.revGiftBuy, this);
    }

    //返回购买
    private revGiftBuy(data) {
        if (data.code == 200) {
            if (this.transData.coin_type == "rmb") {
                // App.NativeBridge.sendPay(data);
                App.NativeBridge.sendNativePay(data.data);
            }
            if (this.transData.coin_type == "diamond") {
                Tips.info("购买成功")
                App.DataCenter.UserInfo.diamond = data.data.diamond;
                App.DataCenter.UserInfo.gold = data.data.gold;
                App.DataCenter.UserInfo.hearts = data.data.hearts;
                App.DataCenter.UserInfo.power = data.data.power;
                let panel = <ShopPanel>App.PanelManager.getPanel(PanelConst.ShopPanel);
                panel.topMenu.setAssetUI();


                //购买钻石成功
                //App.EventManager.sendEvent(ShopEvent.UPDATE_DOUBLE_TIP);
                
                //更新四维
                App.EventManager.sendEvent(EventConst.UPDATE_SIWEI);
            }

        } else {
            Tips.info(data.info);
        }
    }


    //设置是否显示首次双倍
    public setFirstPay(bFirst:boolean){
        this.transData.first_pay = bFirst;
        this.doubleImg.visible = bFirst;
    }
}