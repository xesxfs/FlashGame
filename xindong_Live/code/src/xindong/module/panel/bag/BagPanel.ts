/**
 * 背包面板
 * @author xiongjian
 * @date 2017/9/11
 */
class BagPanel extends BasePanel {
    public topMenu:TopMenu;            //顶部菜单
    public nothingGroup: eui.Group;     //没有道具Group
    public gotoShop:eui.Button;         //前往商城
    private bagList:eui.List;           //背包列表

    public constructor() {
        super();
        this.skinName = "BagPanelSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {
        this.bagList.itemRenderer = BagListItem;
    }

    /**添加到场景中*/
    public onEnable() {
        //顶部菜单
        this.topMenu.setAssetUI();   
        this.topMenu.showConfig(true,true,TopMenuTitle.Bag);

        this.init();
      
        CommomBtn.btnClick(this.gotoShop,this.onGotoShop,this);
        this.bagList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemTap, this);
    }

    /**从场景中移除*/
    public onRemove() {
        CommomBtn.removeClick(this.gotoShop,this.onGotoShop,this);
        this.bagList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemTap, this);
    }

    //初始化背包
    public init() {
        //显示背包列表
        let bags = App.DataCenter.Bags;
        let ac:eui.ArrayCollection = new eui.ArrayCollection(bags);
        this.bagList.dataProvider = ac;


        //没有道具时，显示提示
        if (bags.length > 0) {
            this.nothingGroup.visible = false;
        } else {
            this.nothingGroup.visible = true;
        }
    }

    //点击背包物品
    private onItemTap(e:eui.ItemTapEvent){
        App.SoundManager.playEffect(SoundManager.button);
        App.PanelManager.open(PanelConst.UseToolPanel, e.item);
    }

    /**去商城 */
    private onGotoShop(){
       App.PanelManager.open(PanelConst.ShopPanel, ShopPage.Tool);
       let shop =<ShopPanel> App.PanelManager.getPanel(PanelConst.ShopPanel);
    }

}