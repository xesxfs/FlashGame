/**
 * @author xiongjian 
 * @date 2017/10/9
 * 邮件列表item
 */
class MailListItem extends eui.ItemRenderer {

    public titleLabel:eui.Label;   //邮件标题
    public timeLabel:eui.Label;    

    public constructor() {
        super();
        this.skinName = "MailListItemSkin";
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.itemTouch,this);
    }

    protected dataChanged() {
        this.titleLabel.text = this.data.title;
        this.timeLabel.text = "";
    }

    /**item点击 */
    private itemTouch(){
        App.SoundManager.playEffect(SoundManager.button);
        App.PanelManager.open(PanelConst.MailDataPanel,this.data);
        App.PanelManager.close(PanelConst.MailPanel);
    }

}