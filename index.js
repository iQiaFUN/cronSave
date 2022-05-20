const cron = require('node-cron');
const path = require('path');
const tmpcfg = JSON.parse(NIL.IO.readFrom(path.join(__dirname, 'example.json')));

function checkFile(file, text) {
    if (NIL.IO.exists(path.join(__dirname, file)) == false) {
        NIL.IO.WriteTo(path.join(__dirname, file), text);
    }
}

checkFile("config.json", tmpcfg);
const cfg = JSON.parse(NIL.IO.readFrom(path.join(__dirname, 'config.json')));

class CronSave extends NIL.ModuleBase{
	onStart(api){
		//插件加载
		api.logger.info('CronSave启动成功');
		checkFile('playerdata.json', '{}')
		//定时启动
		cron.schedule(cfg.cron, () => {
			// 0 0/10 * * * * 每十分钟保存一次用户数据
			// 0 0/30 * * * * 每三十分钟保存一次用户数据
			api.logger.info('用户数据备份中');
			const getdata = NIL._vanilla.get_all();
			const tmp = JSON.parse(JSON.stringify(getdata, null, '\t'));
			NIL.IO.WriteTo(path.join(__dirname, 'playerdata.json'), JSON.stringify(tmp, null, '\t'));
			api.logger.info('用户数据备份完成');
		});	
	}
	onStop(){}
}




module.exports = new CronSave;
