/**
 * @author xiongjian 
 * @date 2017/9/4
 * 电话列表item
 */
class CallListItem extends eui.ItemRenderer {

    public talkLabel: eui.Label;
    public timeLabel: eui.Label;
    public numLabel: eui.Label;
    private oldData;

    public constructor() {
        super();
        this.skinName = "CallListItemSkin";
    }

    protected dataChanged() {

        if (this.oldData == this.data) {
            return;
        }
        if (this.data.history.hist && this.data.history.hist.length > 0) {
            this.talkLabel.text = StringTool.formatStrLen(this.data.history.hist[0].content, 16);
        }
        this.numLabel.text = this.data.num;

        let day = (App.DataCenter.UserInfo.days - this.data.history.days);
        if(day > 0){
            this.timeLabel.text = day + "天前";
        }else{
            this.timeLabel.text = "今天";
        }
        
        this.oldData = this.data;
    }


}