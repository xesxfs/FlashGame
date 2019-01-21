/**
 * 背包按钮
 * @author xiongjian
 * @date 2017/8/28
 */
class BeibaoBtn extends BaseUI {

	public red: eui.Image;
	public beibaoBtn: eui.Button;


	public constructor() {
		super();
		this.skinName = "beibaoBtnSkin";
	}

	protected childrenCreated() {
		this.anchorOffsetX = 54;
		this.anchorOffsetY = 43.5;
		this.x = this.x + 54;
		this.y = this.y + 43.5;
	}

	protected onEnable() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onTouchout,this);
	}
	protected onRemove() {

	}

	/**被点击 */
	private onTouch() {
		App.SoundManager.playEffect(SoundManager.button);
		this.getData();
	}

	/**请求背包数据 */
	private getData() {
		let http = new HttpSender();
		http.post(ProtocolHttpUrl.bags, {}, this.dataBack, this);
	}

	private dataBack(data) {
		if (data.code == 200) {
			App.DataCenter.Bags = data.data;
			let gameScene = <GameScene>App.SceneManager.getScene(SceneConst.GameScene);
			gameScene.outAnimation(() => {
				App.PanelManager.open(PanelConst.BagsPanel);
			});
		}
	}

	/**点击开始 */
	private onTouchBegin() {

		this.scaleX = 1.1;
		this.scaleY = 1.1;

	}

	/**点击结束 */
	private onTouchEnd() {
		this.scaleX = 1;
		this.scaleY = 1;
	}
	
	/** */
	private onTouchout(){
		this.scaleX = 1;
		this.scaleY = 1;
	}

	/**显示红点 */
	public showRedPoint(bo: boolean) {
		if (bo) {
			this.red.visible = true;
			egret.Tween.get(this.red,{loop:true}).set({scaleX:0.9,scaleY:0.9}).to({scaleX:1.1,scaleY:1.1},800).to({scaleX:0.9,scaleY:0.9},800);
		} else {
			egret.Tween.removeTweens(this.red);
			this.red.visible = false;
		}
	}
}
