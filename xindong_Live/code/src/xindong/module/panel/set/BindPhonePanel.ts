/**
 * 绑定手机
 * @author chenkai 2017/12/27
 */
class BindPhonePanel extends BasePanel {
	private phoneEdit: eui.EditableText;   //电话编辑
	private codeEdit: eui.EditableText;    //验证码编辑

	private getCodeBtn: eui.Button;       //获取验证码
	private bindBtn: eui.Button;          //绑定
	private closeBtn: eui.Button;         //关闭

	private countDownTimer: DateTimer;    //计时器
	private cd: number = 60;              //倒计时时间

	public constructor() {
		super();
		this.skinName = "BindPhonePanelSkin";
	}

	public childrenCreated() {
		this.phoneEdit.text = "";
		this.codeEdit.text = "";
		this.phoneEdit.inputType = egret.TextFieldInputType.TEL;
	}

	public onEnable() {
		this.playEnterAnim();

		CommomBtn.btnClick(this.getCodeBtn, this.onGetCode, this);
		CommomBtn.btnClick(this.bindBtn, this.onBind, this);
		CommomBtn.btnClick(this.closeBtn, this.onClose, this);
	}

	public onRemove() {
		CommomBtn.removeClick(this.getCodeBtn, this.onGetCode, this);
		CommomBtn.removeClick(this.bindBtn, this.onBind, this);
		CommomBtn.removeClick(this.closeBtn, this.onClose, this);
	}

	//获取验证码
	private onGetCode() {
		let account: string = StringTool.trim(this.phoneEdit.text, true);
		if (this.checkPhone(account)) {
			this.reqPhoneCode(account);
		}
	}

	//检查手机号
	private checkPhone(account: string) {
		if (account == "") {
			Tips.info("手机号不能为空");
			return false;
		}
		if (StringTool.checkPhone(account) == false) {
			Tips.info("手机号格式不正确，请重新输入");
			return false;
		}
		return true;
	}

	//检查验证码
	private checkCode(code: string) {
		//检查验证码
		if (code == "") {
			Tips.info("验证码不能为空");
			return false;
		}
		return true;
	}

	/**请求手机验证码 */
	public reqPhoneCode(account: string) {
		let param: any = {};
		param.tel = account;
		let http: HttpSender = new HttpSender();
		http.post(ProtocolHttpUrl.sendCode, param, this.revSendCode, this);

		//设置倒计时
		this.codeCountDown();
	}

	/**返回手机验证码 */
	private revSendCode(data) {
		//不需要处理
	}

	//手机验证码倒计时
	public codeCountDown() {
		//禁用按钮
		this.getCodeBtn.enabled = false;
		this.getCodeBtn.labelDisplay.text = "重新发送" + this.cd;
		//开始计时
		this.startTimer();
	}

	//开始倒计时
	private startTimer() {
		this.countDownTimer || (this.countDownTimer = new DateTimer(1000));
		this.countDownTimer.addEventListener(egret.TimerEvent.TIMER, this.onTimerHandler, this);
		this.countDownTimer.reset();
		this.countDownTimer.start();
	}

	//计时
	private onTimerHandler(e: egret.TimerEvent) {
		let count = this.cd - this.countDownTimer.currentCount;  //剩余时间 
		this.getCodeBtn.labelDisplay.text = "重新发送" + count;

		//倒计时结束
		if (count <= 0) {
			this.stopTimer();
			this.getCodeBtn.enabled = true;
			this.getCodeBtn.labelDisplay.text = "发送验证码";
		}
	}

	//停止倒计时
	private stopTimer() {
		if (this.countDownTimer) {
			this.countDownTimer.stop();
			this.countDownTimer.removeEventListener(egret.TimerEvent.TIMER, this.onTimerHandler, this);
		}
	}

	//点击绑定
	private onBind() {
		let account: string = StringTool.trim(this.phoneEdit.text, true);
		let code: string = StringTool.trim(this.codeEdit.text, true);

		if (this.checkPhone(account) && this.checkCode(code)) {
			this.reqBindTel(account, code);
		}
	}

	//请求绑定
	private reqBindTel(account, code) {
		//TODO 绑定手机
		let http: HttpSender = new HttpSender();
		let param = {
			Authorization: App.DataCenter.skey,
			tel: account,
			code: code
		};
		http.post(ProtocolHttpUrl.telBind, param, this.revBindTel, this);
	}

	//返回绑定
	private revBindTel(data) {
		if (data.code == 200) {
			//保存权鉴定和用户账号
			App.DataCenter.skey = data.data.skey;
			App.DataCenter.UserInfo.account = data.data.user;
			App.DataCenter.UserInfo.role = 1;
			App.LocalStorageUtil.skey = data.data.skey;
			//重置界面
			this.phoneEdit.text = "";
			this.codeEdit.text = "";
			//关闭界面
			this.hide();
			App.PanelManager.open(PanelConst.SetPanel);

			Tips.info("手机绑定成功");
		} else {
			Tips.info(data.info);
		}
	}

	//关闭
	private onClose() {
		this.hide();
		App.PanelManager.open(PanelConst.SetPanel);
	}
}