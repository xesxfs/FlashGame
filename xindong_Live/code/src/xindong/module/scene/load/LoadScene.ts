/**
 * 资源加载界面
 * @author xiongjian
 * @date 2017/08/24
 */
class LoadScene extends BaseScene {
    /**控制模块*/
    protected ctrl: LoadMediator;
    /**进度文本*/
    private percentLab: eui.Label;
    /**进度条 */
    public probg: eui.Image;
    public proImg: eui.Image;

    public constructor(ctrl:LoadMediator) {
        super();
        this.skinName = "LoadSceneSkin";
        this.ctrl = ctrl;
    }

    protected childrenCreated() {

    }

    public onEnable() {
        this.setProgress(0);
        this.loadAsset();
    }

    public onRemove() {
        this.setProgress(0);
    }

    /**
     * 设置加载进度
     * @value 进度 0-100
     */
    public setProgress(value: number) {
        if (this.percentLab) {
            this.percentLab.text = value + "%";

        }
        if (this.proImg && this.probg) {
            this.proImg.width = value * (this.probg.width-18) / 100;  //-18 避免进度条超出背景条
        }
    }

    /**加载资源 */
	private loadAsset(){
		//因为原项目开始时没有分配好资源组，也没有模块加载等待的设置，这里网页版就不再费力细分了，只是将除了bgm之外的的mp3静默加载。
		let loadList = [
                        AssetConst.Preload,
                        //主场景
                        AssetConst.Login,AssetConst.Hall,AssetConst.Common,
                        //模块
                        AssetConst.Work,AssetConst.Act,AssetConst.Bag,
                        AssetConst.Collection, AssetConst.Interact,AssetConst.Love,
                        AssetConst.Rank, AssetConst.Set, AssetConst.Shop,AssetConst.Tel_And_Wx,AssetConst.Shop,
                        //动画、字体、配置、音乐
						AssetConst.ANIM,AssetConst.Font,AssetConst.Config,AssetConst.Music];
        App.ResUtils.loadGroup(loadList, this.loadLoginProgress, this.loadLoginComplete, this);
	}

	/**加载大厅界面进度 */
	private loadLoginProgress(e: RES.ResourceEvent) {
		this.setProgress(Math.round(e.itemsLoaded / e.itemsTotal * 100));
	}

	/**加载大厅界面完成 */
	private loadLoginComplete() {
		//静默加载mp3
		App.ResUtils.loadGroup(AssetConst.Music);

		this.showGameAdvice();
	}

	/**显示健康游戏忠告 */
	private showGameAdvice(){
		let gameAdvice:GameAdviceUI = new GameAdviceUI();
		this.addChild(gameAdvice);
		egret.Tween.get(this).wait(2000).call(()=>{
			this.removeChild(gameAdvice);
			gameAdvice = null;
			this.gotoLogin();
		},this);
	}

	/**跳转到登录界面 */
	private gotoLogin(){
        App.EventManager.sendEvent(LoginMediator.SHOW_LOGIN_SCENE);
	}



}