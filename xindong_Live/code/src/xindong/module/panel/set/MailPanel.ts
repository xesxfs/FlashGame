/**
 * 邮件面板
 * @author xiongjian
 * @date 2017/10/9 
 */

class MailPanel extends BasePanel {
    public closeBtn: eui.Button;    //关闭
    public mailList: eui.List;      //邮件列表
    public noText: eui.Label;       //没有邮件时显示

    public constructor() {
        super();
        this.skinName = "MailPanelSkin"
    }


    /**添加到场景中*/
    public onEnable() {
        this.playEnterAnim();
        this.setData();

        CommomBtn.btnClick(this.closeBtn,this.close,this,ComBtnType.Close);
    }

    /**从场景中移除*/
    public onRemove() {
        CommomBtn.removeClick(this.closeBtn,this.close,this);

    }

    /**设置数据 */
    public setData() {
        let data = App.DataCenter.mail;
        if (data && data.length > 0) {
            this.noText.visible = false;
        } else {
            this.noText.visible = true;
        }
        let ac = new eui.ArrayCollection();
        let arr = [];
        arr = data;
        ac.source = arr;
        this.mailList.dataProvider = ac;
        this.mailList.itemRenderer = MailListItem;
    }

    /**关闭页面 */
    private close() {
        App.PanelManager.open(PanelConst.SetPanel);
        this.hide();
    }

}