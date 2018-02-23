/**
 * 设置按钮
 * @author chenkai
 * @since 2017/10/18
 */
class SetBtn extends eui.Component{
	public red: eui.Image;

	public constructor() {
		super();
		this.skinName = "setBtnSkin";
	}


	/**显示红点 */
	public showRedPoint(bo: boolean) {
		if (bo) {
			this.red.visible = true;
			egret.Tween.removeTweens(this.red);
			egret.Tween.get(this.red,{loop:true}).set({scaleX:0.9,scaleY:0.9}).to({scaleX:1.1,scaleY:1.1},800).to({scaleX:0.9,scaleY:0.9},800);
		} else {
			egret.Tween.removeTweens(this.red);
			this.red.visible = false;
		}
	}
}