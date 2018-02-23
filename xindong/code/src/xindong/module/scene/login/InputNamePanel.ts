/**
 * 输入昵称面板
 * @author xiongjian
 * @date 2017/10/12
 */
class InputNamePanel extends BasePanel {
    public ctrl:LoginMediator;

    public startBtn: eui.Button;
    public zhanghaoEdit: eui.EditableText;
    public shaiziBtn: eui.Button;


    public constructor(ctrl:LoginMediator) {
        super();
        this.skinName = "InputNamePanelSkin";
        this.ctrl = ctrl;
    }


    /**添加到场景中*/
    public onEnable() {
        console.log("InputNamePanel >> 进入昵称界面");
        CommomBtn.btnClick(this.startBtn, this.startBtnTouch, this);
        CommomBtn.btnClick(this.shaiziBtn, this.shaiziBtnTouch, this);
    }

    /**从场景中移除*/
    public onRemove() {
        CommomBtn.removeClick(this.startBtn, this.startBtnTouch, this);
        CommomBtn.removeClick(this.shaiziBtn, this.shaiziBtnTouch, this);
    }

    /**确定按钮点击 */
    private startBtnTouch() {
        if (this.zhanghaoEdit.text != "") {
            let http = new HttpSender();
            let param = { nick_name: "" }
            param.nick_name = this.zhanghaoEdit.text;
            http.post(ProtocolHttpUrl.nameBind, param, this.bindNameBack, this);
        } else {
            Tips.info("请输入昵称");
        }

    }

    /**筛子点击 */
    private shaiziBtnTouch() {
        let http = new HttpSender();
        let param = {}
        http.post(ProtocolHttpUrl.randomName, param, this.randomNameBack, this);
    }

    /**绑定名字 */
    private bindNameBack(data) {
        if (data.code == 200) {
            App.DataCenter.UserInfo.nickName = data.data.name;
            App.LocalStorageUtil.nickName = data.data.name;
            
            this.ctrl.reqGuideDone();
        } else {
            Tips.info("" + data.info);
        }
    }

    /**随机生成名字 */
    private randomNameBack(data) {
        if (data.code == 200) {
            this.zhanghaoEdit.text = data.data.name;
        } else {
            Tips.info("" + data.info);
        }
    }

}