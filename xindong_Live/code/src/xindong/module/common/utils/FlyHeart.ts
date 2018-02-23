/**
 * 飞行的心形
 * @author chenkai
 */
class FlyHeart extends eui.Component{
	public constructor() {
		super();
		this.skinName = "FlyHeartSkin";
	}

	/**
	 * 显示飞行的心形
	 * @param xPos x坐标
	 * @param yPos y坐标
	 * @param cb 回调函数
	 * @param thisObj 回调执行对象
	 * @param flyTime 飞行时间
	 */
	public show(xPos:number, yPos:number, cb:Function = null, thisObj:any = null, flyTime:number = 2000){
		//显示到弹框层中心
		this.x = App.StageUtils.stageWidth/2;
		this.y = App.StageUtils.stageHeight/2;
		App.LayerManager.panelLayer.addChild(this);

		//飞行1s，然后回调
		egret.Tween.get(this).to({x:xPos, y:yPos},flyTime).call(()=>{
			if(cb && thisObj){
				cb.call(thisObj);
				this.parent && this.parent.removeChild(this);
			}
		},this);
	}

	//单例
	private static instance:FlyHeart;
	public static getInstace():FlyHeart{
		if(this.instance == null){
			this.instance = new FlyHeart();
		}
		return this.instance;
	}

}