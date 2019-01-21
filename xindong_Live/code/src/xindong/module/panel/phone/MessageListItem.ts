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

        console.log("MessageListItem >> 接收到的通话数据", this.data);

        let histVO:TelHistVO = this.data;
        if(histVO.role == 0){
            this.setLeftMessage(histVO.content);
        }else if(histVO.role == 1){
            this.setRightMessage(histVO.content);
            this.setRightScore(histVO.score);
        }


        //role 0是服务器 1 是自己
        // if (this.data.msg&&this.data.msg.role == 0) {
        //     this.setLeftMessage(this.data.msg.content);
        // }

        // if (this.data.msg&&this.data.msg.role == 1) {
        //     this.setRightMessage(this.data.msg.content);
        //     this.setRightScore(this.data.msg.score);
        // }
    }


    /**设置左边消息 */
    public setLeftMessage(str: string) {

        this.leftMessage.visible = true;
        this.rightMessage.visible = false;
        this.leftMessage.setText(str);
        this.leftMessage.setZhuName(App.DataCenter.ConfigInfo.girl_name);

        this.height = this.leftMessage.height;
     
    }

    /**设置右边消息 */
    public setRightMessage(str: string) {
      
        this.leftMessage.visible = false;
        this.rightMessage.visible = true;
        this.rightMessage.setText(str);

        this.height = this.rightMessage.height;
     
    }

    /**设置右边心动值 */
    public setRightScore(str){
        // if(str !=""){
        //     this.rightMessage.setHearts(str);
        // }
    }

}