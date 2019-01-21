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
    private timeout;


    public constructor() {
        super();
        this.skinName = "CallHistoryPanelSkin"
    }

    /**组件创建完毕*/
    protected childrenCreated() {

    }

    /**添加到场景中*/
    public onEnable(data:any = null) {
        this.recData = data;
        this.grilImg.mask = this.maskImg;
        if( App.DataCenter.Tel){
            this.grilImg.source = App.DataCenter.Tel.head;
        }
        
        CommomBtn.btnClick(this.backBtn,this.close,this,2);
        this.setData();

    }

    /**从场景中移除*/
    public onRemove() {
        CommomBtn.removeClick(this.backBtn,this.close,this);
    }

    /**设置数据 */
    private setData(){
        let ac = new eui.ArrayCollection();
        let arr = [];
        var data = this.recData.dialog;
        arr = data;
        console.log("arr",arr);
        ac.source = arr;
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