module TipsHeat {
	/**
	 *
	 * @author xiongjian
	 *2017/9/8
	 */

    /*
     * 警告
     */
    export function showHeat(str: number) {

        show(str);
    }

    function show(str: number) {
        var tipGro = new eui.Group();
        tipGro.width = 100;
        tipGro.height = 100;
        tipGro.x = (App.StageUtils.stageWidth - tipGro.width) / 2;
        tipGro.y = (App.StageUtils.stageHeight - tipGro.height) / 2;


        var tipText = new eui.Label();
        tipText.height = 40;
        tipText.text = "" + str;
        tipText.x = tipGro.width;
        tipText.y = (tipGro.height) / 2 - 15;

        var tipsBg = new eui.Image();
        if (str >= 0) {
            tipsBg.texture = RES.getRes("main2_tili_png");
        } else {
            tipsBg.texture = RES.getRes("weixin2_xinsui_png");
        }
        tipsBg.width = 50;
        tipsBg.height = 50;
        tipsBg.x = (tipGro.width - tipsBg.width) / 2;
        tipsBg.y = (tipGro.height - tipsBg.height) / 2;

        tipGro.addChild(tipsBg);
        tipGro.addChild(tipText);
        App.LayerManager.tipLayer && App.LayerManager.tipLayer.addChild(tipGro);
        console.log("xy", tipGro.x, tipGro.y);
        egret.Tween.get(tipGro).set({ x: tipGro.x, y: tipGro.y }).to({ x: 20, y: 20 }, 1000).call(() => {
            egret.Tween.removeTweens(tipGro);
            App.LayerManager.tipLayer.removeChildren();
        });
    }
}
