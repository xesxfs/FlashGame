/**
 * APP代理，处理系统级别事件
 * @author chenkai 2017/12/31
 */
class AppMediator extends Mediator{
	public static NAME:string = "AppMediator";


	public constructor() {
		super();
	}

	public onRegister(){
		this.addEvent(EventConst.HTTP_ERROR, this.onHttpError, this);
		this.addEvent(EventConst.LOGIN_OUT, this.onLoginOut, this);
	}

	public onRemove(){
		this.removeEvent(EventConst.HTTP_ERROR, this.onHttpError, this);
		this.removeEvent(EventConst.LOGIN_OUT, this.onLoginOut, this);
	}

	/**
	 * http请求错误
	 * @param url 请求链接
	 * @param paramObj 请求参数
	 * @param cb 回调函数
	 * @param obj 回调执行对象
	 */
	private onHttpError(url: string, paramObj: Object, cb: Function, obj: any){
		//弹框提示
		let dialog:SureDialog = new SureDialog();
		dialog.setOk(()=>{
			let http:HttpSender = new HttpSender();
			http.post(url, paramObj, cb, obj);
		},this);
		dialog.setContent("网络无法连接，请检查您的网络后重试");
		dialog.show();
	}

	/**登出游戏 */
	private onLoginOut(){
		// 清除缓存
		App.LocalStorageUtil.account = "";
    	App.LocalStorageUtil.skey = "";
		//销毁场景
        App.SceneManager.destoryAll();
        //销毁弹框
        App.PanelManager.destoryAll();
        //清理所有事件
        App.EventManager.removeAllEvent();
        //注销所有Mediator
        let app:App = App.getInstance();
		app.removeMediator(AppMediator.NAME);
        app.removeMediator(LoadMediator.NAME);
        app.removeMediator(LoginMediator.NAME);
        app.removeMediator(GameMediator.NAME);
        //停止所有资源加载
        App.ResUtils.deleteAllCallBack();
        //停止背景音乐
        App.SoundManager.stopBGM();
        
        //销毁数据
        App.DataCenter.destoryMe();

        //TODO  停止Http请求回调，Http都是单个，无法停止

        //停止语音播放
        App.TalkManager.stopSound();
        
        //重新注册Mediator
		app.registerMediator(AppMediator.NAME, new AppMediator());
        app.registerMediator(LoadMediator.NAME, new LoadMediator());
        app.registerMediator(LoginMediator.NAME, new LoginMediator());
        app.registerMediator(GameMediator.NAME, new GameMediator());

        //打开登录场景
        App.SceneManager.open(SceneConst.LoginScene);
	}
}