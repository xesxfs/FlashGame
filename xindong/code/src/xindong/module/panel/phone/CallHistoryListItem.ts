/**
 * 电话历史聊天列表Item
 * @author xiongjian 
 * @date 2017/9/7
 */
class CallHistoryListItem extends eui.ItemRenderer {


    public leftMessage: LeftMessage;
    public rightMessage: RightMessage;

    private oldData;

    public constructor() {
        super();
        this.skinName = "CallHistoryListItemSkin";
        this.leftMessage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.talkImgTouch, this);
    }


    /**说话按钮点击 */
    private talkImgTouch() {
        if (this.data.audio) {
            let url = this.data.audio
            App.TalkManager.soundPlay(url);
        }
    }

    protected dataChanged() {
        if (this.oldData == this.data) {
            return;
        }
        //role 0是服务器 1 是自己
        if (this.data && this.data.role == 0) {
            
            this.setLeftMessage(this.data.says);
            this.leftMessage.setZhuName(App.DataCenter.ConfigInfo.girl_name);
            this.leftMessage.showName(true);
            this.leftMessage.showTalk(true);
        }

        if (this.data && this.data.role == 1) {
            let name = App.DataCenter.UserInfo.nickName;
            
            this.setRightMessage(this.data.says);
            this.rightMessage.setHearts(this.data.score);
        }

        this.oldData = this.data;
    }



    /**设置左边消息 */
    public setLeftMessage(str: string) {
        if (str && str != "") {
            this.leftMessage.visible = true;
            this.rightMessage.visible = false;
            this.leftMessage.setText(str);

        }
    }

    /**设置右边消息 */
    public setRightMessage(str: string) {
        if (str && str != "") {
            this.leftMessage.visible = false;
            this.rightMessage.visible = true;
            this.rightMessage.setText(str);
            
        }
    }



}