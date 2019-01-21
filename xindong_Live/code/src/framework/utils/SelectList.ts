/**
 * 下拉列表组件
 * @author sven
 * 2018-01-15
 */
class SelectList extends eui.Component {
    private bgImg: eui.Image;
    private tScroller: eui.Scroller;
    private itemGro: eui.Group;
    private groLayout: eui.VerticalLayout;
    private scrollerGap: number = 8;

    public constructor(bg: string = null) {
        super();
        this.createUI(bg);
    }

    private createUI(bg: string = "set_box0_png") {
        this.bgImg = new eui.Image();
        this.bgImg.texture = RES.getRes(bg);
        this.addChild(this.bgImg);

        this.tScroller = new eui.Scroller();
        this.itemGro = new eui.Group();
        this.tScroller.viewport = this.itemGro;
        this.tScroller.y = this.scrollerGap;
        this.addChild(this.tScroller);

        this.groLayout = new eui.VerticalLayout();
        this.groLayout.gap = 0;
        this.itemGro.layout = this.groLayout;
    }

    /**
     * 初始化配置
     * {    
     *      width: 100
     *      maxHeight: 500
     *      itemHeight: 100
     *      dataList: []
     *      labelOffset: 70
     * }
     */
    public initCfg(data: any) {
        if (!(data.dataList && data.dataList.length > 0)) {
            console.log("selectList cfg");
            return;
        }

        let allHeight: number;;
        if (data.dataList.length*data.itemHeight > data.maxHeight) {
            allHeight = data.maxHeight;
        }
        else {
            allHeight = data.dataList.length * data.itemHeight
        }

        this.bgImg.scale9Grid = new egret.Rectangle(this.bgImg.width / 2, this.bgImg.height / 2, 2, 2);
        this.bgImg.width = data.width;
        this.bgImg.height = allHeight + this.scrollerGap*2;

        this.tScroller.width = data.width;
        this.tScroller.height = allHeight+1;

        for (let i = 0;i < data.dataList.length;i ++) {
            let item = new SelectItem(data.width, data.itemHeight, data.labelOffset);
            item.clickCallback = data.callBack;
            item.setItemData(data.dataList[i]);
            this.itemGro.addChild(item);
        }
    }
}

class SelectItem extends eui.Component {
    private itemRect: eui.Rect;
    private itemLabel: eui.Label;
    private itemData: any;
    public clickCallback: Function;

    public constructor(width: number, height: number, offset: number = 10) {
        super();
        this.width = width;
        this.height = height;
        this.createItemUI(width, height, offset);
    }

    private createItemUI(width: number, height: number, offset: number) {
        this.itemLabel = new eui.Label();
        this.itemLabel.textColor = 0x000000;
        this.itemLabel.x = offset;
        this.itemLabel.verticalCenter = 0;
        this.addChild(this.itemLabel);

        this.itemRect = new eui.Rect();
        this.itemRect.width = width;
        this.itemRect.height = height;
        this.itemRect.fillAlpha = 0.00001;
        this.addChild(this.itemRect);

        this.itemRect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }

    public setItemData(data: any) {
        this.itemData = data;

        this.itemLabel.text = data.itemName || "item name";
    }

    private onTouch() {
        if (this.clickCallback) {
            this.clickCallback(this.itemData);
        }
    }
}