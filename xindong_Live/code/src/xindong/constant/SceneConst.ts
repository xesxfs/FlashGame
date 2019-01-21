/**
 * 场景常量
 * 变量值必须与类名一致，否则SceneManager无法尝试创建Scene (另外enum是数字，做为Object的key，遍历该Object时会出错)
 * @author chenkai 
 * @date 2016/11/9
 */
class SceneConst{
    public static LoadScene:string = "LoadScene";    //加载界面
    public static LoginScene:string = "LoginScene";  //登录界面
    public static GameScene:string = "GameScene";    //游戏界面
}