/**
 * 互动礼物Item
 * @author sven
 * 2017.12.28
 */
class InteractGiftItem extends eui.ItemRenderer {
    private itemImg:eui.Image;
    private nameLab:eui.Label;
    private hadGro:eui.Group;
    private hadLab:eui.Label;
    private buyGro:eui.Group;
    private costLab:eui.Label;
    private heartLab:eui.Label;

    private gClickData: InteractGiftItemVo;

    public constructor() {
        super();
        this.skinName = "InteractGiftItemSkin";
    }

    protected childrenCreated() {
        CommomBtn.btnClick(this.hadGro, this.onClickGive, this, ComBtnType.Click);
        CommomBtn.btnClick(this.buyGro, this.onClickGive, this, ComBtnType.Click);
    }

    protected dataChanged() {
        let clickData:InteractGiftItemVo = this.gClickData = this.data;

        this.itemImg.source = clickData.pic;
        this.nameLab.text = clickData.cname;
        this.heartLab.text = clickData.quantity+"";
        
        if (clickData.count > 0) {
            this.hadGro.visible = true;
            this.buyGro.visible = false;
            this.hadLab.text = "拥有 "+ clickData.count + "";
        }
        else {
            this.hadGro.visible = false;
            this.buyGro.visible = true;
            this.costLab.text = clickData.price + "";
        }
    }

    private onClickGive() {
        let clickData = this.gClickData;
        if (clickData.count <= 0 && App.DataCenter.UserInfo.gold < clickData.price) {
            let dialog:ConfirmDialog = new ConfirmDialog();
            dialog.setLackCurrency(1);
            dialog.show();
        }
        else {
            let http:HttpSender = new HttpSender;
            let data = ProtocolHttp.sendGift;
            data.gid = clickData.id;
            data.count = 1;
            http.post(ProtocolHttpUrl.sendGift, data, this.revGive, this);
        }
    }

    private revGive(data) {
        if(data.code == 200) {
            if (this.gClickData.count > 0) {
                this.gClickData.count --;
                this.hadLab.text = "拥有 "+ this.gClickData.count + "";

                if (this.gClickData.count <= 0) {
                    this.hadGro.visible = false;
                    this.buyGro.visible = true;
                    this.costLab.text = this.gClickData.price + "";
                }
            }

            App.DataCenter.UserInfo.giftScore = data.data.gift_score;
            let panel = <InteractGiftPanel>App.PanelManager.getPanel(PanelConst.InteractGiftPanel);
            panel.reProUI();
            
            let bPoint: egret.Point = this.itemImg.localToGlobal(this.itemImg.width/2, this.itemImg.height/2);
            let ePoint: egret.Point = panel.topMenu.heartUI.localToGlobal(155, 15);
            FlyAnim.getInstace().addFly("com_heart_png", bPoint.x, bPoint.y, ePoint.x, ePoint.y, ()=>{
                App.DataCenter.reUserBase(data.data);
            }, this, 1000);
            App.SoundManager.playEffect("give_gifts_mp3");
        }
        else {
            Tips.info(data.info);
        }
    }
}