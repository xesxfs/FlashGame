/**
 * 视频礼包
 * @author xiongjian
 * @date 2017/10/9 
 */

class LibaoVideoPanel extends BasePanel {
    public buyBtn: eui.Button;
    public closeBtn: eui.Button;


    public constructor() {
        super();
        this.skinName = "LibaoVideoPanelSkin"
    }

    /**组件创建完毕*/
    protected childrenCreated() {
        
    }

    /**添加到场景中*/
    public onEnable() {
        this.playEnterAnim();
        
        CommomBtn.btnClick(this.buyBtn,this.buyBtnTouch,this,1);
        CommomBtn.btnClick(this.closeBtn,this.close,this,2);
    }

    /**从场景中移除*/
    public onRemove() {
        CommomBtn.removeClick(this.buyBtn,this.buyBtnTouch,this);
        CommomBtn.removeClick(this.closeBtn,this.close,this);
    }

    /**购买 */
    private buyBtnTouch() {
        let http = new HttpSender();
        let param = { gid: 0 }
        param.gid = App.DataCenter.keybuy.shiping.id;
        let channel = window["channel"];
        if(channel) param["channel"] = channel;
        http.post(ProtocolHttpUrl.giftBuy, param, this.buyBack, this);
    }

    /**购买礼包返回 */
    private buyBack(data) {
        if (data.code == 200) {
            this.close();
            if (App.DataCenter.keybuy.shiping.coin_type == "rmb") {
                App.NativeBridge.sendPay(data);
            }
            if (App.DataCenter.keybuy.shiping.coin_type == "diamond") {
                Tips.info("购买成功")
                App.DataCenter.keybuy.shiping.hasbuy = true;
            }

        } else {
            Tips.info("" + data.info);
        }
    }

    /**关闭页面 */
    private close() {
        this.hide();
    }

}