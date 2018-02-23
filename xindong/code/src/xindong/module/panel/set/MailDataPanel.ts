/**
 * 邮件面板
 * @author xiongjian
 * @date 2017/10/9 
 */

class MailDataPanel extends BasePanel {
    public recData;
    public backBtn: eui.Button;
    public linquBtn: eui.Button;
    public mailGroup: eui.Group;
    public giftGroup: eui.Group;
    public text: eui.Label;
    public content: eui.Label;


    public constructor() {
        super();
        this.skinName = "MailDataPanelSkin"
    }

    /**组件创建完毕*/
    protected childrenCreated() {
        
    }

    /**添加到场景中*/
    public onEnable(data:any = null) {
        this.recData = data;
        this.playEnterAnim();
        CommomBtn.btnClick(this.backBtn,this.close,this,2);
        CommomBtn.btnClick(this.linquBtn,this.linquBtnTouch,this,1);
        this.setData();
    }

    /**从场景中移除*/
    public onRemove() {
        CommomBtn.removeClick(this.backBtn,this.close,this);
        CommomBtn.removeClick(this.linquBtn,this.linquBtnTouch,this);

    }

    /**设置数据 */
    public setData() {
        this.text.text = this.recData.title;
        this.content.text = this.recData.content;
        console.log("tool",this.recData.tool);
        this.giftGroup.removeChildren();
        let data = this.recData.tool;
        let gift = new MailDataGroupItem();
        gift.x = 20;
        gift.y = 20;
        gift.setName(data.cname);
        gift.setCount(this.recData.num);
        gift.setImage(data.pic);
        this.giftGroup.addChild(gift);

    }

    /**领取 */
    private linquBtnTouch() {
        let http = new HttpSender();
        let param = {mid:0};
        param.mid = this.recData.id;
        http.post(ProtocolHttpUrl.mailLingqu, param, this.lingquBack, this);
    }

    /**领取邮件返回 */
    private lingquBack(data) {
        if (data.code == 200) {
            App.DataCenter.UserInfo.hearts = data.data.hearts;
            App.DataCenter.UserInfo.diamond = data.data.diamond;
            App.DataCenter.UserInfo.gold = data.data.gold;
            App.DataCenter.UserInfo.power = data.data.power;

            //删除本条邮件
            let mail = App.DataCenter.mail;
            for (let i = 0; i < mail.length; i++) {
                if(mail[i].id == this.recData.id){
                    App.DataCenter.mail.splice(i,1);
                }
            }
            this.close();
            //更新红点提示
            App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);

            Tips.info(LanConst.mail0_00);
        } else {
            Tips.info(data.info);
        }
    }

    /**关闭页面 */
    private close() {
        App.PanelManager.open(PanelConst.MailPanel);
        this.hide();

    }

}