/**
 * 活动中心
 * @author chenkai
 * @date 2017/11/27
 */
class ActBtn extends eui.Component{
	private actBtn:eui.Button;  //活动按钮
	private red:eui.Image;

	public constructor() {
		super();
		this.skinName = "ActBtnSkin";
	}

	public childrenCreated(){
		
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