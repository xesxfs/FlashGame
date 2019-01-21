/**
 * 聊天列表Item
 * @author xiongjian 
 * @date 2017/8/31
 */
class MessageListItem extends eui.ItemRenderer {

    public Leftname: eui.Label;
    public righname: eui.Label;
    public leftMessage: LeftMessage;
    public rightMessage: RightMessage;

    private oldData;

    public constructor() {
        super();
        this.skinName = "MessageListItemSkin";
    }

    protected dataChanged() {
        if (this.oldData == this.data) {
            return;
        }
        //role 0是服务器 1 是自己
        if (this.data.msg&&this.data.msg.role == 0) {
            
            this.setLeftMessage(this.data.msg.says);
        }

        if (this.data.msg&&this.data.msg.role == 1) {
            let name = App.DataCenter.UserInfo.nickName;
            
            this.setRightMessage(this.data.msg.says);
            this.setRightScore(this.data.msg.score);
        }

        //  console.log(this.data);
        this.oldData = this.data;
    }


    /**设置左边消息 */
    public setLeftMessage(str: string) {
        if (str && str != "") {
            this.leftMessage.visible = true;
            this.rightMessage.visible = false;
            this.leftMessage.setText(str);
            this.leftMessage.setZhuName(App.DataCenter.ConfigInfo.girl_name);

            this.height = this.leftMessage.height;
        }
    }

    /**设置右边消息 */
    public setRightMessage(str: string) {
        if (str && str != "") {
            this.leftMessage.visible = false;
            this.rightMessage.visible = true;
            this.rightMessage.setText(str);

            this.height = this.rightMessage.height;
        }
    }

    /**设置右边心动值 */
    public setRightScore(str){
        if(str !=""){
            this.rightMessage.setHearts(str);
        }
    }

}