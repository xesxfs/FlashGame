/**
 * 指引的光环(单例)
 * @author chenkai 2018/1/8
 */
class GuideCircle extends BaseMovieClip{
	public constructor() {
		super();
		this.config("guide_circle_mc_json", "guide_circle_tex_png", "guide_cicle");
		this.touchEnabled = false;
	}

	//显示
	public show(target:egret.DisplayObject){
		this.x = target.x + target.width/2;
		this.y = target.y + target.height/2;
		target.parent && target.parent.addChild(this);
		this.gotoAndPlay(1, -1);
	}

	public hide(){
		this.stop();
		this.parent && this.parent.removeChild(this);
	}

	//单例
	private static instance:GuideCircle;
	public static getInstacen():GuideCircle{
		if(this.instance == null){
			this.instance = new GuideCircle();
		}
		return this.instance;
	}
}