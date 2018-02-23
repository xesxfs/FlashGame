/**
 * @author xiongjian 
 * @date 2017/10/9
 * 邮件列表item
 */
class MailListItem extends eui.ItemRenderer {

    private oldData;
    public text:eui.Label;
    public timeLabel:eui.Label;

    public constructor() {
        super();
        this.skinName = "MailListItemSkin";
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.itemTouch,this);
    }

    protected dataChanged() {
        if (this.oldData == this.data) {
            return;
        }

        this.text.text = this.data.title

        this.oldData = this.data;
    }

    /**item点击 */
    private itemTouch(){
        App.SoundManager.playEffect(SoundManager.button);
        App.PanelManager.open(PanelConst.MailDataPanel,this.data);
        App.PanelManager.close(PanelConst.MailPanel);
    }

}