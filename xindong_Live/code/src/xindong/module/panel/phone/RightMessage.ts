/**
 * 左边消息
 * @author xiongjian 
 * @date 2017/8/31
 */
class RightMessage extends BaseUI {

    public text: eui.Label;
    public myLabel: eui.Label;
    public heartlabel: eui.Label;
    public jiaGroup: eui.Group;
    public jiaImg: eui.Image;
    public jianGroup: eui.Group;
    public jianheartlabel: eui.BitmapLabel;
    public jianImg: eui.Image;
    public labelBG:eui.Image;


    public constructor() {
        super();
        this.skinName = "RightMessageSkin"
        this.setZhuName(App.DataCenter.UserInfo.nickName);
    }

    /**添加到场景中*/
    protected onEnable() {

    }

    /**从场景中移除*/
    protected onRemove() {

    }

    /**设置文本 */
    public setText(str) {
        if (str && str != "") {
            this.text.text = StringTool.formatWrap(str,15);
            this.labelBG.width = this.text.width + 100;
        }
    }

    /**是否显示主角名字 */
    public showName(bo: boolean) {
        if (bo) {
            //this.myLabel.visible = true;
        } else {
            //this.myLabel.visible = false;
        }
    }

    /**心动值设置 */
    public setHearts(num) {
        // if (num != "") {
        //     if (num >= 0) {
        //         this.heartlabel.text = num;
        //         this.jiaGroup.visible = true;
        //         this.jianGroup.visible = false;
        //     } else {
        //         this.jianheartlabel.text = "" + (num * -1);
        //         this.jiaGroup.visible = false;
        //         this.jianGroup.visible = true;
        //     }

        // }
    }

    /**设置主角名字 */
    public setZhuName(str) {
        if (str != "") {
            //this.myLabel.text = str;
        }
    }

}