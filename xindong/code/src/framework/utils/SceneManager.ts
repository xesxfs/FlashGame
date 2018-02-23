/**
 * 场景管理类
 * @author chenkai
 * @date 2016/12/23
 * @example
 * sceneManager.register("GameScene", new GameScene());
 * sceneManager.open("GameScene", 123);
 */
class SceneManager extends SingleClass {
    /**面板实例*/
    private sceneMap = {};
    /**当前场景*/
    private curScene: BaseScene;

    public constructor() {
        super();
    }

	/**
	 * 注册场景
	 * @sceneName 场景名
	 * @scene     场景实例
	 */
    public register(sceneName: string, scene:BaseScene) {
        if(this.sceneMap[sceneName] != null){
            console.log("SceneManager >> 场景已存在:",sceneName);
            return;
        }
        this.sceneMap[sceneName] = scene;
    }

    /**注销 */
    public unRegister(sceneName:string){
        let scene:BaseScene = this.sceneMap[sceneName];
        if(scene){
            delete this.sceneMap[sceneName];
            scene.destoryMe();
        }
    }

	/**
	 * 打开场景
	 * @sceneName 场景名
     * @data 传入数据
	 */
    public open(sceneName: string, data:any =null) {
        var scene: BaseScene = this.sceneMap[sceneName];

        //如果scene不存在，则尝试新建一个
        if(scene == null){
            let clz = egret.getDefinitionByName(sceneName);
            if(clz){
                scene = new clz();
                this.register(sceneName, scene);
            }
        }

        //如果scene存在，则打开
        if(scene) {
            var removeScene: BaseScene = this.curScene;
            this.curScene = scene;

            if(removeScene) {
                removeScene.once(egret.Event.REMOVED_FROM_STAGE,() => {
                    removeScene.onRemove();
                },this);
                App.LayerManager.sceneLayer.removeChild(removeScene);
            }

            (<BaseScene>scene).once(egret.Event.ADDED_TO_STAGE,() => {
                scene.onEnable(data);
            },this);
            App.LayerManager.sceneLayer.addChild(scene);
        }else{
            console.error("SceneManager >> 场景不存在:", sceneName);
        }
    }

    /**
     * 获取场景
     * @sceneName 场景名
     */
    public getScene(sceneName:string){
        return this.sceneMap[sceneName];
    }

	/**
	 * 获取当前场景
	 */
    public getCurScene(): BaseScene {
        return this.curScene;
    }
}