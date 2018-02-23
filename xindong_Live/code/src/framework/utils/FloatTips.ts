/**
 * 悬浮弹窗
 * @author Sven
 * 2017/12/28
 */
class FloatTips extends eui.Component {
    private floatWidth = 216;
    private floatHeight = 150;
    private designWidth = 1280;
    private designHeight = 960;
    private showTime = 300;
    private rootLayer: any;
    private timer: DateTimer;
    private currentTouch: eui.Component;
    private touchX: number;
    private touchY: number;
    private numLab:eui.Label;

    private dataList: Array<any> = [];

    public constructor(stage: any) {
      super();
      this.rootLayer = stage;
      this.skinName = FloatTipsSkin;
	}

    /**获取悬浮弹窗单例 */
    public static Instance(stage: any = null):FloatTips {
        var Class: any = this;
        if(Class.instance == null) {
            Class.instance = new Class(stage);
        }
        return Class.instance;
    }

    /**
     * 添加长按监听
     * @param item 目标
     * @param data 传给悬浮窗的数据
     */
    public addFloatListenerFor(item: eui.Component, data: any) {
        for (let i = 0;i < this.dataList.length;i ++) {
            if (this.dataList[i].item == item) {
                return;
            }
        }
        this.addToList(item, data);
        item.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
        item.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        item.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onEnd, this);
        item.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this);
    }

    /**
     * 移除长按监听
     */
    public removeFloatListenerFrom(item: eui.Component) {
        this.removeFromList(item);
        item.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
        item.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        item.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onEnd, this);
        item.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this);
    }

    private show(data: any) {
        // console.log("showData--:", data);
        this.rootLayer.addChild(this);
        let cfgList:Array<InteractGiftDescVo> = App.DataCenter.interactGiftInfo.giftDescList;
        this.numLab.text = "赠礼满" + cfgList[data.index].hearts;
        this.setPos_ZuoShang();
    }

    private setPos_ZuoShang() {
        let lastX = this.touchX - this.floatWidth;
        let lastY = this.touchY - this.floatHeight;
        lastX<0?lastX=0:0;
        lastY<0?lastY=0:0;
        lastX>this.designWidth-this.floatWidth?lastX=this.designWidth-this.floatWidth:0;
        lastY>this.designHeight-this.floatHeight?lastY=this.designHeight-this.floatHeight:0;
        this.x = lastX;
        this.y = lastY;
    }

    private hide() {
        this.parent && this.parent.removeChild(this);
    }

    private addToList(item: eui.Component, data: any) {
        let info = {
            item: item,
            data: data
        }
        this.dataList.push(info);
    }

    private removeFromList(item) {
        for (let i = 0;i < this.dataList.length;i ++) {
            if (this.dataList[i].item == item) {
                this.dataList.splice(i, 1);
                return;
            }
        }
    }

    private onBegin(event: egret.TouchEvent) {
        this.currentTouch = event.target;
        this.touchX = event.stageX;
        this.touchY = event.stageY;

        if (this.timer) {
            this.timer.reset();
        }
        else {
            this.timer = new DateTimer(this.showTime);
            this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimerComplete,this);
        }
		this.timer.start();
    }

    private onTimerComplete() {
        this.timer.stop();
        var curData: any;
        for (let i = 0;i < this.dataList.length;i ++) {
            if (this.dataList[i].item == this.currentTouch) {
                curData = this.dataList[i].data;
                break;
            }
        }
        this.show(curData);
        this.currentTouch = null;
    }

    private onEnd(event: egret.Event) {
        this.currentTouch = null;
        this.timer.stop();
        this.hide();
    }
}
