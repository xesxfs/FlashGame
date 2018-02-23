class LocalStorageUtil extends SingleClass {
	public constructor() {
		super();
	}


	public set allowMusic(allow: boolean) {
		this.saveItem("allowMusic", (allow ? "1" : "0"))
	}

	public get allowMusic(): boolean {
		var item = this.loadItem("allowMusic")
		if (item == null) {
			this.allowMusic = true;
			item = "1"
		}
		return !!parseInt(item);
	}

	public set allowEffect(allow: boolean) {
		this.saveItem("allowEffect", (allow ? "1" : "0"))
	}

	public get allowEffect(): boolean {
		var item = this.loadItem("allowEffect")
		if (item == null) {
			this.allowEffect = true;
			item = "1"
		}
		return !!parseInt(item);
	}


	public set autoVoice(allow: boolean) {
		this.saveItem("autoVoice", (allow ? "1" : "0"))
	}

	public get autoVoice(): boolean {
		var item = this.loadItem("autoVoice")
		if (item == null) {
			this.autoVoice = true;
			item = "1"
		}
		return !!parseInt(item);
	}

	public get guest(): string {
		var item = this.loadItem("guest")
		if (item == null) {
			this.guest = item;
		}
		return item;
	}

	/**用户账号 */
	public set account(name: string) {
		if (name && name != "") {
			this.saveItem("account", name);
		}

	}

	/**用户账号 */
	public get account(): string {
		var item = this.loadItem("account")
		if (item == null) {
			this.account = item;
		}
		return item;
	}
	
	public set guest(name: string) {
		if (name && name != "") {
			this.saveItem("guest", name);
		}

	}

	public set nickName(name: string) {
		if (name && name != "") {
			this.saveItem("nickName", name);
		}

	}

	public get nickName(): string {
		var item = this.loadItem("nickName")
		if (item == null) {
			this.nickName = item;
		}
		return item;
	}

	public set username(name: string) {
		if (name && name != "") {
			this.saveItem("username", name);
		}

	}

	public get username(): string {
		var item = this.loadItem("username")
		if (item == null) {
			this.username = item;
		}
		return item;
	}

	/**用户密码 */
	public set password(psd: string) {
		if (psd && psd != "") {
			this.saveItem("password", psd);
		}
	}

	/**用户密码 */
	public get password(): string {
		var item = this.loadItem("password")
		if (item == null) {
			this.password = item;
		}
		return item;
	}

	public set telGuide(name: string) {
		if (name && name != "") {
			this.saveItem("telGuide", name);
		}

	}

	public get telGuide(): string {
		var item = this.loadItem("telGuide")
		if (item == null) {
			this.telGuide = item;
		}
		return item;
	}

	private saveItem(key: string, data: string) {
		if (!key) return
		egret.localStorage.setItem(key, data)
	}


	private loadItem(key: string): string {
		if (!key) return
		return egret.localStorage.getItem(key);
	}

}