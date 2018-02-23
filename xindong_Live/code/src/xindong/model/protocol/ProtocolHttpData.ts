/**
 * http请求返回结构
 * @author xiongjian
 * @date 2017/8/30
 */
class ProtocolHttpData {

    /**注册 */
    public static register = {
        info: "",
        code: 0,
        data: {
            skey: "",
            user: ""
        }
    }

    /**登录 */
    public static login = {
        info: "",
        code: 0,
        data: {
            skey: "",
            user: ""
        }
    }

    /**游客登录 */
    public static guest = {
        info: "",
        code: 0,
        data: {
            skey: "",
            user: ""
        }
    }

    /**登出 */
    public static logout = {
        info: "",
        code: 0,
        data: {}
    }

    /**游戏信息 */
    public static gameInfo = {
        info: "",
        code: 0,
        data: {
            tel: {},
            love:[],
            work:[],
            shop:[],
            back:[],
            video:[],
            weibo:[],
            power:{},
            question:{
                qcons: 0,
                qtimes: 0,
                qtype: "gold"
            },
            love_tips: [],
            config: {
                update_time: {
                },
                avilable_event: [],
                event_id: 0,
                oid: 0,
                main_event: [],
                days: 0,
                mark: {
                },
                create_time: {
                },
                video: "",
                girl_name:"",
                hearts: 0,
                id: 0
            },
            wechat: {
                0: {
                    update_time: {
                    },
                    uid: 0,
                    start_id: 0,
                    days: 0,
                    create_time: {
                    },
                    chat_id: 0,
                    dialog: [],
                    id: 0,
                    types: 0
                },
            },
            userinfo: {
                update_time: "",
                elove_id: {
                },
                echat_id: 0,
                gold: 0,
                evideo_id: {
                },
                eback_id: {
                },
                days: 0,
                power: 0,
                event_id: 1,
                create_time: {
                },
                eweibo_id: {
                },
                hearts: 0,
                id: 0,
                ework_id: {
                },
                uid: "",
                user_name:"",
                diamond:0,
                wc_wait:0,
                nick_name:"",
                bgi: "",
                bgm: "",
                gift_bgi: "",
                gift_score: 0,
                role: 0
            }
        }
    }

    /**消息实体 */
    public static messageInfo = {
        chat_id: 0,
        create_time: null,
        days: 0,
        dialog: [],
        id: 0,
        start_id: 0,
        types: 0,
        uid: 0,
        update_time: null
    }

    /**dialog消息实体 */
    public static dialog = {
        audio: "",
        pid: 0,
        reply: 0,
        role: 0,
        content: "",
        score: 0,
        sid: 0,
        status: 0,
    }

    /**tel 消息实体 */
    public static tel = {
        chat_id: 0,
        create_time: "",
        days: 0,
        dialog: [],
        id: 0,
        start_id: 0,
        types: 0,
        uid: 0,
        update_time: ""
    }

    /**wechat 消息实体 */
    public static wechat = {
        chat_id: 0,
        create_time: "",
        days: 0,
        dialog: [],
        id: 0,
        start_id: 0,
        types: 0,
        uid: 0,
        update_time: ""
    }

    /**公告 */
    public static attention = 
    {
        "info": "success",
        "code": 200,
        "data": {
            "qq": "123123",
            "update_time": null,
            "title": "至亲爱的玩家",
            "content": "心动女生将于2017年12月3日进行停服,给同学们带来的不便,敬请谅解",
            "create_time": null,
            "wechat": "123123",
            "id": 1
        }
    }

}