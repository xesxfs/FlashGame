/**按钮类型 */
enum MessageSelectEnum {
    one,
    two,
    there,
    four
}

/**
 * 底部菜单
 * @author xiongjian
 * @date 2017/9/1
 */
class MessageList extends eui.Component {
    public msg1: eui.Label;
    public msg2: eui.Label;
    public msg3: eui.Label;
    public msg4: eui.Label;

    /**按钮回调 */
    public ok: Function;
    /**执行环境对象 */
    public thisObject:any;

    public constructor() {
        super(); 
    }

    public childrenCreated(){
        this.msg1 && this.msg1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.msg2 && this.msg2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.msg3 && this.msg3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.msg4 && this.msg4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }

    /**设置回调 */
    public setOK(cb:Function, obj:any){
        this.ok = cb;
        this.thisObject = obj;
    }

    /**
     * 将msgBox显示到弹框层，并显示提示信息
     * @param msg 信息
     */
    public showMsg(nexttel:Array<TelNextVo>) {
        App.SoundManager.playEffect(SoundManager.dialogue_pop);

        if (nexttel && nexttel.length == 2) {
            this.skinName = "Message2ListSkin";
            this.msg1.text = nexttel[0].content;
            this.msg2.text = nexttel[1].content;
        }
        if (nexttel && nexttel.length == 3) {
            this.skinName = "Message3ListSkin";
            this.msg1.text = nexttel[0].content;
            this.msg2.text = nexttel[1].content;
            this.msg3.text = nexttel[2].content;
        }
        if (nexttel && nexttel.length == 4) {
            this.skinName = "Message4ListSkin";
            this.msg1.text = nexttel[0].content;
            this.msg2.text = nexttel[1].content;
            this.msg3.text = nexttel[2].content;
            this.msg4.text = nexttel[3].content;
        }
    }

    /**选择答案 */
    private onTouch(e: egret.TouchEvent) {
        var select: MessageSelectEnum;
        switch (e.target) {
            case this.msg1:
                select = MessageSelectEnum.one
                break;
            case this.msg2:
                select = MessageSelectEnum.two;
                break;
            case this.msg3:
                select = MessageSelectEnum.there;
                break;
            case this.msg4:
                select = MessageSelectEnum.four;
                break;
            default:
                break;
        }
        if(this.ok && this.thisObject){
            this.ok.call(this.thisObject, select);
        }
    }

    /**隐藏 */
    public hide() {
        this.parent && this.parent.removeChild(this);
    }
}