/**
 * 收藏面板
 * @author sven
 * 2017.12.27
 */
class CollectionPanel extends BasePanel {
    private radioOne:eui.RadioButton;
    private itemList:eui.List;
    public topMenu:TopMenu;


    private typeList: Array<string> = ["bgImg", "recall", "treasure", "bgMus", "giftBgi", "giftVedio"];

    public constructor() {
        super();
        this.skinName = CollectionPanelSkin;
    }

    protected childrenCreated() {
        this.itemList.itemRenderer = CollectionItem;
        this.itemList.useVirtualLayout = false;
    }

    public onEnable() {
        this.reTopUI();
        this.topMenu.showConfig(true, true, TopMenuTitle.Collection);
        this.radioOne.group.addEventListener(eui.UIEvent.CHANGE, this.onRadioTouch, this);

        this.switchPage(0);
    }

    public onRemove() {
		this.radioOne.group.removeEventListener(eui.UIEvent.CHANGE, this.onRadioTouch, this);
        this.radioOne.group.selectedValue = 0;
    }

    private onRadioTouch(e:eui.UIEvent){
		let group:eui.RadioButtonGroup = e.target;
		this.switchPage(group.selectedValue);
	}

    private switchPage(page:number){
		App.SoundManager.playEffect(SoundManager.page_switch);
		this.radioOne.group.selectedValue = page;

        let info:CollectionInfo = App.DataCenter.collectionInfo;
        let ac:eui.ArrayCollection = new eui.ArrayCollection(info[this.typeList[page]]);
		this.itemList.dataProvider = ac;
	}

    /**刷新顶部UI */
    public reTopUI() {
        this.topMenu.setAssetUI();
    }

    /**刷新当前选中项列表UI */
    public reListUI() {
        let page = this.radioOne.group.selectedValue;
        let info:CollectionInfo = App.DataCenter.collectionInfo;
        let ac:eui.ArrayCollection = new eui.ArrayCollection(info[this.typeList[page]]);
		this.itemList.dataProvider = ac;
    }
}