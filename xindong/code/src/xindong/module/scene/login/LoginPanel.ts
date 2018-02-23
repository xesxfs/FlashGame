/**
 *登录面板
 * @author xiongjian
 * @date 2017/08/24
 */
class LoginPanel extends BasePanel {
    private ctrl:LoginMediator;

    private backBtn: eui.Button;               //返回
    private loginBtn: eui.Button;              //登录
    private accountLabel: eui.EditableText;    //账号
    private passwordLabel: eui.EditableText;   //密码

    public constructor(ctrl:LoginMediator) {
        super();
        this.skinName = "LoginPanelSkin";
        this.ctrl = ctrl;
    }

    public onEnable() {
        CommomBtn.btnClick(this.loginBtn, this.onLoginTouch, this);
        CommomBtn.btnClick(this.backBtn, this.onBackTouch, this, 2);
    }
    public onRemove() {
        CommomBtn.removeClick(this.loginBtn, this.onLoginTouch, this);
        CommomBtn.removeClick(this.backBtn, this.onBackTouch, this);
    }

    /**登录 */
    private onLoginTouch() {
        //去掉所有空格 (某些iphone测试时有bug，输入字母会自动在字母间加入空格，所以要去掉所有空格)
        let account = StringTool.trim(this.accountLabel.text, true);
        let password = StringTool.trim(this.passwordLabel.text, true);

        if (account != "" && password != "") {
            //请求登录
            this.ctrl.reqAccountLogin(account, password);
        } else {
            Tips.info("账号或密码为空");
        }
    }

    /**返回 */
    private onBackTouch() {
        this.hide();
    }
}