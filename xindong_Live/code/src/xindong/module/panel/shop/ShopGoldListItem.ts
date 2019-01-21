/**
 * @author xiongjian 
 * @date 2017/9/4
 * 金币列表item
 */
class ShopGoldListItem extends BaseUI {

    public maskImg: eui.Rect;              //图片遮罩
    public daojuImg: eui.Image;            //道具图片
    private priceImg:eui.Image;            //价格图片
    private priceLabel:eui.Label;          //价格文本
    private nameLabel:eui.Label;           //道具名称
    private buyBtn:eui.Button;             //购买按钮

    public transData;                      //商品数据
 
    public constructor() {
        super();
        this.skinName = "ShopGoldListItemSkin";
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
        this.priceLabel.text = this.transData.price;
        if (this.transData.coin_type == "rmb") {
            //TODO 设置货币图片
            this.priceImg.source = RES.getRes("");
        }else if (this.transData.coin_type == "diamond") {
            //TODO 设置货币图片
            this.priceImg.source = RES.getRes("com_diamond_icon_png");
        }

        this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyTouch, this);
    }

    /**从场景中移除*/
    protected onRemove() {
        this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyTouch, this);
    }

    //购买
    private onBuyTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        let confirmDialog: ConfirmDialog = new ConfirmDialog();
        confirmDialog.setTitle("提示");
        confirmDialog.show();
        confirmDialog.setOk(this.reqGiftBuy, this);
        confirmDialog.setBuyUseDiamond(this.transData.price);
    }

    //请求购买
    private reqGiftBuy() {
        let http = new HttpSender();
        let data = ProtocolHttp.giftBuy;
        data.gid = this.transData.id;
        let channel = window["channel"];
        if(channel) data["channel"] = channel;
        http.post(ProtocolHttpUrl.giftBuy, data, this.revGiftBuy, this);
    }

    //购买砖石返回
    private revGiftBuy(data) {
        if (data.code == 200) {
            if (this.transData.coin_type == "rmb") {
                App.NativeBridge.sendPay(data);
            }else if (this.transData.coin_type == "diamond") {
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