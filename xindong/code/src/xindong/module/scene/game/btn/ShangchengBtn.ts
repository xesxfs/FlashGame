/**
 * 商城按钮
 * @author xiongjian
 * @date 2017/8/28
 */
class ShangchengBtn extends BaseUI {
	public red: eui.Image;
	public shangchengImg: eui.Image;


	public constructor() {
		super();
		this.skinName = "shangchengBtnSkin";
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
			App.PanelManager.open(PanelConst.ShopPanel, 0);
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
