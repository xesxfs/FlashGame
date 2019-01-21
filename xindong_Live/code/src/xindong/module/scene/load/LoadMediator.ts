/**
 * 资源加载控制模块
 * @author xiongian
 * @date 2017/8/24
 */
class LoadMediator extends Mediator {
	public static NAME: string = "LoadMediator";
	/**显示加载界面 */
    public static SHOW_LOAD_SCENE = "SHOW_LOAD_SCENE";  
	/**加载界面 */
	public loadScene:LoadScene;

	public constructor() {
		super();
		this.loadScene = new LoadScene(this);
		App.SceneManager.register(SceneConst.LoadScene, this.loadScene);
	}

	public onRegister() {
		this.addEvent(LoadMediator.SHOW_LOAD_SCENE,this.onShowLoadScene,this);
	}

	public unRegister() {
		this.removeEvent(LoadMediator.SHOW_LOAD_SCENE,this.onShowLoadScene,this);
	}


    /**显示加载场景 */
    private onShowLoadScene(){
		App.SceneManager.open(SceneConst.LoadScene);
    }

	

}