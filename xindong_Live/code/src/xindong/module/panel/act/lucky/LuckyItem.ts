/**
 * 抽奖选项
 * @author chenkai 2017/12/15
 */
class LuckyItem extends eui.Component{
	/**选中图片 */
	private selectImg:eui.Image;
	/**礼物图片 */
	private giftImg:eui.Image;

	public constructor() {
		super();
		this.skinName = "LuckyItemSkin";
	}

	public childrenCreated(){

	}

	/**设置选中状态 */
	public setSelect(value:boolean){	
		if(value){
			this.selectImg.visible = true;
		}else{
			this.selectImg.visible = false;
		}
	}

	/**设置礼物图片 */
	public setImg(imgUrl:string){
		this.giftImg.source = imgUrl;
	}
}