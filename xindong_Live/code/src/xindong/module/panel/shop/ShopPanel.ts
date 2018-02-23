/**
 *电话呼叫中面板
 * @author xiongjian
 * @date 2017/08/24
 */
class ShopPanel extends BasePanel {
    public topMenu:TopMenu;              //顶部菜单
    private shopViewStack: eui.ViewStack; //商城ViewStack
    private radioBtn:eui.RadioButton;     //单选按钮
    private workRadioBtn:eui.RadioButton;

    private superValueList:eui.List;      //超值礼包
    private diamondList:eui.List;         //购买钻石
    private goldList:eui.List;            //购买金币
    private toolList:eui.List;            //购买道具
    private workList:eui.List;            //职场礼包
    
    private curGoodsInfo: any;            // 记录当前发送购买请求的商品信息

    public constructor() {
        super();
        this.skinName = "ShopPanelSkin";
    }

    protected childrenCreated() {
        this.superValueList.itemRenderer = ShopListItem;
        this.diamondList.itemRenderer = ShopListItem;
        this.goldList.itemRenderer = ShopListItem;
        this.toolList.itemRenderer = ShopListItem;
        this.workList.itemRenderer = ShopListItem;
    }

    public onEnable(data:any = null) {
        //切页
        if (data != null) {
            this.switchPage(data);
        }

        //顶部菜单
        this.topMenu.setAssetUI();
        this.topMenu.showConfig(true,true,TopMenuTitle.Shop);

        //List列表
        let shop = App.DataCenter.Shop;
        this.superValueList.dataProvider = new eui.ArrayCollection(shop.giftpack);
        this.diamondList.dataProvider = new eui.ArrayCollection(shop.diamonds);
        this.goldList.dataProvider = new eui.ArrayCollection(shop.golds);
        this.toolList.dataProvider = new eui.ArrayCollection(shop.tools);
        this.workList.dataProvider = new eui.ArrayCollection(shop.work);

        // 职场礼包列表为空时不显示页签
        if (shop.work && shop.work.length>0) {
            this.workRadioBtn.visible = true;
        }
        else {
            this.workRadioBtn.visible = false;
        }

        //选项卡切换
        this.radioBtn.group.addEventListener(eui.UIEvent.CHANGE, this.changeViewStack, this);

        App.EventManager.addEvent(EventConst.payBack, this.payback, this);
    }
    public onRemove() {
        this.radioBtn.group.removeEventListener(eui.UIEvent.CHANGE, this.changeViewStack, this);
    }

    //切换页面
    public switchPage(page:number){
        this.validateNow();
        this.radioBtn.group.selectedValue = page;
        this.shopViewStack.selectedIndex = page;
    }

    /**切换ViewStark */
    private changeViewStack(e: eui.UIEvent) {
        var group: eui.RadioButtonGroup = e.target;
        this.shopViewStack.selectedIndex = group.selectedValue;
        App.SoundManager.playEffect(SoundManager.page_switch);
    }

    /**关闭面板 */
    private close() {
        this.hide();
        var gamescene = App.SceneManager.getScene(SceneConst.GameScene) as GameScene;
        gamescene.enterAnimation();
    }

    /**支付返回 */
    private payback() {
        this.topMenu.setAssetUI();
    }

    /**
     * 点击List的Item按钮购买物品
     * @param goodsInfo 道具的信息
     */
	public onBuyHandler(goodsInfo){
		//购买道具，显示+-购买面板
		if(goodsInfo.tid == ShopTid.Tool){
			App.PanelManager.open(PanelConst.BuyToolPanel,goodsInfo);
		//购买其他，显示提示
		}else{
			let confirmDialog:ConfirmDialog = new ConfirmDialog();
			confirmDialog.setTitle("提示");
			confirmDialog.show();
			confirmDialog.setOk(this.reqGiftBuy, this, goodsInfo);
			if (goodsInfo.coin_type == ShopCoinType.Rmb) {
				confirmDialog.setBuyUseRmb(goodsInfo.price);
			}
			if (goodsInfo.coin_type == ShopCoinType.Diamond) {
				confirmDialog.setBuyUseDiamond(goodsInfo.price);
			}
		}
	}

	//请求购买
    public reqGiftBuy(goodsInfo) {
        let http = new HttpSender();
        let data = ProtocolHttp.giftBuy;
        data.gid = goodsInfo.id;
        data["channel"] = StaticCfg.channel;
        this.curGoodsInfo = goodsInfo;
        http.post(ProtocolHttpUrl.giftBuy, data, this.revGiftBuy, this);
    }

    //返回购买
    private revGiftBuy(data) {
        if (data.code == 200) {
            //如果是非rmb购买，则服务器直接购买成功
            if (data.data.gold && data.data.diamond) {
                App.DataCenter.UserInfo.diamond = data.data.diamond;
                App.DataCenter.UserInfo.gold = data.data.gold;
                App.DataCenter.UserInfo.hearts = data.data.hearts;

                //更新四维
                this.topMenu.setAssetUI();
                App.EventManager.sendEvent(EventConst.UPDATE_SIWEI);

                if (!this.specialDeal()) {
                    Tips.info("购买成功");
                }
            }else{
                //如果是rmb购买，则data是下单信息，传给原生支付
                App.NativeBridge.sendNativePay(data.data);
            }
        }
        else {
            Tips.info(data.info);
        }
    }

    /**
     * 购买特定商品成功后的特殊处理
     */
    private specialDeal():boolean {
        let goodsInfo = this.curGoodsInfo;
        if (goodsInfo.tid == ShopTid.Work) {
            // 职场礼包
            let dialog: SureDialog = new SureDialog();
            dialog.setBuyWorkSuccess(goodsInfo.des, goodsInfo.package[1].num);
            dialog.show();
            App.SoundManager.playEffect("promotion_mp3");
            return true;
        }
        else if (goodsInfo.tid == ShopTid.Gold) {
            Utils.goldFlutter(goodsInfo.package[0].num);
            return true;
        }
        else {
            return false;
        }
    }
 }