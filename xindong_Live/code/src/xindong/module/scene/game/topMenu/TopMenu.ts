/**
 * 顶部菜单
 * UI放在大厅中。在PanelManger和SceneManger中，切换视图时，自动切换UI，并更新数据
 * @author chenkai 2017/12/23
 */
class TopMenu extends eui.Component{
	public heartUI:HeartsPlugins;      //亲密度
	private diamondUI:DiamondUI;  //钻石
	private goldUI:GoldUI;        //金币
	private topTitleImg:eui.Image;
	public closeBtn:eui.Button;  //关闭

	/**关闭回调 */
	private closeCallback: Function;
	private closeObj: any;

	public constructor() {
		super();
		this.skinName = "TopMenuUISkin";
	}

	public childrenCreated(){
		this.configListeners();
		this.topTitleImg && (this.topTitleImg.visible = false);
	}	
	

	//按钮监听
	public configListeners(){
		this.goldUI && this.goldUI.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGoldTouch, this);
		this.diamondUI && this.diamondUI.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDiamondTouch, this);
		this.closeBtn && CommomBtn.btnClick(this.closeBtn, this.onClose, this, ComBtnType.Close);
	}

	//取消按钮监听
	public deConfigListeners(){
		this.goldUI && this.goldUI.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGoldTouch, this);
		this.diamondUI && this.diamondUI.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDiamondTouch, this);
		this.closeBtn && CommomBtn.removeClick(this.closeBtn, this.onClose, this);
	}

	/**设置个人资产*/
	public setAssetUI(){
		this.heartUI && this.heartUI.setJindu(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts);
		this.diamondUI && this.diamondUI.setDiamond(App.DataCenter.UserInfo.diamond);
		this.goldUI && this.goldUI.setGold(App.DataCenter.UserInfo.gold);
	}

	/**点击金币，去商城 */
	private onGoldTouch(){
		App.PanelManager.closeAll();
		App.PanelManager.open(PanelConst.ShopPanel, ShopPage.Gold);
	}

	/**点击钻石，去商城 */
	private onDiamondTouch(){
		App.PanelManager.closeAll();
		App.PanelManager.open(PanelConst.ShopPanel, ShopPage.Diamond);
	}

	/**关闭 */
	private onClose(){
		var gamescene = App.SceneManager.getScene(SceneConst.GameScene) as GameScene;
        gamescene.enterAnimation();
		App.PanelManager.closeAll();
		if (this.closeCallback && this.closeObj) {
			this.closeCallback.apply(this.closeObj,[]);
		}
	}

	/**播放返回提示动画 */
	public playBackAnim(){
        egret.Tween.get(this.closeBtn,{loop:true}).to({scaleX:1.1,scaleY:1.1},500).to({scaleX:1,scaleY:1},500);
    }

	/**停止播放返回提示动画 */
    public stopBackAnim(){
         this.closeBtn.scaleX = 1;
         this.closeBtn.scaleY = 1;
         egret.Tween.removeTweens(this.closeBtn);
    }

	/**添加关闭回调 */
	public setCloseCallback(callBack: Function, thisObj: any) {
		this.closeCallback = callBack;
		this.closeObj = thisObj;
	}

	/**隐藏 */
	public hide(){
		this.parent && this.parent.removeChild(this);
	}

	/**销毁 */
	public destoryMe(){
		this.deConfigListeners();
	}

	/**显示控制 */
	public showConfig(showGold:boolean, showDiamond:boolean, showTitle:string = null) {
		this.diamondUI && (this.diamondUI.visible = showDiamond);
		this.goldUI && (this.goldUI.visible = showGold);

		if (showTitle) {
			if(this.topTitleImg){
				this.topTitleImg.source = showTitle + "_png";
				this.topTitleImg.visible = true;
			}
		}
		// 位置改变，todo
	}
}

/**顶部菜单标题 */
class TopMenuTitle {
	public static Collection = "com_title_colletion";   //收藏
	public static Interact = "com_title_interact"       //互动
	public static InteractAns = "com_title_interact"    //互动
	public static InteractGift = "com_title_interact"   //互动
	public static Love = "com_title_love";              //恋爱
	public static Work = "com_title_work";              //工作
	public static Rank = "com_title_rank";              //排行
	public static Shop = "com_title_shop";              //商城
	public static Phone = "com_title_phone";            //电话
	public static Call = "com_title_call";              //拨打电话
	public static Calling = "com_title_calling";        //通话中
	public static Wechat = "com_title_wechat";          //微信
	public static Bag = "com_title_bag";                //背包
	public static Act = "com_title_act";                //活动中心

}