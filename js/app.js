// 元素
var container = document.getElementById('game');
var levelText = document.querySelector(".game-level"); //等级显示 当前Level: 1
var nextLevelText = document.querySelector(".game-next-level"); //下一关提示显示
var scoreText = document.querySelector(".game-info .score"); //分数显示
var totalScoreText = document.querySelector(".game-failed .score"); //游戏结果分数显示
var canvas = document.getElementById("canvas");  //获取元素
var context = canvas.getContext("2d"); //画布
var canvasWidth = canvas.clientWidth; //画布宽度
var canvasHeight = canvas.clientHeight; //画布高度
var hash = location.hash;  //当前地址栏后面的#aaa  哈希值
var isBaseVersion = hash === "#base";

// 游戏配置
var CONFIG = { //初始配置文件
	status: "start",  //初始状态 游戏开始默认为开始中
	level: 1,	//初始等级
	totalLevel: 6, //最高等级
	numPerLine: 7,  // 游戏默认每行多少个怪兽
	canvasPadding: 28, //padding
	bulletSize: 10,  //子弹速度
	bulletSpeed: 10, //子弹大小
	enemySpeed: 2, //怪物速度
	enemySize: 50, //怪物大小
	enemyGap: 10, //怪物间隔
	enemyIcon: "./img/enemy.png",  //怪物的图标
	enemyBoomIcon: "./img/boom.png", //怪物爆炸
	enemyDirection: "right", //怪物方向  默认敌人一开始往右移动
	planeSpeed: 5, //飞机 默认飞机每一步移动的距离
	planeSize: { //飞机的大小
		width: 60, 
		height: 100
	},
	planeIcon: "./img/plane.png", //飞机的图标
};
//通用的移动 绘制 用来继承的构造函数
var Element = function(a) {
	var a = a || {};
	this.x = a.x;
	this.y = a.y;
	this.size = a.size;
	this.speed = a.speed
};
Element.prototype = {
	move: function(a, d) {
		var c = a || 0;
		var b = d || 0;
		this.x += a;
		this.y += d
	},
	draw: function() {}
};

// 怪物的构造函数
var Enemy = function(a) {
  var a = a || {};
  // Element.call(this, a);  //
  this.status = "normal";  //状态  分为正常和爆炸和死亡
  this.boomCount = 0;
  this.load()
};
// 怪物往下移动
Enemy.prototype.move= function(a, d) {
  var c = a || 0;
  var b = d || 0;
  this.x += a;
  this.y += d
}
// 怪物加载
Enemy.prototype.load = function() {
	if (Enemy.icon) {
		return this
  }
  // 怪物正常
	var Img = new Image();
	Img.src = CONFIG.enemyIcon;
	Img.onload = function() {
		Enemy.icon = Img
  };
  // 怪物死亡
	var ImgBoom = new Image();
	ImgBoom.src = CONFIG.enemyBoomIcon;
	ImgBoom.onload = function() {
		Enemy.boomIcon = ImgBoom
	};
	return this
};
// 怪物重绘
Enemy.prototype.draw = function() {
  console.log("怪物绘制")
	if (Enemy.icon && Enemy.boomIcon) {
		switch (this.status) {
		case "normal":
			context.drawImage(Enemy.icon, this.x, this.y, this.size, this.size);
			break;
		case "booming":
			context.drawImage(Enemy.boomIcon, this.x, this.y, this.size, this.size);
			break
		}
	} else {
		context.fillRect(this.x, this.y, this.size, this.size)
	}
	return this
};
// 怪物死亡
Enemy.prototype.booming = function() {
	this.status = "booming";
	this.boomCount += 1;
	if (this.boomCount > 4) {
		this.status = "boomed"
	}
	return this
};
// 怪物左右移动
Enemy.prototype.translate = function(a) {
	if (a === "left") { // 左移
		this.move(-this.speed, 0)
	} else { // 右移
		this.move(this.speed, 0)
	}
	return this
};
// 怪物下移
Enemy.prototype.down = function() {
	this.move(0, this.size);
	return this
};



//飞机 

//子弹

/**
 * 整个游戏对象
 */
var GAME = {
  /**
   * 初始化函数,这个函数只执行一次
   * @param  {object} opts 
   * @return {[type]}      [description]
   */
  init: function(opts) {
    this.status = 'start';
    this.bindEvent(); 
  }, 
  bindEvent: function() {
    var self = this;
    var playBtn = document.querySelector('.js-play');
    // 开始游戏按钮绑定
    playBtn.onclick = function() {
      self.play();
    };
  },
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus: function(status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },
  play: function() {
    this.setStatus('playing');
    console.log("this=",this)

    // 创建怪物
    this.enemies = [];
    var ememiesconfig = {
      x: 28, y: 28, size: 50, speed: 2
    }
    this.enemies.push(new Enemy(ememiesconfig))
    console.log("this=",JSON.stringify(this))
  }
};


// 初始化
GAME.init();
