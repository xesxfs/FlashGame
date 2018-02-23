/**
 * 电话聊天历史
 * @author xiongjian
 * @date 2017/9/7 
 */

class CallHistoryPanel extends BasePanel {
    public recData;
    public dataScroller: eui.Scroller;
    public dataList: eui.List;
    public backBtn: eui.Button;
    public maskImg:eui.Image;
    public grilImg:eui.Image;
    private girlName:eui.Label;
    private timeout;

    //===== 第二版 ======
    public topMenu:TopMenu;     //顶部菜单
    private closeBtn:eui.Button; //关闭

    public constructor() {
        super();
        this.skinName = "CallHistoryPanelSkin"
    }

    /**组件创建完毕*/
    protected childrenCreated() {

    }

    /**添加到场景中*/
    public onEnable(data:any = null) {
        this.topMenu.setAssetUI();

        this.recData = data;
        
        this.grilImg.source = App.DataCenter.telInfo.head;
        this.girlName.text = App.DataCenter.ConfigInfo.girl_name;
        
        CommomBtn.btnClick(this.closeBtn,this.close,this,2);
        this.setData();

    }

    /**从场景中移除*/
    public onRemove() {
        CommomBtn.removeClick(this.closeBtn,this.close,this);
    }

    /**设置数据 */
    private setData(){
        let ac = new eui.ArrayCollection();
        ac.source = this.recData.hist;
        this.dataList.dataProvider = ac;
        this.dataList.itemRenderer = CallHistoryListItem;
    }

    /**设置scroll 位置 */
    private setScollHeight() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.dataScroller.viewport.scrollV = - 40;

        }, 100);

    }

    /**关闭页面 */
    private close(){
        this.hide();
        App.PanelManager.open(PanelConst.DianhuaPanel);
        App.TalkManager.stopSound();
    }

}