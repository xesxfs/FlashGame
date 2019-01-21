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
        this.addEvent(EventConst.PLAY_WEB_VIDEO,this.playWebVideo,this);
        this.addEvent(EventConst.UPDATE_SIWEI, this.onUpdateSiWei, this);
        this.addEvent(EventConst.CHECK_UPGRADE, this.onCheckUpgrade, this);
        this.addEvent(EventConst.REQ_LOGIN_REWARD, this.reqLoginReward, this);
        this.addEvent(EventConst.REQ_GAME_INFO, this.reqGameInfo, this);
	}

	/**显示游戏界面*/
	private showGameScene() {
		App.SceneManager.open(SceneConst.GameScene);
	}

    /**播放web视频 */
    private playWebVideo(url){
        App.MyVideo.play(url);
    }

    /**更新四维 */
    private onUpdateSiWei(){
        this.gameScene.setConfig();
    }

    /**检查是否能够升级 */
    private onCheckUpgrade(){
        if (this.gameScene.isUpgrade()) {
            this.gameScene.upGrade();
        }
    }

	/**获取恋爱列表 */
	public reqLoves (){
		let http = new HttpSender();
        let json = {}
        http.post(ProtocolHttpUrl.loves, json, this.revLoves, this);
	}

	/**恋爱列表返回 */
	private revLoves(data){
		if (data.code == 200) {
			let json = data.data;
			App.DataCenter.Love = json;
			App.PanelManager.open(PanelConst.LovePanel,json);
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
			App.PanelManager.open(PanelConst.BagsPanel);
		}else{
			Tips.info(""+data.info);
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
    

    //分享成功，请求奖励
    public reqShareGain(){
        let http = new HttpSender();
        let param = {};
        http.post(ProtocolHttpUrl.shareGain, param, this.revShareGain, this);
    }

    //接收分享奖励
    private revShareGain(data){
        if(data.code == 200){
            App.DataCenter.UserInfo.diamond = data.data.diamond;
            App.DataCenter.UserInfo.gold = data.data.gold;
            App.DataCenter.UserInfo.power = data.data.power;
            App.DataCenter.UserInfo.hearts = data.data.hearts;
            this.gameScene && this.gameScene.setConfig();

            let shareGainDialog:ShareGainDialog = new ShareGainDialog();
            shareGainDialog.setGain();
            shareGainDialog.show();
        }else{
            let shareGainDialog:ShareGainDialog = new ShareGainDialog();
            shareGainDialog.setNoGain();
            shareGainDialog.show();
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
            App.EventManager.sendEvent(EventConst.UPDATE_FIRST_PAY);//更新商城购买钻石首次购买提示
            App.EventManager.sendEvent(EventConst.UPDATE_SIWEI);    //刷新四维
        }else{
            Tips.info(data.info);
        }
    }

}