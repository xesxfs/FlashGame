/**
 * 登录控制模块
 * @author xiongian
 * @date 2017/8/24
 */
class LoginMediator extends Mediator {
    public static NAME: string = "LoginMediator";
    /**显示登录界面 */
    public static SHOW_LOGIN_SCENE: string = "SHOW_LOGIN_SCENE";
    /**登录界面 */
    public loginScene: LoginScene;
    /**输入昵称 */
    public inputPanel: InputNamePanel;

    /**保存账号登录时的账号 */
    private account: string;
    /**保存账号登录时的密码 */
    private password: string;

    public constructor() {
        super();
        this.loginScene = new LoginScene(this);
        App.SceneManager.register(SceneConst.LoginScene, this.loginScene);

        this.inputPanel = new InputNamePanel(this);
        App.PanelManager.register(PanelConst.InputNamePanel, this.inputPanel);
    }

    public onRegister() {
        this.addEvent(LoginMediator.SHOW_LOGIN_SCENE, this.showLoginScene, this);
    }

    public unRegister() {
        this.removeEvent(LoginMediator.SHOW_LOGIN_SCENE, this.showLoginScene, this);
    }

    /**显示登录界面 */
    private showLoginScene() {
        App.SceneManager.open(SceneConst.LoginScene);
    }

    /**请求公告 */
    public reqNotice() {
        let http: HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.attention, {}, this.revNotice, this);
    }

    /**接收公告 */
    private revNotice(data) {
        let json = data;
        //保存微信和qq
        App.DataCenter.UserInfo.wechat = json.data.wechat;
        App.DataCenter.UserInfo.qq = json.data.qq;
        //弹出公告框
        let noticeDialog: NoticeDialog = new NoticeDialog();
        noticeDialog.setTitle(json.data.title);
        noticeDialog.setContent(json.data.content);
        noticeDialog.setWx(json.data.wechat, json.data.qq);
        noticeDialog.setOk(() => {
            this.checkLoginStatus();
        }, this);
        noticeDialog.show();
    }

    /**检查登录状态 */
    public checkLoginStatus() {
        let loginType: string = App.LocalStorageUtil.loginType;
        let account: string = App.LocalStorageUtil.account;
        let skey: string = App.LocalStorageUtil.skey;

        // 可自动登录,游客不能自动登录
        if (account && skey && loginType == LoginType.Account) {
            console.log("LoginMediator >> 自动登录")
            App.DataCenter.skey = App.LocalStorageUtil.skey;
            App.DataCenter.UserInfo.account = App.LocalStorageUtil.account;
            this.reqGameInfo();
        }
        else {
            console.log("LoginMediator >> 不自动登录")
            this.loginScene.showLogin();
        }
    }

    /**请求游客登录 */
    public reqGuestLogin() {
        console.log("LoginMediator >> 游客登录");
        var http = new HttpSender();
        var data = ProtocolHttp.guest;
        data.username = App.LocalStorageUtil.account;
        data.channel_id = 0;
        http.post(ProtocolHttpUrl.guest, data, this.revGuestLogin, this);
    }

    /**游客登录返回 */
    private revGuestLogin(data) {
        var json = ProtocolHttpData.guest;
        json = data;
        if (json.code == 200) {
            App.DataCenter.skey = json.data.skey;
            App.DataCenter.UserInfo.account = json.data.user;
            App.LocalStorageUtil.account = json.data.user;
            App.LocalStorageUtil.skey = json.data.skey;
            App.LocalStorageUtil.loginType = LoginType.Guest;
            this.reqGameInfo();
        } else {
            Tips.info(data.info);

            //游客登录错误，清理掉游客缓存
            App.LocalStorageUtil.account = "";
            this.loginScene.showLogin();

        }
    }

    /**请求手机账号登录 */
    public reqTelLogin(account: string, code: string) {
        console.log("LoginMediator >> 手机账号登录");
        var data: any = {};
        data.tel = account;
        data.code = code;
        data.channel_id = 0;
        data.fid = "";
        let http: HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.telLogin, data, this.revTelLogin, this);
    }

    /**账号登录返回 */
    private revTelLogin(data) {
        var json: any = data;
        if (json.code == 200) {
            App.LocalStorageUtil.account = json.data.user;
            App.DataCenter.UserInfo.account = json.data.user;
            App.DataCenter.skey = json.data.skey;
            App.LocalStorageUtil.account = json.data.user;
            App.LocalStorageUtil.skey = json.data.skey;
            App.LocalStorageUtil.loginType = LoginType.Account;

            this.reqGameInfo();
        } else {
            App.LocalStorageUtil.skey = "";
            Tips.info(data.info);
        }
    }

    /**请求原生短信验证 */
    public reqNativeTelVerify(account: string, code: string) {
        console.log("LoginMediator >> 手机账号验证");
        var data: any = {};
        data.tel = account;
        data.code = code;
        let http: HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.loginVerify, data, this.revNativeTelVerify, this);
    }

    /**返回原生短信验证 */
    private revNativeTelVerify(data) {
        if (data.code == 200) {
            App.NativeBridge.sendNativeLogin(data.data.user);
        } else {
            Tips.info(data.info);
        }
    }

    /**请求原生登录 */
    public reqNativeLogin(data) {
        let http: HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.loginNative, data, this.revNativeLogin, this);
    }

    /**原生登录返回 */
    private revNativeLogin(data) {
        if (data.code == 200) {
            App.LocalStorageUtil.account = data.data.user;
            App.DataCenter.UserInfo.account = data.data.user;
            App.DataCenter.skey = data.data.skey;
            App.LocalStorageUtil.account = data.data.user;
            App.LocalStorageUtil.skey = data.data.skey;
            App.LocalStorageUtil.loginType = LoginType.Account;

            this.reqGameInfo();
        } else {
            Tips.info(data.info);
        }
    }

    /**请求手机验证码 */
    public reqPhoneCode(account: string) {
        let param: any = {};
        param.tel = account;
        let http: HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.sendCode, param, this.revSendCode, this);

        //设置倒计时
        this.loginScene.codeCountDown();
    }

    /**返回手机验证码 */
    private revSendCode(data) {
        //不需要处理
    }

    /**请求游戏信息 */
    public reqGameInfo() {
        if (App.SceneManager.getCurScene() instanceof LoginScene) {
            let http = new HttpSender();
            let param = {};
            http.post(ProtocolHttpUrl.gameinfo, param, this.revGameInfo, this);
        }
    }

    /**返回游戏信息*/
    private revGameInfo(data) {
        if (data.code == 200) {
            App.DataCenter.readGameInfo(data);
            this.reqGuide();
        } else {
            // 失败时清理skey,account
            App.DataCenter.skey = "";
            App.DataCenter.UserInfo.account = "";
            App.LocalStorageUtil.account = "";
            App.LocalStorageUtil.loginType = "";
            Tips.info(data.info);
            this.loginScene.showLogin();
        }
    }

    /**请求引导 */
    private reqGuide() {
        console.log("LoginMediator >> 接收引导:", App.DataCenter.guide);
        let guide = App.DataCenter.guide;
        let type = guide.emph_zone;
        //判断昵称、视频。如果都没有则进入游戏界面
        if (guide.fill_nick_name) {
            App.PanelManager.open(PanelConst.InputNamePanel);
        } else if (guide.video) {
            let http = new HttpSender();
            let param = { vname: guide.video };
            http.post(ProtocolHttpUrl.videoUrl, param, this.revVideoPlay, this);
        } else {
            console.log("LoginMediator >> 准备进入大厅");
            App.PanelManager.close(PanelConst.InputNamePanel);

            //跳转到游戏界面
            App.EventManager.sendEvent(GameMediator.SHOW_GAME_SCENE);
        }
    }

    /**接收视频播放结果 */
    public revVideoPlay(data) {
        if (data.code == 200) {
            //TODO 登录页播放视频，不需要弹框确认，但是h5端不支持主动播放，需要弹框确认。
            // let sureDialog:SureDialog = new SureDialog();
            // sureDialog.setContent("测试版-样片");
            // sureDialog.setOk(()=>{
            this.delayGuideBack();
            App.NativeBridge.sendPlayVideo(VideoType.mem, data.data.url);
            // },this);
            // sureDialog.show();
        } else {
            Tips.info(data.info);
        }
    }

    /**延迟请求引导 */
    private delayGuideBack() {
        //延迟请求引导，在播放视频后再请求引导，跳转界面，这样不会因为切换界面而闪动。
        egret.Tween.get(this).wait(1000).call(() => {
            this.guideBack();
        }, this);
    }

    /**引导视频结束 */
    private guideBack() {
        if (App.DataCenter.guide.video) {
            this.reqGuideDone();
        }
    }

    /**完成引导 */
    public reqGuideDone() {
        let http = new HttpSender();
        let param = {};
        http.post(ProtocolHttpUrl.guideDone, param, this.revGuideDone, this);
    }

    /**引导完成返回 */
    private revGuideDone(data) {
        if (data.code == 200) {
            App.DataCenter.dianhuaGuide = false;
            App.DataCenter.guide.fill_nick_name = data.data.fill_nick_name;
            App.DataCenter.guide.emph_zone = data.data.emph_zone;
            App.DataCenter.guide.video = data.data.video;

            this.reqGuide();
        } else {
            Tips.info(data.info);
        }
    }
}