/**
 * 分享按钮
 */
class ShareBtn extends BaseUI{
	private btn:eui.Button;
	private tip:eui.Image;

	public constructor() {
		super();
		this.skinName = "ShareBtnSkin";
	}

	public showTip(){
		this.tip.visible = true;
	}

	public hideTip(){
		this.tip.visible = false;
	}
}