/**
 * 视频按钮
 * @author xiongjian
 * @date 2017/8/28
 */
class ShipinBtn extends BaseUI {

	public shipinBtn: eui.Button;
	public red: eui.Image;
	public green: eui.Image;

	public constructor() {
		super();
		this.skinName = "shipinBtnSkin";
	}

	protected childrenCreated() {
		
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
		let gameScene = <GameScene>App.SceneManager.getScene(SceneConst.GameScene);
		gameScene.outAnimation(() => {
			App.PanelManager.open(PanelConst.ShipinPanel);
		});

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
		/**显示绿点 */
	public showGreenPoint(bo: boolean) {
		if (bo) {
			this.green.visible = true;
			this.red.visible = false;
			
		} else {
		
			this.green.visible = false;
			this.red.visible = false;
		}
	}

	/**显示红点 */
	public showRedPoint(bo: boolean) {
		if (bo) {
			this.red.visible = true;
			this.green.visible = false;
			egret.Tween.get(this.red,{loop:true}).set({scaleX:0.9,scaleY:0.9}).to({scaleX:1.1,scaleY:1.1},800).to({scaleX:0.9,scaleY:0.9},800);
		} else {
			egret.Tween.removeTweens(this.red);
			this.red.visible = false;
			this.green.visible = false;
		}
	}
}
