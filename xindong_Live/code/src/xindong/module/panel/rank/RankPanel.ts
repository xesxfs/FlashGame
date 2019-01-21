/**
 * 排行榜
 * @author chenkai 2017/12/14
 */
class RankPanel extends BasePanel {
	public topMenu: TopMenu;             //顶部菜单

	private radioBtn: eui.RadioButton;    //单选按钮
	private viewStack: eui.ViewStack;     //viewStack

	private heartList: eui.List;          //心动榜
	private richList: eui.List;           //富豪榜
	private giftList: eui.List;           //礼物榜
	private IQList: eui.List;             //智商榜

	private myRankLabel: eui.Label;       //我的排名
	private scoreTitleLabel: eui.Label;   //分数标题

	public constructor() {
		super();
		this.skinName = "RankPanelSkin";
	}

	public childrenCreated() {
		//初始化列表
		this.heartList.itemRenderer = RankHeart;
		this.richList.itemRenderer = RankGold;
		this.giftList.itemRenderer = RankHeart;
		this.IQList.itemRenderer = RankHeart;
	}

	public onEnable() {
		this.playEnterAnim();

		//顶部菜单
		this.topMenu.setAssetUI();
		this.topMenu.showConfig(true, true, TopMenuTitle.Rank);

		//获取排行榜数据
		let rankInfo: RankInfo = App.DataCenter.rankInfo;

		//心动榜
		let heartAc: eui.ArrayCollection = new eui.ArrayCollection(rankInfo.hearts);
		this.heartList.dataProvider = heartAc;

		//富豪榜
		let richAc: eui.ArrayCollection = new eui.ArrayCollection(rankInfo.gold);
		this.richList.dataProvider = richAc;

		//礼物榜
		let giftAc: eui.ArrayCollection = new eui.ArrayCollection(rankInfo.gift);
		this.giftList.dataProvider = giftAc;

		//IQ榜
		let IQAc: eui.ArrayCollection = new eui.ArrayCollection(rankInfo.question);
		this.IQList.dataProvider = IQAc;
		this.setMyRank(0);

		//按钮监听
		this.radioBtn.group.addEventListener(eui.UIEvent.CHANGE, this.onRadioTouch, this);
	}

	public onRemove() {
		this.radioBtn.group.removeEventListener(eui.UIEvent.CHANGE, this.onRadioTouch, this);
	}

	//点击单选按钮
	private onRadioTouch(e: eui.UIEvent) {
		let group: eui.RadioButtonGroup = e.target;
		this.switchPage(parseInt(group.selectedValue));
	}

	//切换页面
	private switchPage(page: number) {
		App.SoundManager.playEffect(SoundManager.page_switch);
		this.viewStack.selectedIndex = page;
		this.radioBtn.group.selectedValue = page;

		//设置上榜
		this.setMyRank(page);

		//设置分数标题
		this.setScoreTitle(page);
	}

	//根据当前排行页，设置我的排行是否上榜
	private setMyRank(page: number) {
		//我的排行列表
		let myRank = [App.DataCenter.rankInfo.myHeartRank,
		App.DataCenter.rankInfo.myGoldRank,
		App.DataCenter.rankInfo.myGiftRank,
		App.DataCenter.rankInfo.myQuestionRank];
		//判断自己是否上榜
		if (myRank[page] <= App.DataCenter.rankInfo.rankMax) {
			this.myRankLabel.text = myRank[page] + "";
		} else {
			this.myRankLabel.text = "未上榜";
		}
	}

	//根据当前排行设置分数标题
	private setScoreTitle(page: number) {
		if (page == 0) {
			this.scoreTitleLabel.text = "好感度";
		}
		if (page == 1) {
			this.scoreTitleLabel.text = "金币数量";
		}
		if (page == 2) {
			this.scoreTitleLabel.text = "心情值";
		}
		if (page == 3) {
			this.scoreTitleLabel.text = "情商值";
		}
	}
}