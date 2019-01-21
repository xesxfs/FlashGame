/**
 * 收藏信息
 * @author sven 
 * 2017/12/27
 */
class CollectionInfo {
	public bgImg:Array<CollectionVo>;     //背景图
	public recall:Array<CollectionVo>;   //回忆
	public treasure:Array<CollectionVo>;  //珍藏
	public bgMus:Array<CollectionVo>;       //背景音
    public giftBgi:Array<CollectionVo>;
    public giftVedio:Array<CollectionVo>;

	public readData(data){
        this.bgImg = [];
        this.recall = [];
        this.treasure = [];
        this.bgMus = [];
        this.giftBgi = [];
        this.giftVedio = [];

        for (let i = 0;i < data[CollectionType.BgImg].length;i ++) {
            let item: CollectionVo = new CollectionVo();
            item.localTypes = CollectionType.BgImg;
            item.readContent(data[CollectionType.BgImg][i]);
            this.bgImg.push(item);
        }

        for (let i = 0;i < data[CollectionType.Recall].length;i ++) {
            let item: CollectionVo = new CollectionVo();
            item.localTypes = CollectionType.Recall;
            item.readContent(data[CollectionType.Recall][i]);
            this.recall.push(item);
        }

        for (let i = 0;i < data[CollectionType.Treasure].length;i ++) {
            let item: CollectionVo = new CollectionVo();
            item.localTypes = CollectionType.Treasure;
            item.readContent(data[CollectionType.Treasure][i]);
            this.treasure.push(item);
        }

        for (let i = 0;i < data[CollectionType.BgMus].length;i ++) {
            let item: CollectionVo = new CollectionVo();
            item.localTypes = CollectionType.BgMus;
            item.readContent(data[CollectionType.BgMus][i]);
            this.bgMus.push(item);
        }

        for (let i = 0;i < data[CollectionType.GiftImg].length;i ++) {
            let item: CollectionVo = new CollectionVo();
            item.localTypes = CollectionType.GiftImg;
            item.readContent(data[CollectionType.GiftImg][i]);
            this.giftBgi.push(item);
        }

        for (let i = 0;i < data[CollectionType.GiftVedio].length;i ++) {
            let item: CollectionVo = new CollectionVo();
            item.localTypes = CollectionType.GiftVedio;
            item.readContent(data[CollectionType.GiftVedio][i]);
            this.giftVedio.push(item);
        }
	}
}

class CollectionVo{
    public localTypes: CollectionType;

    /**解锁消耗 */
	public cons: number;
    public id: number;
    /**0.未锁 1.锁定 */
    public locked: number;
    public title: string;
    public types: number;

    /**图片地址 */
    public uri: string;
    public use_status: number;

    /**解锁天数 */
    public days: number;
    /**视频名字 */
    public ossvid: string;
    /**碎片数量 */
    public piece: number;
    /**预览图 */
    public preview: string;

    /**送礼心数 */
    public hearts: number;
    /**送礼解锁 */
    public lock: number;

    /**珍藏视频名称 */
    public name: string;

    public readContent(data) {
        this.cons = data.cons;
        this.id = data.id;
        this.locked = data.locked;
        this.title = data.title;
        this.types = data.types;

        this.uri = data.uri || "-";
        this.use_status = data.use_stauts || 0;
        
        this.days = data.days;
        this.ossvid = data.ossvid || "-";
        this.piece = data.piece || 0;
        this.preview = data.preview || "";

        this.hearts = data.hearts || 0;
        this.lock = data.lock || 0;

        this.name = data.name || "";
    }
}

/**收藏类型 */
class CollectionType{
	public static BgImg:string = "bgi";        //背景图
	public static Recall:string = "mem";          //回忆
	public static Treasure:string = "fav";          //珍藏
	public static BgMus:string = "bgm";         //背景音
    public static GiftImg:string = "gift_bgi";
    public static GiftVedio:string = "gift_video";
}
 