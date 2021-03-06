/**
 * 微博面板
 * @author xiongjian
 * @date 2017/09/20
 */
class WeiboPanel extends BasePanel {

    public heartPlugin: HeartsPlugins;
    public backBtn: eui.Button;
    public upGroup: eui.Group;
    public headImg: eui.Image;
    public girlNeme: eui.Label;
    public weiboLabel: eui.Label;
    public weiboScoller: eui.Scroller;
    public weiboList: eui.List;
    public maskImg: eui.Image;

    public sendData;


    private arr = []; //list数据
    /**list 控制器 */
    private ac: eui.ArrayCollection;


    private constructor() {
        super();
        this.skinName = "WeiBoPanelSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {

    }

    /**添加到场景中*/
    public onEnable() {
        this.ac = new eui.ArrayCollection();
        this.weiboList.useVirtualLayout = false;
        this.weiboList.dataProvider = this.ac;
        this.weiboList.itemRenderer = WeiboListItem;
        this.weiboList.useVirtualLayout = false;
        this.init();
        this.headImg.mask = this.maskImg;
        this.setHeart(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts);
        
        CommomBtn.btnClick(this.backBtn,this.close,this,2);
    }
    /**从场景中移除*/
    public onRemove() {
        CommomBtn.removeClick(this.backBtn,this.close,this);
    }

    /**关闭 */
    private close() {
        this.hide();
        var gamescene = App.SceneManager.getScene(SceneConst.GameScene) as GameScene;
        gamescene.enterAnimation();

    }

    private init() {

        let weiboData = [];

        let weibo = App.DataCenter.Weibo;
        console.log("weibo11111111111", weibo);
        if (weibo) {
            let data = weibo.data;
            this.girlNeme.text = weibo.name;
            this.headImg.source = weibo.weibo_head;

            weiboData = data;
        }


        this.arr = [];
        var data = weiboData;
        this.arr = data;
        this.ac.source = this.arr;




    }


    /**设置心动值 */
    public setHeart(str, h) {
        if (h && h != "") {
            this.heartPlugin.setJindu(str, h);
        }
    }


}