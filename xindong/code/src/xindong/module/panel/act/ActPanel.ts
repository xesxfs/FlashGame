/**
 * 活动中心
 * @author chenkai
 * @date 2017/11/27
 */
class ActPanel extends BasePanel{
	private radioBtn:eui.RadioButton;   //单选按钮
	private viewStack:eui.ViewStack;    //页面容器
	private closeBtn:eui.Image;         //关闭按钮

	private page0:ActPage0UI;           //登录有奖
	private page1:ActPage1UI;           //首冲双倍
	private page2:ActPage2UI;           //首冲礼包
	private page3:ActPage3UI;           //免费体力
	private page4:ActPage4UI;           //礼包兑换

	private radioBtn0:eui.RadioButton;  //登录有奖 
	private radioBtn1:eui.RadioButton;  //首冲双倍
	private radioBtn2:eui.RadioButton;  //首冲礼包
	private radioBtn3:eui.RadioButton;  //免费体力
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

		//刷新界面
		this.validateNow();
		this.updateView();   

		//按钮监听
		this.radioBtn0.group.addEventListener(eui.UIEvent.CHANGE, this.onPageChange, this);
		CommomBtn.btnClick(this.closeBtn, this.onCloseTouch, this);

		//切页
		if(data != null){
			this.switchPage(data);
		}
	}

	public onRemove(){
		this.radioBtn0.group.removeEventListener(eui.UIEvent.CHANGE, this.onPageChange, this);
		CommomBtn.removeClick(this.closeBtn, this.onCloseTouch, this);
	}

	/**更新界面 */
	public updateView(){
		//菜单按钮红点提示  (red是写在exml里的红点图片id)
		this.radioBtn0["red"].visible = (App.DataCenter.login_reward == LoginRewardStatus.RedTip)?true:false;
		this.radioBtn2["red"].visible = !App.DataCenter.first_gift;
		this.radioBtn3["red"].visible = App.DataCenter.isPower;

		//隐藏左侧不需要再显示的菜单按钮
		//登录有奖
		if(App.DataCenter.login_reward == LoginRewardStatus.HideBtn){
			this.radioBtn0.parent && this.radioBtn0.parent.removeChild(this.radioBtn0);
			this.switchFirstPage();
		}
		//首冲礼包
		if(App.DataCenter.first_gift == true){
			this.radioBtn2.parent && this.radioBtn2.parent.removeChild(this.radioBtn2);
			this.switchFirstPage();
		}

		//页面更新
		this.page0.updateView();   //登录有奖
		this.page1.updateView();   //首冲双倍
		this.page2.updateView();   //首冲礼包
		this.page3.updateView();   //免费体力
		this.page4.updateView();   //礼包兑换

		//更新活动中心外标签
		App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);
	}

	
	

	/**点击单选按钮 切换页面 */
	private onPageChange(e:eui.UIEvent){
		App.SoundManager.playEffect(SoundManager.button);
		let group:eui.RadioButtonGroup = e.target;
		this.switchPage(group.selectedValue);
	}

	/**切换页面 */
	private switchPage(page){
		this.radioBtn0.group.selectedValue = page;
		this.viewStack.selectedIndex = page;
	}

	/**切换到第一页 某些任务在完成后会消失，所以需要判断谁在第一页*/
	private switchFirstPage(){
		let len = this.radioList.length;
		for(let i=0;i<len;i++){
			if(this.radioList[i].parent){
				this.switchPage(i);
				break;
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