/**
 * 飞行的Tween动画
 * @author sven
 * 2018-01-08
 */
class FlyAnim {
	private imgList: Array<eui.Image>;

	public constructor() {
		this.imgList = [];
	}

	/**
	 * 添加一个纹理的飞行动画
	 */
	public addFly(texture: string, bX: number, bY: number, eX: number, eY: number, callBack: Function = null, thisObj: any = null, flyTime: number = 1000) {
		let img = new eui.Image();
		img.source = texture;
		img.anchorOffsetX = img.width/2;
		img.anchorOffsetY = img.height/2;
		img.x = bX;
		img.y = bY;
		img.scaleX = img.scaleY = 1.3;
		App.LayerManager.panelLayer.addChild(img);
		this.imgList.push(img);

		egret.Tween.get(img)
		.to({x: eX, y: eY}, flyTime)
		.call(()=>{
			if (callBack && thisObj) {
				callBack.call(thisObj);
			}
			egret.Tween.get(img)
			.to({alpha: 0}, 300)
			.call(()=>{
				img.parent && img.parent.removeChild(img);
			})
		}, this)
	}

	/**
	 * 将所有该类创建的纹理移除显示列表
	 */
	public removeAllFly() {
		for (let i = this.imgList.length-1;i >= 0;i --) {
			if (this.imgList[i] && this.imgList[i].parent) {
				this.imgList[i].parent.removeChild(this.imgList[i]);
				this.imgList.pop();
			}
		}
	}

	//单例
	private static instance:FlyAnim;
	public static getInstace():FlyAnim{
		if(this.instance == null){
			this.instance = new FlyAnim();
		}
		return this.instance;
	}
}