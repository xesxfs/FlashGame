/**
 * 背包列表Item 
 * @author xiongjian 
 * @date 2017/9/11
 */
class BagListItem extends eui.ItemRenderer {

    public daojuImg: eui.Image;   //道具图片
    public maskImg:eui.Rect;      //道具图片遮罩
    private nameLabel:eui.Label;  //名称
    public loveFlagImg:eui.Image; //恋爱标识

    private transData;

    public constructor() {
        super();
        this.skinName = "BagListItemSkin";
    }

    protected childrenCreated(){
        this.daojuImg.mask = this.maskImg;
    }

    protected dataChanged(){
        //图片
        this.daojuImg.source = RES.getRes(this.data.pic);
        //名称
        this.nameLabel.text = this.data.cname + "x" + this.data.count;
        //恋爱标识
        if(this.data.utype == "love"){
            this.loveFlagImg.visible = true;
        }else{
            this.loveFlagImg.visible = false;
        }
    }
}