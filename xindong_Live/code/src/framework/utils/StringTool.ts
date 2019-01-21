/**
 * 字符串工具类
 * @author chenkai
 * @date 2016/9/13
 */
class StringTool {

	/** 检查手机号码是否正确
	 * @param phone 手机号码
	 */
	public static checkPhone(phone:string){
		if((/^1[34578]\d{9}$/.test(phone))){ 
			return true; 
		}
		return false;
	}

	/**
	 * 字符串大于一定长度时，进行换行(增加换行符"\n")
	 * @param str 字符串
	 * @param num 限制长度
	 */
	public static formatWrap(str:string, num:number){
		let result = "";
		let row = Math.ceil(str.length/num); //有几行

		//大于1行时，进行换行处理
		if(row > 1){
			let i;
			for(i=0; i<row; i++){
				if(i < row-1){
					result += str.substr(i*num, num) + "\n";  //"123456" substr(0,3) =>"123"
				}else{
					//最后一行
					result += str.substr(i*num, str.length);
				}
			}
		}else{
			result = str;
		}
		return result;
	}


	/**
	 * 删除左右两端的空格.   " abc " - > "abc"
	 * @str 待处理字符串
	 * @is_global 是否处理中间空格
	 * @return 处理后字符串
	 */
	public static trim(str, bGloal:boolean = false){
		let result;
		result = str.replace(/(^\s+)|(\s+$)/g,"");
		if(bGloal){
			result = result.replace(/\s/g,"");
		}
		return result;
　　 }



	/**
	 * 将字符串截取到指定字符数，多余的用"..."表示
	 * @str 昵称字符串
	 * @charMax 字符限制(中文、大写字母占2， 其余占1 Egret中文英文字符都是占1
	 */
	public static formatStrLen(str:string, charMax:number = 10){
		var len = this.getStrLength(str);
		if(len > charMax){
			return str.substr(0, charMax) + "...";   //"abc".substr(0,1) = "a"
		}
		return str; 
	}

	/**
	 * 获取字符串长度，中文、大写字母占2， 其他占1 (Egret中文英文字符都是占1)
	 * @str 字符串
	 * @reutrn 长度
	 */
	public static getStrLength(str:string):number{
		var len = 0;    
		var charCode = 0;
		for (var i=0; i<str.length; i++) {   
			charCode =  str.charCodeAt(i);
			if (charCode > 127 || (charCode>=65 && charCode <=90)) {    
				len += 2;    
			} else {
				len ++;    
			}    
		}    
		return len; 
	}

	/**
	 * 格式化时间  100 => 01:40
	 */
	public static formatClock(count:number){
		let result:string;
		if (count < 60) {
            if (count < 10) {
                result = "00:0" + count
            } else {
                result = "00:" + count
            }
        }else{
            let fen = Math.floor(count / 60);//分钟
            let miao = Math.floor(count % 60);//秒
            if (fen < 10) {
                if (miao < 10) {
                    result = "0" + fen + ":0" + miao
                } else {
                    result = "0" + fen + ":" + miao
                }
            }
            if (fen >= 10 && fen < 60) {
                if (miao < 10) {
                    result = fen + ":0" + miao
                } else {
                    result = fen + ":" + miao
                }
            }
            if (fen == 0) {
                if (miao < 10) {
                   result = "00:0" + miao
                } else {
                    result = "00:" + miao
                }
            }
        }
		return result;
	}

	/**
	 * 当金币(钻石等)>=100w时，使用缩写  1720000 = > 100.7w
	 * @param money 需要转换的钱数
	 * @param limit 钱到了多少w上限，开始转化，默认100w
	 */
	public static formatMoney(money:number, limit:number = 1000000){
		let result:string;
		if(money >= limit){
			result = Math.floor(money/10000) + Math.floor(money%10000/1000)/10 + "w";
		}else{
			result = money + "";
		}
		return result;
	}

	
}