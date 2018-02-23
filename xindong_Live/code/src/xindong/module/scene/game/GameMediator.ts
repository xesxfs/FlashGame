/**
 * 游戏控制模块
 * @author xiongian
 * @date 2017/8/24
 */
class GameMediator extends Mediator {
	public static NAME: string = "GameMediator";
    /**显示游戏界面 */
	public static SHOW_GAME_SCENE:string = "SHOW_GAME_SCENE"; 
	/**游戏界面*/
	public gameScene: GameScene;

	public constructor() {
		super();
        window["GC"] = this;

        this.gameScene = new GameScene(this);
        App.SceneManager.register(SceneConst.GameScene, this.gameScene);
	}

	public onRegister() {
		this.addEvent(GameMediator.SHOW_GAME_SCENE,this.showGameScene,this);
		this.addEvent(EventConst.GIFTFORUSER,this.reqGiftForUser,this);
        this.addEvent(EventConst.UPDATE_SIWEI, this.onUpdateSiWei, this);
        this.addEvent(EventConst.CHECK_UPGRADE, this.onCheckUpgrade, this);
        this.addEvent(EventConst.REQ_GAME_INFO, this.reqGameInfo, this);
	}

	/**显示游戏界面*/
	private showGameScene() {
		App.SceneManager.open(SceneConst.GameScene);
	}


    /**更新四维 */
    private onUpdateSiWei(){
        this.gameScene.updateAsset();
    }

    /**检查是否能够升级 */
    private onCheckUpgrade(){
        if (this.gameScene.isUpgrade()) {
            this.gameScene.upGrade();
        }
    }

	/**发送请求背包列表 */
	public reqBags(){
		let http = new HttpSender();
        let json = {}
        http.post(ProtocolHttpUrl.bags, json, this.revBags, this);
	}

	/**背包返回 */
	private revBags(data){
		if (data.code == 200) {
			App.DataCenter.Bags = data.data;
			App.PanelManager.open(PanelConst.BagPanel);
		}else{
			Tips.info(data.info);
		}
	}

    /**ios支付完成 */
    private reqGiftForUser(data) {
        let json = JSON.parse(data);
        if (json.code == 200) {
            let http = new HttpSender();
            let param = { order_id: json.data.order_id, receipt: json.data.receipt }
            http.post(ProtocolHttpUrl.giftForUser, param, this.revGiftForUser, this);
           
        } else {
            Tips.info("" + json.info);
        }
    }

    /**礼品下方返回 */
    private revGiftForUser(data) {
        if (data.code == 200) {
            App.EventManager.sendEvent(EventConst.REQ_GAME_INFO);
            Tips.info("购买成功");
        } else {
            Tips.info("" + data.info);
        }
    }

    /**请求登录奖励详情 page页数*/
    public reqLoginReward(page:number = 0){
        let http:HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.loginReward, {}, (data)=>{
            if(data.code == 200){
                App.DataCenter.loginRewardInfo = data;
                let panel = App.PanelManager.open(PanelConst.ActPanel,page);
                //弹框放置在最底层
                App.LayerManager.panelLayer.addChildAt(panel, 0);

            }else{
                Tips.info(data.info);
            }
        }, this);
    }

    /**请求游戏信息 */
    public reqGameInfo(){
        if(App.SceneManager.getCurScene() instanceof GameScene){
            let http = new HttpSender();
            let param = {};
            http.post(ProtocolHttpUrl.gameinfo, param, this.revGameInfo, this);
        }
    }

	/**返回游戏信息*/
    private revGameInfo(data) {
        if (data.code == 200) {
            App.DataCenter.readGameInfo(data);
            App.EventManager.sendEvent(EventConst.payBack);         //发送时间更新商城数据
            App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);  //更新红点提示
            App.EventManager.sendEvent(EventConst.UPDATE_LIBAO);    //购买礼包返回刷新数据
            App.EventManager.sendEvent(EventConst.UPDATE_SIWEI);    //刷新四维
        }else{
            Tips.info(data.info);
        }
    }

    /**请求排行 */
	public reqRank(){
        let http:HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.rank, {}, this.revRank, this);
	}

	/**接收排行 */
	private revRank(data){
		if(data.code == 200){
			App.DataCenter.rankInfo.readData(data.data);
			App.PanelManager.open(PanelConst.RankPanel);
		}else{
			Tips.info(data.info);
		}
	}

    /**请求收藏 */
    public reqCollection() {
        let http:HttpSender = new HttpSender;
        http.post(ProtocolHttpUrl.collection, {}, this.revCollection, this);
    }

    /**接收收藏 */
    private revCollection(data) {
        if(data.code == 200){
			App.DataCenter.collectionInfo.readData(data.data);
			App.PanelManager.open(PanelConst.CollectionPanel);
		}else{
			Tips.info(data.info);
		}
    }

    /**请求活动中心*/
	public reqAct(){
        let http:HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.actList, {}, this.revAct, this);
	}

	/**返回活动中心*/
	private revAct(data){
		if(data.code == 200){
			App.DataCenter.actInfo.readData(data.data);
			App.PanelManager.open(PanelConst.ActPanel);
		}else{
			Tips.info(data.info);
		}
	}

    /**请求恋爱列表 */
    public reqLove() {
        let http:HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.loveList, {}, this.revLove, this);
    }

    /**接收恋爱列表 */
    private revLove(data) {
        if(data.code == 200){
			App.DataCenter.Love.loveList = data.data;
			App.PanelManager.open(PanelConst.LovePanel);
		}else{
			Tips.info(data.info);
		}
    }

    /**请求工作列表 */
    public reqWork() {
        let http:HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.works, {}, this.revWork, this);
    }

    /**接收工作列表 */
    private revWork(data) {
        if(data.code == 200){
			App.DataCenter.Work.workList = data.data;
			App.PanelManager.open(PanelConst.WorkPanel);
		}else{
			Tips.info(data.info);
		}
    }

    /**答题消耗信息 */
    public reqInteractAnsCost() {
        let http:HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.questionAnsMain, {}, this.revAnsCost, this);
    }

    /**接收答题消耗 */
    private revAnsCost(data) {
        if(data.code == 200){
            App.DataCenter.interactAnsInfo.cost = data.data;
			App.PanelManager.open(PanelConst.InteractPanel);
		}else{
			Tips.info(data.info);
		}
    }

    /**获取邮件列表 */
    public reqMail() {
        let http = new HttpSender();
        let param = {};
        http.post(ProtocolHttpUrl.mailList, param, this.revMail, this);
    }

    /**获取邮件列表返回 */
    private revMail(data) {
        if (data.code == 200) {
            App.DataCenter.mail = data.data;
            //打开设置面板
            App.PanelManager.open(PanelConst.SetPanel);
            //更新红点提示
            App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);
        } else {
            Tips.info("" + data.info);
        }
    }

    /**获取背景音乐列表 */
    public reqBgmList() {
        let http = new HttpSender();
        let param = {};
        http.post(ProtocolHttpUrl.bgmList, param, this.revBgmList, this);
    }

    private revBgmList(data) {

    }
}