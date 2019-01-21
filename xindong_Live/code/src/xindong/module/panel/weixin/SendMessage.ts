/**
 * 发送信息组件
 * @author xiongjian
 * @date 2017/8/31
 */

class SendMessage extends BaseUI {

    public sendGroup: eui.Group;   //发送Group
    public unsendGroup: eui.Group; //禁止发送Group

    public send: eui.Button;       //发送按钮
    public unsend: eui.Button;     //禁止发送按钮
    
    public msgLabel:eui.Label;     //要发送的消息文本
    public labelGroup:eui.Group;   //消息文本Group

    public goldGroup:eui.Group;    //金币group
    public goldLabel:eui.Label;    //金币label


    public constructor() {
        super();
        this.skinName = "SendMessageSkin";
    }

    protected childrenCreated(){
        this.goldGroup.visible = false;
    }

    /**添加到场景中*/
    protected onEnable() {
       
    }

    /**从场景中移除*/
    protected onRemove() {

    }

    /**设置文本 */
    public setText(str:string){
        this.msgLabel.text = StringTool.formatStrLen(str,20);
    }

    /**设置金币group */
    public showGold(value:boolean){
        if(value){
            this.goldGroup.visible = true;
            this.labelGroup.visible = false;
        }else{
            this.goldGroup.visible = false;
            this.labelGroup.visible = true;
        }
    }

    /**设置金币text */
    public setGoldText(str){
        this.goldLabel.text = str + "";
    }

    /**显示input 类型 */
    public showInput(value:boolean) {
        if (value){
            this.sendGroup.visible = true;
            this.unsendGroup.visible = false;
        }else {
            this.sendGroup.visible =false;
            this.unsendGroup.visible = true;
        }
    }


}

