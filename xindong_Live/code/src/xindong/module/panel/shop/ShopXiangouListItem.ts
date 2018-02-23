/**
 * @author xiongjian 
 * @date 2017/9/4
 * 限购列表item
 */
class ShopXiangouListItem extends BaseUI {

    public maskImg: eui.Rect;         //道具图片遮罩
    public daojuImg: eui.Image;       //道具图片

    public priceLabel: eui.Label;     //价格文本
    private priceImg:eui.Image;       //货币图标
    private buyBtn:eui.Button;        //购买文本
    private nameLabel:eui.Label;      //名称文本


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
        
    }

    /**添加到场景中*/
    protected onEnable() {
        //职场礼包和超值礼包不需要遮罩和名字
        //this.daojuImg.mask = this.maskImg;
        this.nameLabel.text = "";

        //设置道具图片
        this.daojuImg.source = RES.getRes(this.transData.pic);

        //设置价格
        if (this.transData.coin_type == "rmb") {
            this.priceLabel.text = this.transData.price + "元";
            this.priceImg.source = RES.getRes("");
        }else if (this.transData.coin_type == "diamond") {
            this.priceLabel.text = this.transData.price;
            this.priceImg.source = RES.getRes("com_diamond_icon_png");
        }


        this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyTouch, this);
    }

    /**从场景中移除*/
    protected onRemove() {
        this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyTouch, this);
    }

    /**砖石Item点击 */
    private onBuyTouch() {
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
                panel.topMenu.setAssetUI();

                //更新四维
                App.EventManager.sendEvent(EventConst.UPDATE_SIWEI);
            }

        } else {
            //钻石不足，提示去购买钻石
            let dialog:ConfirmDialog = new ConfirmDialog();
            dialog.setTitle("提示");
            dialog.setContent("钻石数量不足，是否充值钻石？");
            dialog.setOk(()=>{
                //App.EventManager.sendEvent(EventConst.TURN_DIAMOND_PAGE);
            },this);
            dialog.show();
        }
    }
}