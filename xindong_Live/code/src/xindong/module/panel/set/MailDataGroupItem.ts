/**
 * 邮件领取group item 
 * @author xiongjian 
 * @date 2017/10/9
 */
class MailDataGroupItem extends BaseUI {

    public giftImage: eui.Image;
    public giftName: eui.Label;
    public giftCount: eui.Label;


    public constructor() {
        super();
        this.skinName = "MailDataGroupItemSkin";
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

    /**设置图片 */
    public setImage(url){
        if(url!=""){
            this.giftImage.source = RES.getRes(url);
        }
    }

    /**设置名称 */
    public setName(name){
        if(name!=""){
            this.giftName.text = name;
        }
    }

    /**设置数量 */
    public setCount(count){
        if(count!=""){
            this.giftCount.text = "x"+count;
        }
    }



}