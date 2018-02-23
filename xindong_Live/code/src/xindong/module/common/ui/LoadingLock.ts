/**
 * 资源加载等待时锁定动画
 * @author chenkai
 * @date 2016/9/19
 */
class LoadingLock extends eui.Component {
    /**黑色Rect底图*/
    private rect: eui.Rect;
    /**超时计时器*/
    private overTimer: egret.Timer = new egret.Timer(10000, 1);
    /**超时回调*/
    private callBack: Function;
    /**超时回调执行对象*/
    private thisObject: any;
    /**延时器编号 */
    private timeNum: number;
    /**存放动画的Group */
    private mcGroup:eui.Group;
    /**加载心形动画 */

    private loadingAnim:LoadingAnim;
    
    //加载文字
    private loadingLabel:eui.Label;

    public constructor(){
        super();
        this.skinName = "LoadingLockSkin";
        this.percentWidth = 100;
        this.percentHeight = 100;
    }

    /**
     * 锁定
     * @callBack 超时回调
     * @thisObject 超时回调执行对象
     * @bUseOverTime 是否使用超时计时器。true 超时后自动unlock； false 一直锁住直到手动unlock
     */
    public lock(callBack: Function = null, thisObject: any = null, bUseOverTime:boolean = true, desc: string = "加载中..."): void {
        this.callBack = callBack;
        this.thisObject = thisObject;
        //TODO 取消请求超时，因为超时后没有处理超时引起的问题
        //bUseOverTime && this.startOverTimer();
        if(this.loadingAnim == null){
            this.loadingAnim = new LoadingAnim();
        }

        this.loadingLabel.text = desc;
        this.loadingLabel.visible = false;
        this.rect.alpha = 0;
        App.LayerManager.lockLayer.addChild(this);

        //延迟播放动画
        egret.Tween.get(this).wait(500).call(()=>{
            this.loadingLabel.visible = true;
            this.rect.alpha = 0.5;
            this.loadingLabel.visible = true;
            this.mcGroup.addChild(this.loadingAnim);
            this.loadingAnim.play(-10);
            App.LayerManager.lockLayer.addChild(this);
        },this);
    }

    //http请求遮罩
    public httpLock(callBack: Function = null, thisObject: any = null) {
        //egret.Tween.get(this).wait(500).call(()=>{
            this.lock(callBack, thisObject);
        //},this);
    }

    //锁定，无动画效果
    public lockNoAnim(){
        this.loadingLabel.visible = false;
        this.rect.alpha = 0;
        this.loadingLabel.visible = false;
        App.LayerManager.lockLayer.addChild(this);
    }

    //停止加载动画
    public unlock() {
        egret.Tween.removeTweens(this);
        this.callBack = null;
        this.thisObject = null;
        this.stopOverTimer();
        this.loadingAnim && this.loadingAnim.hide();
        this.parent && this.parent.removeChild(this);
    }

    //开始超时计时
    private startOverTimer() {
        this.overTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
        this.overTimer.reset();
        this.overTimer.start();
    }

    //停止超时计时
    private stopOverTimer() {
        this.overTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
        this.overTimer.stop();
    }

    //超时
    private onTimerComplete() {
        if (this.callBack != null && this.thisObject != null) {
            this.callBack.call(this.thisObject);
        }
        this.unlock();
    } 

    
    private screenRect:eui.Rect;
    /**锁住屏幕 为了播放视频前不让用户点击而锁...*/
    public lockScreen(){
        if(this.screenRect == null){
            this.screenRect = new eui.Rect(App.StageUtils.stageWidth, App.StageUtils.stageHeight, 0x000000);
            this.screenRect.alpha = 0;
        }
        //只锁住scene和panel，不锁住dialog及以上层
        App.LayerManager.msgLayer.addChild(this.screenRect);
    }

    /**解锁屏幕 */
    public unLockScreen(){
        if(this.screenRect){
            this.screenRect.parent && this.screenRect.parent.removeChild(this.screenRect);
        }
    }


    private blackRect:eui.Rect;
    /**视频黑色遮罩，在app上video可能播放失败，只显示一个返回按钮，这时需要一个黑色遮罩... */
    public lockBlack(){
        if(this.blackRect == null){
            this.blackRect = new eui.Rect(App.StageUtils.stageWidth, App.StageUtils.stageHeight, 0x000000);
            this.blackRect.percentWidth = 100;
            this.blackRect.percentHeight = 100;
        }
        App.LayerManager.lockLayer.addChild(this.blackRect);
    }

    /**解锁视频播放时的黑色遮罩 */
    public unLockBlack(){
        if(this.blackRect){
            this.blackRect.parent && this.blackRect.parent.removeChild(this.blackRect);
        }
    }

    private static instance:LoadingLock;
    public static getInstance():LoadingLock{
        if(this.instance == null){
            this.instance = new LoadingLock();
        }
        return this.instance;
    }
}