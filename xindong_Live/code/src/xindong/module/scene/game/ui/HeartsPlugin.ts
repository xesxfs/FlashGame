/**
 * 恋爱值组件
 * @author  xiongjian
 * @date 2017/9/12
 */
class HeartsPlugins extends BaseUI {
    public bar: eui.Image;             //进度条    
    public heartLabel:eui.BitmapLabel; //亲密度文本
    public maxImg: eui.Image;          //max图片
    private ImgWidth: number = 255;

    public constructor() {
        super();
        this.skinName = "HeartsPluginSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {
       
    }

    /**添加到场景中*/
    protected onEnable() {
        
    }

    /**从场景中移除*/
    protected onRemove() {

    }

    /**
     * 设置进度
     */
    public setJindu(curHeart, maxHeart) {
        //设置亲密度文本，最大显示9999
        curHeart = (curHeart > 9999)?9999:curHeart;
        this.heartLabel.text = curHeart + "/" + maxHeart;

        //设置进度条和max动画
        if(curHeart >= maxHeart){
            this.bar.width = this.ImgWidth;
            this.showMax(true);
        }else{
            this.bar.width = (curHeart/maxHeart)*this.ImgWidth;
            this.showMax(false);
        }
    }

    /**
     * 显示max
     */
    public showMax(bo: boolean) {
        if (bo) {
            this.maxImg.visible = true;
            egret.Tween.get(this.maxImg, { loop: true }).set({ scaleX: 0.8, scaleY: 0.8 }).to({ scaleX: 1.2, scaleY: 1.2 }, 800).to({ scaleX: 0.8, scaleY: 0.8 }, 800);
        } else {
            this.maxImg.visible = false;
            egret.Tween.removeTweens(this.maxImg);
        }
    }


}