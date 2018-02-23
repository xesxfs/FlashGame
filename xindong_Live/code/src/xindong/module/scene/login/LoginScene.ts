/**
 * 登录场景
 * @author chenkai 2017/12/13
 */
class LoginScene extends BaseScene{
	public ctrl:LoginMediator;          //登录代理

	private loginGroup:eui.Group;        //登录Group
	private loginBtn:eui.Button;         //开始按钮
	private sendCodeBtn:eui.Button;      //验证码按钮
	private guestBtn:eui.Button;         //游客登录按钮

	private phoneEdit:eui.EditableText;  //手机号码输入文本
	private codeEdit:eui.EditableText;   //验证码输入文本

	private countDownTimer:DateTimer;    //计时器
	private cd:number = 60;              //倒计时时间

	public constructor(ctrl) {
		super();
		this.skinName = "LoginSceneSkin";
		this.ctrl = ctrl;
	}

	public childrenCreated(){
		
	}

	public onEnable(){
		//初始化界面
		this.phoneEdit.inputType = egret.TextFieldInputType.TEL;
		this.codeEdit.text = "";
		this.phoneEdit.text = "";
		this.loginGroup.visible = false;

		CommomBtn.btnClick(this.loginBtn, this.onLoginTouch, this);
		CommomBtn.btnClick(this.sendCodeBtn, this.onSendCodeTouch, this);
		CommomBtn.btnClick(this.guestBtn, this.onGuestTouch, this);

		//请求公告
		if (StaticCfg.firstLoginScene) {
			this.ctrl.reqNotice();
			StaticCfg.firstLoginScene = false;
		}
		else {
			this.ctrl.checkLoginStatus();
		}
	}

	public onRemove(){
		this.stopTimer();
		CommomBtn.removeClick(this.loginBtn, this.onLoginTouch, this);
		CommomBtn.removeClick(this.sendCodeBtn, this.onSendCodeTouch, this);
		CommomBtn.removeClick(this.guestBtn, this.onGuestTouch, this);
	}

	//显示登录
	public showLogin(){
		this.loginGroup.visible = true;
	}

	//获取手机登录Group是否显示
	public isLoginShow(){
		return this.loginGroup.visible;
	}

	//点击登录
	private onLoginTouch(){
		let account:string = StringTool.trim(this.phoneEdit.text,true);
		let code:string = StringTool.trim(this.codeEdit.text, true);

		if(this.checkPhone(account) && this.checkCode(code)){
			if (App.DeviceUtils.IsNative || (StaticCfg.isDebug && StaticCfg.forceNative) ) {
				// 原生登录
				this.ctrl.reqNativeTelVerify(account, code);
			}
			else {
				// 普通登录
				this.ctrl.reqTelLogin(account, code);
			}
		}
	}

	//点击发送验证码
	private onSendCodeTouch(){
		let account:string = StringTool.trim(this.phoneEdit.text,true);
		if(this.checkPhone(account)){
			this.ctrl.reqPhoneCode(account);
		}
	}

	//检查手机号
	private checkPhone(account:string){
		if(account == ""){
			Tips.info("手机号不能为空");
			return false;
		}
		if(StringTool.checkPhone(account) == false){
			Tips.info("手机号格式不正确，请重新输入");
			return false;
		}
		return true;
	}

	//检查验证码
	private checkCode(code:string){
		//检查验证码
		if(code == ""){
			Tips.info("验证码不能为空");
			return false;
		}
		return true;
	}


	//点击游客登录
	private onGuestTouch(){
		if (App.DeviceUtils.IsNative || (StaticCfg.isDebug && StaticCfg.forceNative) ) {
			App.NativeBridge.sendNativeLogin("");
		}
		else {
			this.ctrl.reqGuestLogin();
		}
	}

	//手机验证码倒计时
	public codeCountDown(){
		//禁用按钮
		this.sendCodeBtn.enabled = false;
		this.sendCodeBtn.labelDisplay.text = "重新发送" + this.cd;
		//开始计时
		this.startTimer();
	}

	//开始倒计时
	private startTimer(){
		this.countDownTimer || (this.countDownTimer = new DateTimer(1000));
		this.countDownTimer.addEventListener(egret.TimerEvent.TIMER, this.onTimerHandler, this);
		this.countDownTimer.reset();
		this.countDownTimer.start();
	}

	//计时
	private onTimerHandler(e:egret.TimerEvent){
		let count = this.cd - this.countDownTimer.currentCount;  //剩余时间 
		this.sendCodeBtn.labelDisplay.text = "重新发送" + count;

		//倒计时结束
		if(count <= 0){
			this.stopTimer();
			this.sendCodeBtn.enabled = true;
			this.sendCodeBtn.labelDisplay.text = "发送验证码";
		}
	}

	//停止倒计时
	private stopTimer(){
		if(this.countDownTimer){
			this.countDownTimer.stop();
			this.countDownTimer.removeEventListener(egret.TimerEvent.TIMER, this.onTimerHandler, this);
		}
	}

	/**销毁 */
	public destoryMe(){
		super.destoryMe();
		this.ctrl = null;

		//销毁计时器
		this.stopTimer();
		this.countDownTimer = null;
	}
}