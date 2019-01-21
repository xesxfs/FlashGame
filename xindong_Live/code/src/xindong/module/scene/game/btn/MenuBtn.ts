/**
 * 大厅菜单按钮
 * @author chenkai
 * @date 2017/11/27
 */
class MenuBtn extends eui.Component{
	private red:eui.Image;
	private newImg0:eui.Image;//news闪烁
	private newImg1:eui.Image;

	public constructor() {
		super();
		this.touchChildren = false;
	}

	public childrenCreated(){
		
	}

	/**显示红点 */
	public showRedPoint(bo: boolean) {
		if(this.red){
			if (bo) {
				this.red.visible = true;
				egret.Tween.removeTweens(this.red);
				egret.Tween.get(this.red,{loop:true}).set({scaleX:0.9,scaleY:0.9}).to({scaleX:1.1,scaleY:1.1},800).to({scaleX:0.9,scaleY:0.9},800);
			} else {
				egret.Tween.removeTweens(this.red);
				this.red.visible = false;
			}
		}
		
		//news闪烁
		if(this.newImg0){
			if(bo){
				//this.newImg0.visible = true;
				this.newImg1.visible = true;
				// egret.Tween.get(this,{loop:true}).wait(200).call(()=>{
				// 	this.newImg0.visible = false;
				// 	this.newImg1.visible = true;
				// },this).wait(200).call(()=>{
				// 	this.newImg0.visible = true;
				// 	this.newImg1.visible = false;
				// },this);
			}else{
				//this.newImg0.visible = false;
				this.newImg1.visible = false;
				egret.Tween.removeTweens(this);
			}
		}
	}
}