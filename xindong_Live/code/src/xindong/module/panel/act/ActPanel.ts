/**
 * 活动中心
 * @author chenkai
 * @date 2017/11/27
 */
class ActPanel extends BasePanel{
	public topMenu:TopMenu;            //顶部菜单

	private radioBtn:eui.RadioButton;   //单选按钮
	private viewStack:eui.ViewStack;    //页面容器

	private pageLogin:PageLoginUI;      //登录有奖
	private pageLucky:PageLuckyUI;      //幸运抽奖
	private pageDouble:PageDoubleUI;    //首冲双倍
	private pageFirst:PageFirstUI;      //首冲礼包
	private exchange:PageExchangeUI;    //礼包兑换


	private radioBtn0:eui.RadioButton;  //登录有奖 
	private radioBtn1:eui.RadioButton;  //幸运抽奖
	private radioBtn2:eui.RadioButton;  //首冲双倍
	private radioBtn3:eui.RadioButton;  //首冲礼包
	private radioBtn4:eui.RadioButton;  //礼包兑换
	private radioList;                  //单选按钮数组

	public constructor() {
		super();
		this.skinName = "ActPanelSkin";
	}

	public childrenCreated(){
		//初始化
		this.radioList = [this.radioBtn0, this.radioBtn1, this.radioBtn2, this.radioBtn3, this.radioBtn4];
	}

	public onEnable(data:any = null){
		//隐藏登录有奖
		if(App.DataCenter.actInfo.login_on == false){
			this.radioBtn0.parent && this.radioBtn0.parent.removeChild(this.radioBtn0);
			this.switchPage(0);
		}
		//隐藏首充值礼包
		if(App.DataCenter.actInfo.fpay_on == false){
			this.radioBtn2.parent && this.radioBtn2.parent.removeChild(this.radioBtn2);
			this.switchPage(0);
		}

		//刷新界面
		this.updateView();   

		//按钮监听
		this.radioBtn0.group.addEventListener(eui.UIEvent.CHANGE, this.onPageChange, this);

		//切页
		if(data != null){
			this.switchPage(data);
		}
		else {
			this.switchPage(0);
		}
	}

	public onRemove(){
		this.radioBtn0.group.removeEventListener(eui.UIEvent.CHANGE, this.onPageChange, this);
	}

	/**更新界面 */
	public updateView(){

		this.validateNow();

		this.topMenu.setAssetUI();
		this.topMenu.showConfig(true,true,TopMenuTitle.Act);

		//菜单按钮红点提示  (red是写在exml里的红点图片id)
		//this.radioBtn0["red"].visible = (App.DataCenter.login_reward == LoginRewardStatus.RedTip)?true:false;
		//this.radioBtn2["red"].visible = !App.DataCenter.first_gift;

		//页面更新
		App.DataCenter.actInfo.login_on && this.pageLogin.updateView();     //登录有奖
		App.DataCenter.actInfo.lottery_on && this.pageLucky.updateView();   //幸运抽奖
		App.DataCenter.actInfo.fdouble_on && this.pageDouble.updateView();  //首冲双倍
		App.DataCenter.actInfo.fpay_on && this.pageFirst.updateView();      //首冲礼包
		App.DataCenter.actInfo.code_on && this.exchange.updateView();       //礼包兑换

		//更新活动中心外标签
		App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);
	}

	/**点击单选按钮 切换页面 */
	private onPageChange(e:eui.UIEvent){
		App.SoundManager.playEffect(SoundManager.page_switch);
		let group:eui.RadioButtonGroup = e.target;
		this.switchPage(group.selectedValue);
	}

	/**切换页面 */
	private switchPage(page){
		//如果该页面存在，才会切换页面。否则切换到当前存在的第一页
		if(this.radioList[page].parent){  
			this.radioBtn0.group.selectedValue = page;
			this.viewStack.selectedIndex = page;
		}else{
			let len = this.radioList.length;
			for(let i=0;i<len;i++){
				if(this.radioList[i].parent){
					this.radioBtn0.group.selectedValue = i;
					this.viewStack.selectedIndex = i;
					break;
				}
			}
		}
	}

	/**关闭页面 */
	private onCloseTouch(){
		this.hide();

		//关闭后，可能因为领取了登录奖励，达到了升级条件，所以需要判断是否升级
		App.EventManager.sendEvent(EventConst.CHECK_UPGRADE);
	}
}

enum ActPage {
	Login,
	Lucky,
	Double,
	First,
	Exchange
}