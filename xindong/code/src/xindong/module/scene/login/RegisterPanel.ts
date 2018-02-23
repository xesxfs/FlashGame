/**
 *登录面板
 * @author xiongjian
 * @date 2017/08/24
 */
class RegisterPanel extends BasePanel {
    private ctrl:LoginMediator;

    private backBtn: eui.Button;          //返回
    public registerBtn: eui.Button;       //注册
    public nameEdit: eui.EditableText;    //账号
    public mimaEdit: eui.EditableText;    //密码
    public mima2Edit: eui.EditableText;   //确认密码


    public constructor(ctrl:LoginMediator) {
        super();
        this.skinName = "RegisterPanelSkin";
        this.ctrl = ctrl;
    }

    public onEnable() {
        CommomBtn.btnClick(this.registerBtn,this.register,this);
        CommomBtn.btnClick(this.backBtn,this.backTouch,this,2);
    }
    public onRemove() {
        CommomBtn.removeClick(this.registerBtn,this.register,this);
        CommomBtn.removeClick(this.backBtn,this.backTouch,this);
    }

    /**注册 */
    private register() {
        let name = StringTool.trim(this.nameEdit.text,true);
        let mimaEdit = StringTool.trim(this.mimaEdit.text, true);
        let mima2Edit = StringTool.trim(this.mima2Edit.text, true);

        if (name != "" && mimaEdit != "" && mima2Edit != "") {
            if (mimaEdit == mima2Edit) {
                this.ctrl.reqRegister(name, mimaEdit);
            } else {
                Tips.info("两次密码不一致");
            }
        } else {
            Tips.info("账号或密码不能为空");
        }
    }

    /**返回 */
    private backTouch() {
        this.hide();
    }
}