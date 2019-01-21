/**
 * 登录界面
 * @author xiongjian
 * @date 2017/08/24
 */
class LoginScene extends BaseScene {
    private ctrl: LoginMediator;     //控制模块

    private startBtn: eui.Button;    //开始按钮
    public nameLabel: eui.Label;     //账号文本
    public registerBtn: eui.Button;  //注册按钮
    public loginBtn: eui.Button;     //登录按钮
    private account: string = "";    //上次登录账号

    public constructor(ctrl:LoginMediator) {
        super();
        this.skinName = "LoginSceneSkin";
        this.ctrl = ctrl;
    }

    public onEnable() {
        //初始化界面
        this.account = App.LocalStorageUtil.username;
        this.nameLabel.text = App.LocalStorageUtil.username;
        this.startBtn.alpha = 0;

        //按钮监听
        CommomBtn.btnClick(this.registerBtn, this.registerTouch, this);
        CommomBtn.btnClick(this.loginBtn, this.loginTouch, this);

        //公告
        this.reqNotice();
    }

    public onRemove() {
        CommomBtn.removeClick(this.registerBtn, this.registerTouch, this);
        CommomBtn.removeClick(this.loginBtn, this.loginTouch, this);
    }

    /**请求公告 */
    private reqNotice(){
        let http:HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.attention, {}, this.revNotice, this);
    }

    /**接收公告 */
    private revNotice(data){
        let json = ProtocolHttpData.attention;
        json = data;

        //弹出公告框
        let noticeDialog:NoticeDialog = new NoticeDialog();
        noticeDialog.setContent(json.data.content);
        noticeDialog.setNoticeTitle(json.data.title);
        noticeDialog.setWx(json.data.wechat, json.data.qq);
        noticeDialog.setOk(()=>{
            this.moveBtn();
        }, this);
        noticeDialog.show();
    }

    /**按钮动画 */
    private moveBtn() {
        egret.Tween.get(this.startBtn).set({y: 627, alpha: 0.4 })
            .to({y: 547, alpha: 1 }, 500)
            .to({y: 577 }, 300)
            .call(() => {
                egret.Tween.removeTweens(this.startBtn);
                CommomBtn.btnClick(this.startBtn, this.gotoGame, this, 1);
            },this);
    }


    /**登录 如果已经注册过，就账号密码登录 */
    private gotoGame() {
        console.log(window["auth"]);

        //7k7k渠道登陆
        let auth_7k7k = window["auth_7k7k"];
        if(auth_7k7k){
            this.ctrl.req7k7kLogin();
            return false;
        }
        
        //本地缓存账号密码登录
        if (App.LocalStorageUtil.guest == GuestType.NO) {
            let account:string = App.LocalStorageUtil.account;
		    let password:string = App.LocalStorageUtil.password;
            this.ctrl.reqAccountLogin(account, password);
        //游客登录
        } else {
            this.ctrl.reqGuestLogin();
        }
    }

    /**注册按钮点击 */
    private registerTouch() {
        App.PanelManager.open(PanelConst.RegisterPanel);
    }

    /**登录按钮点击 */
    private loginTouch() {
        App.PanelManager.open(PanelConst.LoginPanel);
    }
    

    

   

    

    

    

    

    
}
