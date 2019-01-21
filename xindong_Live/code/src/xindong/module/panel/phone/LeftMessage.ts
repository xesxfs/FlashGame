/**
 * 左边消息
 * @author xiongjian 
 * @date 2017/8/31
 */
class LeftMessage extends BaseUI {

    public text: eui.Label;
    public zhuname: eui.Label;//主角名字
    public talkImg: eui.Image;
    public zhuImg: eui.Image;
    public labelBG:eui.Image;

    public constructor() {
        super();
        this.skinName = "LeftMessageSkin"
    }

    /**添加到场景中*/
    protected onEnable() {
        this.setImg(RES.getRes(App.DataCenter.telInfo.head));
    }

    /**从场景中移除*/
    protected onRemove() {

    }

    /**设置文本 */
    public setText(str: string) {
        if (str && str != "") {
            this.text.text = StringTool.formatWrap(str,15);
            this.labelBG.width = this.text.width + 100;
        }
    }

    /**设置主角名字 */
    public setZhuName(str) {
        this.zhuname.text = str;
    }

    /**是否显示主角名字 */
    public showName(bo: boolean) {
        if (bo) {
            this.zhuname.visible = true;
        } else {
            this.zhuname.visible = false;
        }
    }

    /**是否显示talk图标 */
    public showTalk(boo) {
        if (boo) {
            this.talkImg.visible = true;
        } else {
            this.talkImg.visible = false;
        }
    }

    /**设置主角头像 */
    public setImg(url) {
        this.zhuImg.source = url;
    }

}