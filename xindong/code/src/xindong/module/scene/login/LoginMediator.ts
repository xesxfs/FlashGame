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
    /**账号登录 */
    public loginPanel:LoginPanel;
    /**注册登录 */
    public registerPanel:RegisterPanel;
    /**输入昵称 */
    public inputPanel:InputNamePanel;

    /**保存账号登录时的账号 */
    private account:string;
    /**保存账号登录时的密码 */
    private password:string;

	public constructor() {
		super();
		this.loginScene = new LoginScene(this);
		App.SceneManager.register(SceneConst.LoginScene, this.loginScene);

        this.loginPanel = new LoginPanel(this);
        App.PanelManager.register(PanelConst.LoginPanel, this.loginPanel);

        this.registerPanel = new RegisterPanel(this);
        App.PanelManager.register(PanelConst.RegisterPanel, this.registerPanel);

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

    /**请求注册 */
    public reqRegister(account, password){
        console.log("RegisterPanel >> 注册登录");
        this.account = account;
        this.password = password;

        var http = new HttpSender();
        let data = ProtocolHttp.register;
        data.passwd = password;
        data.username = account;
        data.channel_id = App.DataCenter.channelInfo.getChannel();
        //这里逻辑有问题。如果用户之前游客登录，则无法选择注册新账号玩，只能强制绑定游客账户。
        // let guest = App.LocalStorageUtil.guest;
        // if (guest && guest == GuestType.YES) {
        //     data.guest = App.LocalStorageUtil.account;
        // }
        http.post(ProtocolHttpUrl.register, data, this.revRegister, this);
    }

    /**注册返回 */
    private revRegister(data) {
        var json = ProtocolHttpData.register;
        json = data;
        if (json.code == 200) {
            //持久化保存用户资料
            App.LocalStorageUtil.account = json.data.user;
            App.LocalStorageUtil.password = this.password;
            App.DataCenter.skey = json.data.skey;
            App.LocalStorageUtil.guest = GuestType.NO;
            
            this.reqGameInfo();
        } else {
            Tips.info(data.info);
        }
    }

	/**请求账号登录 */
	public reqAccountLogin(account:string, password:string){
        console.log("LoginMediator >> 账号登录");
        this.account = account;
        this.password = password;

		var http = new HttpSender();
		var data = ProtocolHttp.login;
        data.username = account;
        data.passwd =  this.password;
        data.channel_id = App.DataCenter.channelInfo.getChannel();
		http.post(ProtocolHttpUrl.login, data, this.revAccountLogin, this);
	}

    /**7k7k登录 */
	public req7k7kLogin(){
        console.log("LoginMediator >> 7k7k登录");
		let auth_7k7k = window["auth_7k7k"];
		let http =  new HttpSender();
		http.post(ProtocolHttpUrl.k7k7_login, auth_7k7k, this.revAccountLogin, this);
		return false;
	}

	/**账号登录返回 */
    private revAccountLogin(data) {
        var json = ProtocolHttpData.login;
        json = data;
        if (json.code == 200) {
            App.LocalStorageUtil.account = json.data.user;
            App.LocalStorageUtil.password = this.password;
            App.DataCenter.skey = json.data.skey;
            App.DataCenter.UserInfo.nickName = json.data.user;
            App.LocalStorageUtil.guest = GuestType.NO;
            
            this.reqGameInfo();
        } else {
            Tips.info(data.info);
        }
    }

	/**请求游客登录 */
	public reqGuestLogin(){
        console.log("LoginMediator >> 游客登录");
		var http = new HttpSender();
		var data = ProtocolHttp.guest;
		data.username = App.LocalStorageUtil.account;
        data.channel_id = App.DataCenter.channelInfo.getChannel();
		http.post(ProtocolHttpUrl.guest, data, this.revGuestLogin, this);
	}

	/**游客登录返回 */
    private revGuestLogin(data) {
        var json = ProtocolHttpData.guest;
        json = data;
        if (json.code == 200) {
            App.DataCenter.skey = json.data.skey;
            App.DataCenter.UserInfo.nickName = json.data.user;
            App.LocalStorageUtil.account = json.data.user;
            App.LocalStorageUtil.guest = GuestType.YES;
            this.reqGameInfo();
        } else {
            Tips.info(data.info);
        }
    }

   /**请求游戏信息 */
    public reqGameInfo(){
        if(App.SceneManager.getCurScene() instanceof LoginScene){
            let http = new HttpSender();
            let param = {};
            http.post(ProtocolHttpUrl.gameinfo, param, this.revGameInfo, this);
        }
    }

	/**返回游戏信息*/
    private revGameInfo(data) {
        if (data.code == 200) {
            App.DataCenter.preLoadImg(data, this.loginScene);
            App.DataCenter.readGameInfo(data);
            this.reqGuide();
        }else{
            Tips.info(data.info);
        }
    }

	/**请求引导 */
    private reqGuide(){
        let guide = App.DataCenter.guide;
        let type = guide.emph_zone;
        //判断昵称、视频。如果都没有则进入游戏界面
        if(guide.fill_nick_name){
            App.PanelManager.open(PanelConst.InputNamePanel);
        }else if (guide.video) {
            //ios app 视频请求
             if (App.DeviceUtils.IsIos && App.DeviceUtils.IsNative) {
                let http = new HttpSender();
                let param = { ossvid: guide.video };
                http.post(ProtocolHttpUrl.videoPlay, param, this.revVideoPlay, this);
            //android app 和web 视频请求
            } else {
                let http = new HttpSender();
                let param = { ossvid: guide.video };
                http.post(ProtocolHttpUrl.videoUrl, param, this.revVideoPlay, this);
            }
        }else{
            App.PanelManager.close(PanelConst.RegisterPanel);
            App.PanelManager.close(PanelConst.InputNamePanel);
            App.PanelManager.close(PanelConst.LoginPanel);
            
            //跳转到游戏界面
            App.EventManager.sendEvent(GameMediator.SHOW_GAME_SCENE);
        }
    }

	/**接收视频播放结果 */
    public revVideoPlay(data) {
        if (data.code == 200) {
            //ios app
            if(App.DeviceUtils.IsNative && App.DeviceUtils.IsIos){
                this.delayGuideBack();
                App.NativeBridge.sendPlayVideo(VideoType.mem, data.data);
            //android app
            }else if(App.DeviceUtils.IsNative && App.DeviceUtils.IsAndroid){
                this.delayGuideBack();
                App.NativeBridge.sendPlayVideo(VideoType.mem, data.data.url);
            //web mobile
            }else if(App.DeviceUtils.IsWeb && App.DeviceUtils.isMobile){
                //移动web补充一个视频播放提示，否则无法自动播放
                let dialog:PlayVideoDialog = new PlayVideoDialog();
                dialog.setContent("我是一个普通的大学生，做梦也没想到校花竟然成为了我的女朋友，但是现实中的误会却让我们一次次伤害对方……");
                dialog.setOk(()=>{
                    this.delayGuideBack();
                    App.EventManager.sendEvent(EventConst.PLAY_WEB_VIDEO, data.data.url);
                },this);
                dialog.show();
            //web pc
            }else{
                this.delayGuideBack();
                App.EventManager.sendEvent(EventConst.PLAY_WEB_VIDEO, data.data.url);
            }
        } else {
            Tips.info(data.info);
        }
    }

	/**延迟请求引导 */
    private delayGuideBack(){
        //延迟请求引导，在播放视频后2s再请求引导，跳转界面，这样不闪。
        let t = setTimeout(() => {
            clearTimeout(t);
            this.guideBack();
        }, 2000);
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
            Tips.info("" + data.info);
        }
    }
}