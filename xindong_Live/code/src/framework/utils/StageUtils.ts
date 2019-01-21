/**
 * 舞台类
 * @author chenkai
 * @date 2016/10/11
 */
class StageUtils extends SingleClass{
	/**舞台 */
	public stage:egret.Stage;

	/**
	 * 获取舞台宽度
	 */
	public get stageWidth(){
		return this.stage.stageWidth;
	}

	/**
	 * 获取舞台高度
	 */
	public get stageHeight(){
		return this.stage.stageHeight;
	}

	//横屏游戏部分无法合适适配的机型，使用showAll
	//全面屏    2:1   2160:1080 
	//主流机型  16:9  1920x1080 
	//ipad     4:3   2048x1536  
	//注：华为虚拟键盘、 h5微信或浏览器有黑边会占一定比例
	//   根据手机截图测试，电量栏72像素  微信黑边142像素  华为虚拟键盘108像素 72+142+108=322
	public someScreenShowAll(){
		let rate = egret.Capabilities.boundingClientWidth / egret.Capabilities.boundingClientHeight;
		if(rate < 1520/1080 || rate > 1920/1080){   //超过16:9或小于14:10则使用showAll模式
			this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
		}
	}

}