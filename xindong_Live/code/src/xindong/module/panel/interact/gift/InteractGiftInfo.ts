/**
 * 互动礼物信息
 * @author sven 
 * 2017/12/28
 */
class InteractGiftInfo {
    public bgi: string;
    public giftItemList: Array<InteractGiftItemVo>;
    public giftDescList: Array<InteractGiftDescVo>;
    public giftTipsList: Array<InteractGiftTipVo>;

    public readData(data) {
        this.bgi = data.bgi;
        this.giftDescList = data.gift_config;
        this.giftItemList = data.gifts;
    }
}

class InteractGiftItemVo {
    public buy_times: number;
    public cname: string;
    public count: number;
    public desc: string;
    public ename: string;
    public id: number;
    /**能否主动使用 */
    public initiative: boolean;
    public is_limit: false;
    public pic: string;
    public price: number;
    public quantity: number;
    public show: any;
    public tid: number;
    public utype: string;
}

class InteractGiftDescVo {
    public des: string;
    public gift_bgi: string;
    public hearts: number;
    public id: number;
    public level: number;
    public lock: number;
    public preview: string;
    public video: string;
}

class InteractGiftTipVo {
    public audio: string;
    public id: number;
    public status: number;
    public tips: string;
    public level: number;
    public rate: number;
}