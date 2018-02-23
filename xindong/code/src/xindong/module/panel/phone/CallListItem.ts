/**
 * @author xiongjian 
 * @date 2017/9/4
 * 电话列表item
 */
class CallListItem extends eui.ItemRenderer {

    public talkLabel: eui.Label;
    // public timeLabel: eui.Label;
    public numLabel: eui.Label;
    private oldData;

    public constructor() {
        super();
        this.skinName = "CallListItemSkin";
        this.talkLabel.fontFamily = "fzyc";
        this.numLabel.fontFamily = "fzyc";
    }

    protected dataChanged() {

        if (this.oldData == this.data) {
            return;
        }
        console.log("callList", this.data);
        if (this.data.history.dialog && this.data.history.dialog.length > 0) {
            this.talkLabel.text = this.data.history.dialog[0].says;
        }
        this.numLabel.text = this.data.num;
        // this.timeLabel.text = this.data.history.days + "天前"

        this.oldData = this.data;
    }


}