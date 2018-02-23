/**
 * 登录有奖
 * @author chenkai
 * @date 2017/11/27
 */
class ActPage0UI extends eui.Component{
	private scrollerGroup:eui.Group;  //滚动容器

	public constructor() {
		super();
		this.skinName = "ActPage0UISkin";
	}

	public childrenCreated(){
		
	}

	//更新界面  奖励天数后台配置，奖励的UI数量可能会变化。
	public updateView(){
		let data = App.DataCenter.loginRewardInfo;
		
		//奖励的数量
		let len = data.data.length;
	
		//清理原有UI
		let oldUI:DayRewardUI;
		let childNum = this.scrollerGroup.numChildren;
		for(let i=childNum-1;i>=1;i--){
			oldUI = this.scrollerGroup.getChildAt(i) as DayRewardUI;
			oldUI.destoryMe();
		}
		
		//创建新的UI
		let rewardUI:DayRewardUI;
		for(let i=0;i<len;i++){
			rewardUI = new DayRewardUI();
			this.scrollerGroup.addChild(rewardUI);
			rewardUI.updateView(data.data[i]);
		}
	}
}