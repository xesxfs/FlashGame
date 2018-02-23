/**按钮类型 */
enum MessageListName {
    one,
    two,
    there,
    four,
    bage
}


/**
 * 底部菜单
 * @author xiongjian
 * @date 2017/9/1
 */

class MessageList extends BaseUI {

    public static NAME: string = "MessageList";
  
    private click;//背景是否可点击

    public bgrect:eui.Rect;

    public msg1Group: eui.Group;

    public msg2Group: eui.Group;

    public msg3Group: eui.Group;
    public msg1: eui.Label;
    public msg2: eui.Label;
    public msg3: eui.Label;
    public msg4Group: eui.Group;
    public msg4: eui.Label;

    public bgImg: eui.Image;
    public bgGroup: eui.Group;

    /**按钮回调 */
    public ok: Function;
    /**执行环境对象 */
    public thisObject;

    public constructor() {
        super();
        this.touchEnabled = true;
    }

    /**添加到场景中*/
    protected onEnable() {
        this.bgrect.addEventListener(egret.TouchEvent.TOUCH_TAP,this.bgTouch,this);
    }

    /**移除场景 */
    protected onRemove() {
        this.bgrect.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.bgTouch,this);
    }

    public setOK(cb:Function, obj:any){
        this.ok = cb;
        this.thisObject = obj;
    }

    /**
     * 将msgBox显示到弹框层，并显示提示信息
     * @param msg 信息
     */
    public showMsg(doc:egret.DisplayObjectContainer, msg: any, x = 0, y = 0,click=true) {
        this.click = click;
        if (this.parent == null) {

            //App.LayerManager.msgLayer.addChild(this);
            doc.addChild(this);
            App.SoundManager.playEffect(SoundManager.dialogue_pop);


        }

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

        if (msg && msg.length == 2) {
            this.msg1.text = msg[0].says;
            this.msg2.text = msg[1].says;
            this.msg1.fontFamily = "fzyc"
            this.msg2.fontFamily = "fzyc"
        }
        if (msg && msg.length == 3) {
            this.msg1.text = msg[0].says;
            this.msg2.text = msg[1].says;
            this.msg3.text = msg[2].says;
            this.msg1.fontFamily = "fzyc"
            this.msg2.fontFamily = "fzyc"
            this.msg3.fontFamily = "fzyc"
        }
        if (msg && msg.length == 4) {
            this.msg1.text = msg[0].says;
            this.msg2.text = msg[1].says;
            this.msg3.text = msg[2].says;
            this.msg4.text = msg[3].says;
            this.msg1.fontFamily = "fzyc"
            this.msg2.fontFamily = "fzyc"
            this.msg3.fontFamily = "fzyc"
            this.msg4.fontFamily = "fzyc"
        }

        this.bgImg.height = this.bgGroup.height + 22;
        if (x == 0 && y == 0) {
            this.bgImg.x=(App.StageUtils.stageWidth - this.bgGroup.width) / 2;
            this.bgImg.y=(App.StageUtils.stageHeight - this.bgGroup.height) / 2;
            this.bgGroup.x = (App.StageUtils.stageWidth - this.bgGroup.width) / 2;
            this.bgGroup.y = (App.StageUtils.stageHeight - this.bgGroup.height) / 2;
        } else {
            this.bgGroup.x = x;
            this.bgGroup.y = y - this.bgImg.height + 90;
             this.bgImg.x = x;
            this.bgImg.y = y - this.bgImg.height + 90;
        }
    }

    /**底部按钮的响应 */
    private onTouch(e: egret.TouchEvent) {
        var messageList: MessageListName;
        switch (e.target) {
            case this.msg1Group:
                messageList = MessageListName.one

                break;
            case this.msg2Group:
                messageList = MessageListName.two;

                break;
            case this.msg3Group:
                messageList = MessageListName.there;

                break;
            case this.msg4Group:
                messageList = MessageListName.four;

                break;
            default:
                break;
        }
        //this.ok && this.ok(messageList) && (this.ok.call(messageList));
        if(this.ok && this.thisObject){
            this.ok.call(this.thisObject, messageList);
        }
    }

    /**背景点击 */
    private bgTouch(){
        if(this.click){
            var messageList: MessageListName;
            // App.MessageListManager.recycleAllBox();
            messageList = MessageListName.bage;
             //this.ok && this.ok(messageList) && (this.ok.call(messageList));
             if(this.ok && this.thisObject){
                this.ok.call(this.thisObject, messageList);
            }
        }
    }

    //隐藏并回收消息框
    public hideAndRecycle() {
        
        egret.Tween.removeTweens(this);
        this.ok = null;
        this.thisObject = null;
        this.hide();
    }

    //隐藏
    public hide() {
        
        this.parent && this.parent.removeChild(this);
        this.removeChildren();
    }
}