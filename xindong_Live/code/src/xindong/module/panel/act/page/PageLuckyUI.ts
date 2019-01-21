/**
 * 幸运抽奖
 * @author chenkai 2017/12/15
 */
class PageLuckyUI extends eui.Component{
	private itemGroup:eui.Group;       //奖励Group
	private itemList:Array<LuckyItem>; //奖励Item

	private totalItem:number = 14;     //奖励数量

	private result:LotteryResultVO;                //抽奖结果
	private resultOneDialog:LuckyResultOneDialog;  //单抽结果弹框
	private resultTenDialog:LuckyResultTenDialog;  //十连抽结果弹框

	private firstLabel:eui.Label;            //首次免费
	private oneLabel:eui.Label;              //单次费用文本
	private tenLabel:eui.Label;              //十次费用文本
	private oneBtn:eui.Button;               //单抽按钮
	private tenBtn:eui.Button;               //十抽按钮

	public constructor() {
		super();
		this.skinName = "PageLuckyUISkin";
	}

	public childrenCreated(){
		//获取奖励Item
		this.itemList = [];
		let len = this.itemGroup.numChildren;
		for(let i=0;i<len;i++){
			this.itemList.push(this.itemGroup.getChildAt(i) as LuckyItem);
		}
		//监听按钮
		CommomBtn.btnClick(this.oneBtn, this.onLuckyTouch, this);
		CommomBtn.btnClick(this.tenBtn, this.onTenTouch, this);
	}

	/**更新界面  重置状态 */
	public updateView(){
		this.resetAllItem();
	}

	//重置所有奖品选项
	private resetAllItem(){
		//获取14个奖品详情
		let lotterys = App.DataCenter.actInfo.lottery.data;

		//设置14个奖品选项的图片和选中状态
		let len = this.itemList.length;
		let item:LuckyItem;
		for(let i=0;i<len;i++){
			item = this.itemList[i];
			item.setSelect(false);
			if(lotterys[i]){
				item.setImg(RES.getRes(lotterys[i].pic));
			}
		}

		//重置文本
		if(App.DataCenter.actInfo.lottery.cons == 0){
			
		}
	}

	//点击抽奖
	private onLuckyTouch(){
		this.reqLucky();
	}

	//请求抽奖
	private reqLucky(){
		let http:HttpSender = new HttpSender();
		http.post(ProtocolHttpUrl.lotteryRandom, {}, this.revLucky, this);
	}

	//接收抽奖
	private revLucky(data){
		if(data.code == 200){
			//锁定屏幕
			App.LoadingLock.lockScreen();

			//免费1次 次数已完
			App.DataCenter.actInfo.lottery.status = 1;

			//查找中奖奖品的索引
			this.result = data.data;
			let lotterys = App.DataCenter.actInfo.lottery.data;
			let index:number = 0;
			for(let i=0;i<lotterys.length;i++){
				if(this.result.id == lotterys[i].id){
					index = i;
					break;
				}
			}
			//播放抽奖动画
			this.playLuckyAnim(index);
		}else{
			Tips.info(data.info);
		}
	}

	//点击十连抽
	private onTenTouch(){
		this.reqTen();
	}

	//请求十连抽
	private reqTen(){
		let http:HttpSender = new HttpSender();
		http.post(ProtocolHttpUrl.lotteryTen, {}, this.revTen, this);
	}

	//返回十连抽
	private revTen(data){
		if(data.code == 200){
			this.resultTenDialog || (this.resultTenDialog = new LuckyResultTenDialog());
			this.resultTenDialog.show();
			this.resultTenDialog.setResult(data.data);
			this.resultTenDialog.setOk(()=>{
				this.oneBtn.enabled = true;
				this.tenBtn.enabled = true;
				this.resetAllItem();
			}, this);
			
		}else{
			Tips.info(data.info);
		}
	}

	//播放抽奖动画 索引从0开始
	private playLuckyAnim(luckIndex:number){
		console.log("PageLuckyUI >> 抽奖结果:", luckIndex);
		let maxCount:number = this.totalItem + luckIndex;
		let curCount:number = 0;   //当前选中索引
		let lastCount:number = 0;  //上一次选中索引

		let soundChannel = App.SoundManager.playEffect("fast_turn_mp3", 0, 2);
		egret.Tween.get(this,{loop:true}).wait(100).call(()=>{
			//设置当前选中奖励
			this.itemList[curCount%this.totalItem].setSelect(true);
			//设置上一个奖励
			lastCount = curCount%this.totalItem - 1;
			lastCount = lastCount<0?13:lastCount;
			this.itemList[lastCount].setSelect(false);
			//次数+1
			curCount++;
			//大于旋转次数，则停止旋转
			if(curCount > maxCount){
				//等待一段时候后显示结果
				egret.Tween.removeTweens(this);
				App.SoundManager.stopEffect(soundChannel);
				egret.Tween.get(this).wait(1000).call(()=>{
					this.luckyResult();
					//解锁屏幕
					App.LoadingLock.unLockScreen();
				},this);
			}
		},this);
	}

	//抽奖结果弹框
	private luckyResult(){
		this.resultOneDialog || (this.resultOneDialog = new LuckyResultOneDialog());
		this.resultOneDialog.setResult(this.result.name, this.result.pic);
		this.resultOneDialog.setOk(()=>{
			this.oneBtn.enabled = true;
			this.tenBtn.enabled = true;
			this.resetAllItem();
		},this);
		this.resultOneDialog.show();
	}

}