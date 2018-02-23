/**
 * 弹框面板加载类
 * @author chenkai
 * @date 2016/12/23
 * 
 * Example:
 * //注册面板
 * App.PanelManager.register("LoginPanel", new LoginPanel(), AssetConst.LoginPanel);
 * //打开面板
 * App.PanelManager.open("LoginPanel");
 * //关闭面板
 * App.PanelManager.close("LoginPanel");
 */
class PanelManager extends SingleClass {
    /**面板实例*/
    private panelMap = {};
    /**面板所需资源组*/
    private groupMap = {};
    /**加载等待动画 如果为null，不显示*/
    public loadAnim:egret.DisplayObject;
    /**当前打开的panel */
    private curPanel:BasePanel;

    public constructor() {
        super();
    }

	/**
	 * @注册
	 * @panelName 弹框名
     * @panel     弹框实例
     * @groupName 弹框资源组
	 */
    public register(panelName:string, panel:BasePanel, groupName: string = null) {
        this.panelMap[panelName] = panel;
        this.groupMap[panelName] = groupName;
    }

    /**
     * 注销
     * @panelName 弹框名
     */
    public unRegister(panelName:string){
        let panel:BasePanel = this.panelMap[panelName];
        if(panel){
            delete this.panelMap[panelName];
            delete this.groupMap[panelName];
            panel.destoryMe();
        }
    }

	/**
	 * 打开弹框面板，若需要实时加载资源，则加载完成后打开
	 * @panelName 面板名
     * @data 传入数据
	 * @reutrn 返回打开的面板
	 */
    public open(panelName: string,data:any = null): BasePanel {
        var panel: BasePanel = this.panelMap[panelName];
        console.log("Panelmansger >> open ", panelName);
        //如果panel不存在，则尝试新建一个
        if(panel == null){
            let clz = egret.getDefinitionByName(panelName);
            if(clz){
                panel = new clz();
                this.register(panelName, panel);
            }
        }

        //如果panel存在，则打开
        if(panel && panel.parent == null) {
            var groupName: string = this.groupMap[panelName];

            panel.once(egret.Event.ADDED_TO_STAGE,() => {
                panel.changeBgi();
                panel.onEnable(data);
            },this);
            panel.once(egret.Event.REMOVED_FROM_STAGE,() => {
                panel.onRemove();
            },this);

            //未加载资源组
            if(groupName != null && App.ResUtils.isGroupLoaded(groupName) == false) {
                this.loadAnim && App.LayerManager.lockLayer.addChild(this.loadAnim);
                App.ResUtils.loadGroup(groupName,null,() => {
                    this.loadAnim && this.loadAnim.parent && this.loadAnim.parent.removeChild(this.loadAnim);
                    this.curPanel = panel;
                    App.LayerManager.panelLayer.addChild(panel);
                },this);
            //已加载资源组
            } else {
                this.curPanel = panel;
                App.LayerManager.panelLayer.addChild(panel);
            }
        }else{
            console.log("PanelManager >> 弹框不存在或已打开:", panelName);
        }
        return panel;
    }

    /**
     * 获取面板
     * @panelName 面板名称
     */
    public getPanel(panelName:string){
        return this.panelMap[panelName];
    }

    /**
     * 获取当前面板
     */
    public getCurPanel() {
        return this.curPanel;
    }

	/**
	 * 关闭弹框
	 * @panelName 弹框名
	*/
    public close(panelName: string) {
        var panel: BasePanel = this.panelMap[panelName];
        if(panel) {
            panel.parent && panel.parent.removeChild(panel);
        }
    }

    /**
     * 关闭当前panel
     */
    public closeCurPanel(){
        if(this.curPanel){
            this.curPanel.hide();
        }
        
    }

    /**关闭所有弹框*/
    public closeAll() {
        for(var key in this.panelMap) {
            this.close(key);
        }
    }

    /**销毁所有面板 */
    public destoryAll(){
        for(let key in this.panelMap){
            this.close(key);
            delete this.panelMap[key];
        }
    }
}