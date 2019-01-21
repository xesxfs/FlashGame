/**
 * 邮件面板
 * @author xiongjian
 * @date 2017/10/9 
 */

class MailPanel extends BasePanel {
    public backBtn: eui.Button;
    public mailList: eui.List;
    public noText: eui.Label;

    public constructor() {
        super();
        this.skinName = "MailPanelSkin"
    }

    /**组件创建完毕*/
    protected childrenCreated() {
        
    }

    /**添加到场景中*/
    public onEnable() {
        this.playEnterAnim();
        this.setData();

        CommomBtn.btnClick(this.backBtn,this.close,this,2);
    }

    /**从场景中移除*/
    public onRemove() {
        CommomBtn.removeClick(this.backBtn,this.close,this);

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
        console.log("arr", arr);
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