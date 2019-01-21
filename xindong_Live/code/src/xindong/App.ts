/**
 * App主类 心动主播版
 * @author xiongjian
 * @date 2017/08/24 

 */
class App extends Facade {

    /**启动框架*/
    public startUp(stage:egret.Stage): void {
        App.StageUtils.stage = stage;                       //保存全局Stage
        App.StageUtils.someScreenShowAll();                 //某些屏幕分辨率采用showAll模式
        App.SoundManager.windowFocusHandler();              //失去或获得窗口焦点时，背景音乐控制
        LogICT.getInstance();                               //console拦截器
        egret.registerFontMapping("fzyc","font/fzyc.TTF");  //加载外部字体
        App.NativeBridge.customLoadingFlag();               //通知runtime加载页面已就绪,可以关闭runtime loading

        //注册Mediator
        this.registerMediator(AppMediator.NAME , new AppMediator());
        this.registerMediator(LoadMediator.NAME, new LoadMediator());
        this.registerMediator(LoginMediator.NAME, new LoginMediator());
        this.registerMediator(GameMediator.NAME, new GameMediator());

        //显示加载资源界面
        this.sendEvent(LoadMediator.SHOW_LOAD_SCENE);
    }

    /**数据中心*/
    public static get DataCenter(): DataCenter {
        return DataCenter.getInstance();
    }

    /**设备工具类*/
    public static get DeviceUtils(): DeviceUtils {
        return DeviceUtils.getInstance();
    }

    /**舞台工具类*/
    public static get StageUtils(): StageUtils {
        return StageUtils.getInstance();
    }

    /**资源管理类*/
    public static get ResUtils(): ResUtils {
        return ResUtils.getInstance();
    }

    /**图层管理类*/
    public static get LayerManager(): LayerManager {
        return LayerManager.getInstance();
    }

    /**声音管理*/
    public static get SoundManager(): SoundManager {
        return SoundManager.getInstance();
    }

    /**语音播放管理类 */
    public static get TalkManager(): TalkManager {
        return TalkManager.getInstance();
    }

    /**事件管理类*/
    public static get EventManager(): EventMananger {
        return EventMananger.getInstance();
    }

    /**加载等待动画 新 */
    public static get LoadingLock(): LoadingLock {
        return LoadingLock.getInstance();
    }

    /**弹框管理类*/
    public static get PanelManager(): PanelManager {
        return PanelManager.getInstance();
    }

    /**场景管理类*/
    public static get SceneManager(): SceneManager {
        return SceneManager.getInstance();
    }

    /**原生通信类 */
    public static get NativeBridge(): NativeBridge {
        return NativeBridge.getInstance();
    }

    /**本地存储 */
    public static get LocalStorageUtil(): LocalStorageUtil {
        return LocalStorageUtil.getInstance();
    }

    /**Dom 中的Video */
    public static get MyVideo():MyVideo{
         return MyVideo.getInstance();
    }


}
