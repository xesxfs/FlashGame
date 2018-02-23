/**
 * 恋爱值组件
 * @author  xiongjian
 * @date 2017/9/12
 */
class HeartsPlugins extends BaseUI {

    public jinduBg: eui.Image;
    public jinduImg: eui.Image;
    public uHeartLabel: eui.Label;
    public upHeartLabel: eui.Label;
    public maskImg: eui.Image;
    public maxImg: eui.Image;

    public constructor() {
        super();
        this.skinName = "HeartsPluginSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {

    }

    /**添加到场景中*/
    protected onEnable() {
        this.jinduImg.mask = this.maskImg;
    }

    /**从场景中移除*/
    protected onRemove() {

    }

    /**
     * 设置进度
     */
    public setJindu(a, b) {
        if (b && b != "") {
            if (a > 9999) {
                this.uHeartLabel.text = "9999";
            } else {
                this.uHeartLabel.text = a;
            }

            this.upHeartLabel.text = b;
            if (a / b >= 1) {
                this.jinduImg.width = this.jinduBg.width;
                this.showMax(true);
            } else {
                this.jinduImg.width = a / b * this.jinduBg.width;
                this.showMax(false);
            }

            if (a < 0) {
                this.jinduImg.width = 0;
                this.showMax(false);
            }

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