/**
 * 首冲双倍
 * @author chenkai
 * @date 2017/11/27
 */
class PageDoubleUI extends eui.Component{
	private chongzhiBtn:eui.Button;   //充值按钮
	private dateLabel:eui.Label;      //活动时间

	public constructor() {
		super();
		this.skinName = "PageDoubleUISkin";
	}

	public childrenCreated(){
		CommomBtn.btnClick(this.chongzhiBtn, this.onChongZhi, this);
	}

	//充值
	private onChongZhi(){
		//关闭活动中心
		App.PanelManager.close(PanelConst.ActPanel);
		//跳转到商城充值页面
		App.PanelManager.open(PanelConst.ShopPanel, ShopPage.Diamond);
	}

	/**更新视图 */
	public updateView(){
		this.dateLabel.text = App.DataCenter.actInfo.fpay_double.sdate +  "-" + App.DataCenter.actInfo.fpay_double.edate;
	}
}