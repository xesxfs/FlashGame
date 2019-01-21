/**
 * @author xiongjian 
 * @date 2017/9/4
 * 限购列表item
 */
class ShopXiangouListItem extends BaseUI {

    public maskImg: eui.Image;
    public daojuImg: eui.Image;
    public buyGroup: eui.Group;
    public zhuanshiImg: eui.Image;
    public renminbiImg: eui.Image;
    public goldLabel: eui.BitmapLabel;


    public transData;

    public constructor() {
        super();
        this.skinName = "ShopXiangouListItemSkin";
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
         let confirmDialog:ConfirmDialog 
        if (this.transData.coin_type == "rmb") {
           confirmDialog = new ConfirmDialog();
           confirmDialog.setTitle("提示");
           confirmDialog.show();
           confirmDialog.setOk(this.sendGiftBuy, this);
           confirmDialog.setBuyUseRmb(this.transData.price);
        }
        if (this.transData.coin_type == "diamond") {
           confirmDialog = new ConfirmDialog();
           confirmDialog.setTitle("提示");
           confirmDialog.show();
           confirmDialog.setOk(this.sendGiftBuy, this);
           confirmDialog.setBuyUseDiamond(this.transData.price);
        }
    }

    private sendGiftBuy(){
        //Android支付,sdk自己下单         
        if(App.DeviceUtils.IsAndroid && App.DeviceUtils.IsNative && this.transData.coin_type == "rmb"){
            let packages = this.transData.package;
            let { price } = this.transData;
            let goodsDes = {
                name: packages[0]["cname"],
                price: price+"元",
                desc: "解锁"+packages[0]["cname"]+"功能,加送"+packages[1]["num"]+packages[1]["cname"]
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

                //更新四维
                App.EventManager.sendEvent(EventConst.UPDATE_SIWEI);
            }

        } else {
            //Tips.info("" + data.info);

            //钻石不足，提示去购买钻石
            let dialog:ConfirmDialog = new ConfirmDialog();
            dialog.setTitle("提示");
            dialog.setContent("钻石数量不足，是否充值钻石？");
            dialog.setOk(()=>{
                App.EventManager.sendEvent(EventConst.TURN_DIAMOND_PAGE);
            },this);
            dialog.show();
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
}