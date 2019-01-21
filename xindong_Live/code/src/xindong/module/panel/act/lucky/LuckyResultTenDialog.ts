/**
 * 抽奖结果弹框
 * @author chenkai 2017/12/29
 */
class LuckyResultTenDialog extends BaseDialog{
	private itemList:Array<ResultItem> = [];  //物品列表
	private itemGroup:eui.Group;              //物品Group

	public constructor() {
		super();
		this.skinName = "LuckyResultTenDialogSkin";
	}

	public childrenCreated(){
		let len = this.itemGroup.numChildren;
		for(let i=0;i<len;i++){
			this.itemList.push(this.itemGroup.getChildAt(i) as ResultItem);
		}
	}

	/**设置结果 */
	public setResult(data){
		let len = data.length;
		for(let i=0;i<len;i++){
			this.itemList[i].setName(data[i].name);
			this.itemList[i].setImg(RES.getRes(data[i].pic));
		}
	}
}