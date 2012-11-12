/**
 * @author Germanium
 */
var baseurl = app_settings["origin"];
var startinglocations = new Array();
var currentstartinglocation='';
var startpmkid="";
var domain;
var bOverviewReady=false;
var bUseAjax=app_settings["mobile-delayload"]; //true; // use ajax to load "data.json"

//preloaded images
var imgbusy_sm,imghome,imagelogo;
//

//for iPad timer
var hash_last;
var hash_timer;
//

var stack = new Stack();
var urlHash;
var nameGroup = {
					"A to F": [ "a", "f" ],
					"G to L": [ "g", "l" ],
					"M to S": [ "m", "s" ],
					"T to Z": [ "t", "z" ]
				};
ConvenoConst = {
	APP : 
	{ 
		APP_ID          : 0,
		PRI_LANG        : 1,
		NAME            : 2,
		NAME_SID        : 3,
		APP_LOGO_PATH   : 4,
		IS_ORTHOGRAPHIC : 5,
		HFOV            : 6,
		VIEW_ID         : 7,
		VISIBILITY_BITS : 8,
		USE_SKYBOX      : 9,
		BGCOLOR         : 10 
	},
	CAT : 
	{ 
		CAT_ID          : 0,
		PARENT_CAT_ID   : 1,
		NAME            : 2,
		NAME_SID        : 3,
		CONTENT         : 4,
		CONTENT_SID     : 5,
		ICON_PATH       : 6,
		IS_LEGEND       : 7,
		DISPLAY_ORDER   : 8 
	},
	PMK : 
	{ 
		PMK_ID              : 0,
		NAME                : 1,
		NAME_SID            : 2,
		CONTENT             : 3,
		CONTENT_SID         : 4,
		ICON_PATH           : 5,
		ICON_HOTSPOTX       : 6,
		ICON_HOTSPOTY       : 7,
		BLDG_BBL_ID         : 8,
		BLOCK_BBL_ID        : 9,
		LEVEL_BBL_ID        : 10,
		VISIBILITY_BITS     : 11,
		NODE_ID             : 12,
		VIEW_ID             : 13,
		LABEL_COLOR         : 14,
		MAX_LABEL_DIST      : 15,
		CAN_LOOKAROUND      : 16,
		LOOKAROUND_Y_OFFSET : 17,
		IS_DISABLED         : 18,
		IS_START_POINT      : 19 
	},
	MAP_PMK_CAT : 
	{ 
		PMK_ID        : 0,
		CAT_ID        : 1,
		DISPLAY_ORDER : 2 
	},
	BLDG : 
	{
		NAME : 0,
		NAME_SID : 1,
		DISPLAY_ORDER : 2
	},
	BLOCK :
	{
		NAME : 0,
		NAME_SID : 1,
		DISPLAY_ORDER : 2
	},
	LEVEL :
	{
		NAME : 0,
		NAME_SID : 1,
		DISPLAY_ORDER : 2
	},
	VIEW : 
	{ 
		EYE_X       : 0,
		EYE_Y       : 1,
		EYE_Z       : 2,
		ORT_X       : 3,
		ORT_Y       : 4,
		ORT_Z       : 5,
		TARGET_DIST : 6 
	},
	NODE : 
	{
		X            : 0,
		Y            : 1,
		Z            : 2,
		BLDG_BBL_ID  : 3,
		BLOCK_BBL_ID : 4,
		LEVEL_BBL_ID : 5,
		NODE_CLASS   : 6 
	},
	EDGE : 
	{
		START_NODE_ID : 0,
		END_NODE_ID   : 1,
		DIRECTION     : 2,
		TO_WEIGHT     : 3,
		FROM_WEIGHT   : 4,
		EDGE_CLASS    : 5
	},
	SEG : 
	{ 
		SEG_ID          : 0,
		VISIBILITY_BITS : 1,
		START_NODE_ID   : 2,
		END_NODE_ID     : 3,
		DIRECTION       : 4,
		TO_WEIGHT       : 5,
		FROM_WEIGHT     : 6,
		EDGE_CLASS      : 7
	},
	GUIDE : 
	{ 
		SEG_ID      : 0,
		IS_ON_EDGE  : 1,
		CONTENT     : 2,
		CONTENT_SID : 3,
		VIEW_ID     : 4,
		TRANSITION  : 5
	}
//	,TYPE        : { FLOOR : 0, LIFT : 1, ESCALATOR : 2, TRAVELLATOR : 3, STAIR : 4, MOTORSTAIR : 5, HANDICAP_LIFT : 6 }
//	,TRANSITION  : { GLIDE : 0, JUMP : 1 }
	,AVG_WALKING_SPEED : 75.10272 // metres per min. based on 2.8 miles per hour. ref: en.wikipedia.org/wiki/Walking 
	,POLL_INTERVAL : 50
	,EYE_STABLE_PERIOD : 250
};
var UIstrTable = 
{
	"txtcat" : {
			"en" : "Places",
			"zh" : "组别",
			"ms" : "Kumpulan"
		},
		"txtlvl" : {
			"en" : "Levels",
			"zh" : "楼层",
			"ms" : "Peringkat"
		},
		"txtsch" : {
			"en" : "Search",
			"zh" : "搜索",
			"ms" : "sousuo"
		},
		"txtname" : {
			"en" : "Name",
			"zh" : "名称",
			"ms" : "Lokasi"
		},
		"txthere" : {
			"en" : "You are at ",
			"zh" : "所在位置 ",
			"ms" : "Anda berada di "
		},
		"txtgethere" : {
			"en" : "How do I get here from: ",
			"zh" : "从这里开始步行: ",
			"ms" : "Bagaimana aku sampai di sini dari: "
		},
		"txtfrom" : {
			"en" : "Starting From",
			"zh" : "起点",
			"ms" : "Mulai"
		},
		"txtto" : {
			"en" : "To",
			"zh" : "终点",
			"ms" : "Tujuan"
		},
		"txtwalk" : {
			"en" : "Walking distance",
			"zh" : "步行距离",
			"ms" : "Berjalan kaki"
		},
		"txttime" : {
			"en" : "Walking time",
			"zh" : "步行时间",
			"ms" : "Berjalan waktu"
		},
		"txtmetres" : {
			"en" : "m",
			"zh" : "米",
			"ms" : "m"
		},
		"txtmins" : {
			"en" : "mins",
			"zh" : "分钟",
			"ms" : "minit"
		},
		"txtsur" : {
			"en" : "Surrounding Places",
			"zh" : "其他地标",
			"ms" : "Tempat Sekitarnya"
		},
		"txtlvlsel" : {
			"en" : "Please select a level below to visit",
			"zh" : "请选择以下的楼层",
			"ms" : "Silakan pilih tingkat bawah untuk melawat"
		},
		"txtsel1" : {
			"en" : "Please select the starting letter of your location",
			"ms" : "Silakan pilih huruf awal lokasi anda"
		},
		"txtsel2" : {
			"en" : "Please select a location starting from",
			"ms" : "Silakan memilih lokasi bermula daripada"
		},
		"txtpow" : {
			"en" : "powered by",
			"zh" : "采用",
			"ta" : "போவேறேத் பி "
		},
		"txtlgd" : {
			"en" : "Legend",
			"zh" : "图例"
		},
		"txtback" : {
			"en" : "Back",
			"zh" : "后退"
		},
		"txtgo" : {
			"en" : "&nbsp;&nbsp;&nbsp;&nbsp;Go&nbsp;&nbsp;&nbsp;&nbsp;",
			"zh" : "前去"
		},
		"txtwheretogo" : {
			"en" : "Where would you like to visit",
			"zh" : "您要去哪里？"
		},
		"en" : {
			"en" : "English"
		},
		"zh" : {
			"zh" : "中文"
		},
		"ms" : {
			"ms" : "Melayu"
		},
		"ta" : {
			"ta" : "தமிழ்"
		},
 
 
		"_" : null
}
function getUIstr(sid,lang)
{
	if (!lang||lang==-1) lang = app_settings.lang;
	var value;
	if (UIstrTable[sid]) {
		value = UIstrTable[sid]["en"];
		if (UIstrTable[sid][lang]) 
		{
			value = UIstrTable[sid][lang];
		}
	}
	if (!value) value = "(undefined)";
	return value;
};

var DOMLoadTimer;

function OnDOMLoaded(fn) {

	if (DOMLoadTimer) clearInterval(DOMLoadTimer);
	DOMLoadTimer = setInterval(function() {
		if (/loaded|complete/i.test(document.readyState)) {
			document.body.onorientationchange = hideURLbar;
			try {
				if (typeof(fn)=="function") fn();
			} catch (e) {
			}
			clearInterval(DOMLoadTimer);
			DOMLoadTimer=0;
			hideURLbar();
		}
	}, 50);

}

function hideURLbar() 
{
//	setTimeout(function() {
		window.scrollTo(0, 0.9);
//	},10);
}

function loadimg(url,id)
{
	var img = new Image();
	img.src = url;
	img.onload = function()
	{
		var elem = document.getElementById(id);
		if (elem) elem.src = url;
	}
}
function SortByIndex(unsorted_list, indices, subindex_sorted)
{
	indices.sort(function(a,b) 
	{
		var p=unsorted_list[ a ][subindex_sorted];
		var q=unsorted_list[ b ][subindex_sorted];
		if (p<q) return -1;
		else if (q<p) return 1;
		return 0;
	})
}
function GetSubcategories(cat_id) 
{
	var rows = jsobj.cat;
	// get entries with matching parent_cat_id
	var display_order = [];
	var j=0;
	for (var i in rows)
	{
		if (rows[i][ConvenoConst.CAT.PARENT_CAT_ID] == cat_id &&!rows[i][ConvenoConst.CAT.IS_LEGEND])
		{ // omit legend
			display_order[j++] = i;
		}
	}
	// order by display order
	this.SortByIndex(rows, display_order, ConvenoConst.CAT.DISPLAY_ORDER);
	// output
	var sorted_rows = [];
	for (var i in display_order) 
	{
		sorted_rows.push( rows[ display_order[i] ] );
	}
	return sorted_rows;
}
function GetPlacemarks(cat_id)
{
	var rows = jsobj.map_pmk_cat;
	// get entries with matching cat_id
	var display_order = new Array();
	var j=0;
	for (var i in rows)
	{
		if (rows[i][ConvenoConst.MAP_PMK_CAT.CAT_ID] == cat_id)
		{
			display_order[j++] = i;
		}
	}
	// sort by display order
	this.SortByIndex(rows, display_order, ConvenoConst.MAP_PMK_CAT.DISPLAY_ORDER);

	// output
	var sorted_rows = [];
	for (var i in display_order) 
	{
		var mapped_row = rows[ display_order[i] ];
		var pmk_row = jsobj.pmk[ mapped_row[ConvenoConst.MAP_PMK_CAT.PMK_ID ] ];
		if (pmk_row) 
		{
			sorted_rows.push( pmk_row );
		}
	}
	return sorted_rows;
}
function GetBuilding(bldg_bbl_id) 
{
	if (jsobj.bbl2) 
	{
		var bldg = jsobj.bbl2[bldg_bbl_id];
		if (bldg) return bldg["_"];
	}
	return null;
}

function GetBlock(bldg_bbl_id, block_bbl_id) 
{
	if (jsobj.bbl2) 
	{
		var bldg = jsobj.bbl2[bldg_bbl_id];
		if (bldg) 
		{
			var block = jsobj.bbl2[bldg_bbl_id][block_bbl_id];
			if (block) return block["_"];
		}
	}
	return null;
}

function GetLevel(bldg_bbl_id, block_bbl_id, level_bbl_id) 
{
	if (jsobj.bbl2) 
	{
		var bldg = jsobj.bbl2[bldg_bbl_id];
		if (bldg) 
		{
			var block = jsobj.bbl2[bldg_bbl_id][block_bbl_id];
			if (block) 
			{
				var level = jsobj.bbl2[bldg_bbl_id][block_bbl_id][level_bbl_id];
				if (level) return level;
			}
		}
	}
	return null;
}
function GetPlacemarkByNodeId(node_id) 
{
	var arrpmk = jsobj.pmk;
	for (var i in arrpmk) 
	{
		if (arrpmk[i][ConvenoConst.PMK.NODE_ID] == node_id) return arrpmk[i];
	}
	return null;
}
function Path(start,pmk_id)
{
	var path='';
	for(var key in jsobj.path)
	{
		if(jsobj.path[key]["dst_pmk_id"]==pmk_id&&
			GetPlacemarkByNodeId(jsobj.path[key]["segment"][0][ConvenoConst.SEG.START_NODE_ID])[ConvenoConst.PMK.PMK_ID]==start)
		{
			path = jsobj.path[key];
			this.key=key;
			break;
		}
	}
	if(!path)
	{
		this.error = true;
		return;
	}

/*	
	this.segments = path["segment"];
	var node=jsobj.node;
	this.walking_dist = 0;
	this.start_node;
	for (var i in this.segments) 
	{
		var p = this.segments[i][ConvenoConst.SEG.START_NODE_ID];
		var q = this.segments[i][ConvenoConst.SEG.END_NODE_ID];
		if (i==0) this.start_node = p; // record starting node

		if (node[p] && node[q]) 
		{ // && (segments[i][SEG.TYPE] == TYPE.FLOOR)) {

			var x = node[p][ConvenoConst.NODE.X] - node[q][ConvenoConst.NODE.X];
			var y = node[p][ConvenoConst.NODE.Y] - node[q][ConvenoConst.NODE.Y];
			var z = node[p][ConvenoConst.NODE.Z] - node[q][ConvenoConst.NODE.Z];
			
			var dist = Math.sqrt(x*x+y*y+z*z);
			this.walking_dist += dist;
		}
	}

	this.walking_time = this.walking_dist / ConvenoConst.AVG_WALKING_SPEED;
*/
	//TW: 2010-08-09
	this.walking_dist = path["estdist"];
	this.walking_time = path["esttime"];

	this.walking_dist += 0.5;
	this.walking_time += 0.5;
	this.error = false;	
	this.path_id = path["path_id"];
}
function Stack()
{
	this.data = new Array();
	this.num = 0;
	this.push= function(thing)
	{
		this.data[this.num]=thing;
		this.num++;
	}
	this.top = function()
	{
		return this.num==0?null:this.data[this.num-1];
	}
	this.pop = function()
	{
		if(this.num>0)
		{
			this.num--;
			return this.data[this.num];
		}
		else
		{
			return null;
		}
	}
}
function URLHash()
{
	var hashstr = location.hash;
	hashstr = hashstr.substring(1,hashstr.length);
	var hashes_indexed = hashstr.split("&");
	this.type = -1;
	this.param = -1;
	this.lang = -1;
	this.sp = -1;
	this.isValid = false;
	this.home= -1;
	for (var i = 0; i < hashes_indexed.length; i++) 
	{
		var arr = hashes_indexed[i].split("=");
		switch (arr[0]) {
			case "cat":
			case "lvl":
			case "sch":
			case "ovw":
			case "pmk":
			case "gd":
			case "help":
				if (this.type != -1) {
					return null;
				}
				else 
				{
					if (arr[1] == "") 
					{
						return null;
					}
					else
					{
						this.type = arr[0];
						this.param = unescape(arr[1]);
					}
				}
				break;
			case "lang":
				if(this.lang != -1)
				{
					return null;
				}
				else
				{
					var regex = /^(en|zh|ms|tm)$/;
					if(regex.test(arr[1]))
					{
						this.lang = arr[1];
					}
					else
					{
						return null;
					}
				}
				break;
			case "sp":
				if(this.sp != -1)
				{
					return null;
				}
				else
				{
					var regex = /^[0-9]+$/;
					if(regex.test(arr[1]))
					{
						this.sp = arr[1];
					}
					else
					{
						return null;
					}
				}
				break;
			case "home":
			case "index":
				if(this.home != -1)
				{
					return null;
				}
				else
				{
					this.home = arr[0];
				}
				break;
			default:
				return null;	
		}
	}
	this.isValid = true;
}
function Page(page,arg)
{
	this.page = page;
	this.arg = arg;
}
function header_cat()
{
	var str =  '<div id="topbar" class="black">';
	str+='<div id="title"><img style="vertical-align:middle" src="theme/black/pics/conveno_logo.png" /></div>';
	if(stack.num>1)
	{
		str += '<div id="leftnav" class="black"><a href="'+constructHashmainPage()+'"><img src="theme/black/images/home.png" /></a><a href="javascript:void(0);" onclick="history.go(-1)">'+getUIstr("txtback",urlHash.lang)+'</a></div>';
	}
	
	if (!window.navigator.standalone) {
		str += '<div id="rightbutton" class="black"><a href="'+constructHash("help",0)+'" style="font-size:medium;">&nbsp;&nbsp;+&nbsp;&nbsp;</a></div>';
	}
	str+="</div>";
	return str;
}
function tribar()
{
	var str='<div id="tributton">';
	str+='<div class="links">';
	str+='<a href="'+constructHashmainPage()+'" ';
	if(stack.top().page=="cat")
	{
		str+= 'id="pressed"';
	}
	str+= '>'+getUIstr("txtcat",urlHash.lang)+'</a>';
	str+='<a href="'+ constructHash("lvl",0)+'" ';
	if(stack.top().page=="lvl")
	{
		str+= 'id="pressed"';
	}
	str+= '>'+getUIstr("txtlvl",urlHash.lang)+'</a>';
	str+='<a href="'+ constructHash("sch",0)+'" ';
	if(stack.top().page=="sch")
	{
		str+= 'id="pressed"';
	}
	str+= '>'+getUIstr("txtsch",urlHash.lang)+'</a>';
	str+='</div>';
	str+='</div>';
	return str;
}
function callback(obj)
{
	turns = obj;
	//alert("called back");
	if(stack.top().page=="ovw")
	{
		if (document.getElementById("bluerightbutton")) 
		{
			document.getElementById("bluerightbutton").style.display = "block";
		}

		bOverviewReady = true;
		hideURLbar();
	}
}
function getpath(path,app)
{
	var fileref=document.createElement('script')
	fileref.setAttribute("type","text/javascript");
//  	fileref.setAttribute("src", "../../php/get_path.php?app_id="+app+"&path_id="+path+"&jsonp=callback");
 	fileref.setAttribute("src", "view/"+app+"/path/"+path+"/path.js");
	document.getElementsByTagName("head")[0].appendChild(fileref);
}
function GetGuideStrBySegment(pathkey,segid)
{
	var P = jsobj.path[pathkey];
	for (var key in P.guide)
	{
		if(P.guide[key][ConvenoConst.GUIDE.SEG_ID]==segid)
		{
			return P.guide[key][ConvenoConst.GUIDE.CONTENT];
		}
	}
	return "";
}
function compareCat(a,b)
{
	return a[ConvenoConst.CAT.NAME]<b[ConvenoConst.CAT.NAME]?-1:1;
}
function comparePmk(a,b)
{
	return a[ConvenoConst.PMK.NAME]<b[ConvenoConst.PMK.NAME]?-1:1;
}
function comparelevels(a,b)
{
	return levels[a][0]<levels[b][0]?-1:1;
}
function comparepmkindexd(a,b)
{
	return jsobj.pmk[a][ConvenoConst.PMK.NAME]<jsobj.pmk[b][ConvenoConst.PMK.NAME]?-1:1;
}
function handleKeyPress(e,value)  
{
    var key;  
    if(window.event)  
      key = window.event.keyCode;  
    else  
      key = e.which;  
  	
    if (key == 13 || key == 10) {
		document.getElementById('testlink').focus();
		return false;
	}
	else 
	{
		setTimeout(function() {
			var srcvalue = document.getElementById("search").value
			var elpmklist = document.getElementById("pmklist");
			var elsrcmesg = document.getElementById("srcmesg");

			if (!srcvalue) {
				elpmklist.style.display = "block";
				elsrcmesg.style.display = "none";
				elpmklist.innerHTML = GetDefaultNameGroupList();
			} else {
				var pmklist = suggestbox(srcvalue);
				if (pmklist) {
					elpmklist.innerHTML = pmklist;
					elpmklist.style.display = "block";
					elsrcmesg.style.display = "none";
				} else {
					elpmklist.style.display = "none";
					elsrcmesg.style.display = "block";
					elsrcmesg.innerHTML = "No results with \""+srcvalue+"\"";
				}
			}
		},100);
		return true;
	}  
}

function GetDefaultNameGroupList()
{
			var defstr='';
			for(var key in nameGroup)
			{
				defstr+='<li class="menu"><a href="'+constructHash("sch",key)+'"><span class="name">'+key+'</span><span class="arrow"></span></a></li>';
			}
			defstr+= '<li class="menu"><a href="'+constructHash("sch","Others")+'"><span class="name">Others</span></a></li>';

	return defstr;
}


function sayA()
{
	alert("a");
}
function sayB()
{
	alert("b");
}
function suggestbox(regstr)
{
	var pmklist = "";
	if (regstr != "") 
	{
		var reg = new RegExp(regstr,"i");
		var i = 0;
		for (var key in jsobj.pmk) 
		{
			if(!Islegend(key))
			{
				var pmkstr = jsobj.pmk[key][ConvenoConst.PMK.NAME];
				var pos = pmkstr.search(reg)
				if (pos != -1) 
				{
					pmkstr = pmkstr.substring(0, pos) + '<span style="background-color:yellow">' + pmkstr.substring(pos, pos + regstr.length) + '</span>' + pmkstr.substring(pos + regstr.length, pmkstr.length);
					i++;
					pmklist += '<li class="menu"><a href="'+constructHash("pmk",jsobj.pmk[key][ConvenoConst.PMK.PMK_ID])+'"><span class="name">' + pmkstr + '</span></a></li>';
				}
				if (i >= 20) break;
			}
		}
	}
	if(pmklist==""||regstr=="")
	{
//		pmklist="<li class='menu'><a><span class='name'>Not Found</span></a></li>";
	}
	return pmklist;
}
function searchblur(value)
{
	if(value=="")document.getElementById("pmklist").innerHTML = defstr;
}
function PMKmatchGROUP(pmkid,groupname)
{
	var pmkname = jsobj.pmk[pmkid][ConvenoConst.PMK.NAME];
	var initial = pmkname.charAt(0).toLowerCase();
	//console.log(nameGroup[groupname][0]);
	if(groupname=="Others")
	{
		return (initial<'a'||initial>'z');
	}
	else
	{
		return (initial>=nameGroup[groupname][0]&&initial<=nameGroup[groupname][1])
	}
}
function display(){
	var app_id = jsobj.app[ConvenoConst.APP.APP_ID];
	var str="";
	switch (stack.top().page) {
		case "cat":
			var list = GetSubcategories(stack.top().arg);
			list.sort(compareCat);
			str+= header_cat();
			str+= tribar();
			str+='<div id="content">';
			if (stack.num == 1) 
			{
				str += '<ul class="pageitem" style="text-align:center;padding-top:7px"><li><img id="logo" alt="logo" src="'+jsobj.app[ConvenoConst.APP.APP_LOGO_PATH]+'" /></li></ul>';
				str += '<span class="graytitle">'+getUIstr("txtwheretogo",urlHash.lang)+'</span>';
			}
			else 
			{
				str += '<span class="graytitle">' + jsobj.cat[stack.top().arg][ConvenoConst.CAT.NAME] + '</span>';
			}
			str += '<ul class="pageitem">';
			
			for (var i = 0; i < list.length; i++) 
			{
				str += '<li class="menu"><a href="'+constructHash("cat",list[i][ConvenoConst.CAT.CAT_ID])+'"  ><span class="name">' + list[i][ConvenoConst.CAT.NAME] + '</span><span class="arrow"></span></a></li>';
			}

			list = GetPlacemarks(stack.top().arg);
			list.sort(comparePmk);
			for (var i = 0; i < list.length; i++) 
			{
				str += '<li class="menu"><a href="'+constructHash("pmk",list[i][ConvenoConst.PMK.PMK_ID])+'" ><span class="name">' + list[i][ConvenoConst.PMK.NAME] + '</span></a></li>';
			}
			str += '</ul>';
			str+="</div>";
			document.body.innerHTML = str;
			OnDOMLoaded();
			break;
		case "lvl":
			str+=header_cat();
			str+=tribar();
			str+='<div id="content">';
			
			if(stack.top().arg==0)
			{
				str += '<ul class="pageitem" style="text-align:center;padding-top:7px"><li><img id="logo" alt="logo" src="'+jsobj.app[ConvenoConst.APP.APP_LOGO_PATH]+'" /></li></ul>';
				str+='<ul class="pageitem">';
				for(key in levelsindexed)
				{
					str+='<li class="menu"><a href="'+constructHash("lvl",levelsindexed[key])+'"><span class="name">'+levels[levelsindexed[key]][1]+'</span><span class="arrow"></span></a></li>';
				}
			}
			else
			{
				str+="<span class='graytitle'>"+levels[stack.top().arg][1]+"</span>";
				str+='<ul class="pageitem">';
				var pmks = new Array();
				var i=0;
				for(key in jsobj.pmk)
				{
					var placemark = jsobj.pmk[key];
					if(placemark[ConvenoConst.PMK.LEVEL_BBL_ID]==stack.top().arg&&!Islegend(key))
					{
						pmks[i++] = key;
					}
				}
				//alert(stack.top().arg);
				pmks.sort(comparepmkindexd);
				for (key in pmks) 
				{
					str += '<li class="menu"><a href="'+constructHash("pmk",pmks[key])+'"><span class="name">' + jsobj.pmk[pmks[key]][ConvenoConst.PMK.NAME] + '</span></a></li>';
				}
			}
			str+='</ul>';
			str+='</div>';
			document.body.innerHTML = str;
			OnDOMLoaded();
			break;
		case "sch":
			str+=header_cat();
			str+=tribar();
			//str+='<div id="content">';
			defstr = GetDefaultNameGroupList();
			if(stack.top().arg==0)
			{
				str+='<div class="searchbox">';
				str+='<div id="form">';
				str+='<fieldset>';
				str+='<input id="search" onblur="searchblur(this.value)" autocorrect="off" autocomplete="off"  onkeydown="return handleKeyPress(event,this.value)"  style="-webkit-user-select: text" placeholder="Search your destination" type="text" />';
				str+='<a href="javascript:void(0);" id="testlink"></a>';
				str+='</fieldset>';
				str+='</div>';
				str+='</div>';
				str+='<div id="content">';
str+= '<span id="srcmesg" class="graytitle" style="display:none">Not found</span>';
				str+='<ul class="pageitem" id="pmklist">';
				str+=defstr;
				str+='</ul>';
				str+='</div>';
			}
			else
			{
				var pmks = new Array();
				for(var key in jsobj.pmk)
				{
					if(PMKmatchGROUP(key,stack.top().arg)&&!Islegend(key))
					{
						pmks.push(key);
					}
				}
				pmks.sort(comparepmkindexd);
				str+='<div id="content">';
				str+='<span class="graytitle">'+stack.top().arg+'</span>';
				str+='<ul class="pageitem" id="pmklist">';
				if (pmks.length>0) {
					for(var key in pmks)
					{
						str += '<li class="menu"><a href="'+constructHash("pmk",pmks[key])+'"><span class="name">' + jsobj.pmk[pmks[key]][ConvenoConst.PMK.NAME] + '</span></a></li>';
					}
				} else {
					str += '<li class="menu"><span class="name" style="text-shadow: #FFF 0 1px 0; color: #4C4C4C;">-</span></li>';
				}
				str+='</ul>';
				str+='</div>';
			}
			document.body.innerHTML = str;
			OnDOMLoaded();
			break;
		case "pmk":
			var content = jsobj.pmk[stack.top().arg][ConvenoConst.PMK.CONTENT];
			var building = GetBuilding(jsobj.pmk[stack.top().arg][ConvenoConst.PMK.BLDG_BBL_ID]);
			var block = GetBlock(jsobj.pmk[stack.top().arg][ConvenoConst.PMK.BLDG_BBL_ID],jsobj.pmk[stack.top().arg][ConvenoConst.PMK.BLOCK_BBL_ID]);
			var level = GetLevel(jsobj.pmk[stack.top().arg][ConvenoConst.PMK.BLDG_BBL_ID],jsobj.pmk[stack.top().arg][ConvenoConst.PMK.BLOCK_BBL_ID],jsobj.pmk[stack.top().arg][ConvenoConst.PMK.LEVEL_BBL_ID]);
			str =  '<div id="topbar" class="black">';
			str+='<div id="title"><img style="vertical-align:middle" src="theme/black/pics/conveno_logo.png" /></div>';
			str += '<div id="leftnav" class="black"><a href="'+ constructHashmainPage()+'"><img src="theme/black/images/home.png" /></a><a href="javascript:void(0);" onclick="history.go(-1);">'+getUIstr("txtback",urlHash.lang)+'</a></div>';
			str += '<div id="bluerightbutton">    ';
			str += '<a href="'+constructHash("ovw",stack.top().arg)+'">'+getUIstr("txtgo",urlHash.lang)+'</a></div>';
			str+="</div>";
			str+='<div id="content">';
			if (level) {
				str+='<span class="graytitle" style="font-size:smaller"><u>'+building[ConvenoConst.BLDG.NAME]+'</u>  <u>'+level[ConvenoConst.LEVEL.NAME]+'</u></span>';
			}
			str+='<ul class="pageitem">\
			<li class="textbox"><span class="header"><p><b>'+jsobj.pmk[stack.top().arg][ConvenoConst.PMK.NAME]+"</b>";
			if (content != "") 
			{
				str += "<a href='javascript:document.getElementById(\"more\").scrollIntoView(true);'><img style='width:21px;height:21px;float:right' src='theme/black/images/info_icon.gif'></a>";
			}
			str+="</p></span></li>";
			if(!hasCss3d())
			{
				var vrwidth = "90%";
				var vrheight = vrwidth;
				var style = 'width:'+vrwidth+';height:'+vrheight+";max-width:400px;max-height:400px";
				str+='<div style="text-align: center;"><img style="'+style+'" src="'+baseurl+'/view/'+app_id+'/pmk/'+stack.top().arg+'/default.jpg" /></div>';
			} else {
				var vrsize = GetVRSize();
				var vrwidth = vrsize.width, 
						vrheight = vrsize.height;

				str+='<div id="cvn_vr" style="height:'+ vrheight +';width:'+vrwidth+';margin:0 auto 5px auto">';
				str+='</div>';
			}
			if (hasCss3d()) 
			{
				str += "<span class='graytitle' style='font-size:small;color:gray;text-align:center'><img  src='theme/black/images/hand.png' /> Drag around to explore view</span>";
			}
			str+='</ul>';
			if (content != "") 
			{
				str += '<ul class="pageitem" id="more">\
			<li class="textbox">\
			<div style="float: right"><a href="javascript:void(0);" onclick="hideURLbar();"><img src="theme/black/images/arrow_top.png" border=0></a></div>\
			<span class="header">More information</span>\
			' + content + '</li>\
			</ul>';
			}
			
			str+='</div>';
			document.body.innerHTML = str;
			OnDOMLoaded(function() {
				document.body.onorientationchange =  overviewOrientationChange;
				if (hasCss3d()) 
				{
					cubemap.Load(jsobj.app[ConvenoConst.APP.APP_ID], stack.top().arg, document.getElementById("cvn_vr"), document.getElementById("cvn_vr").clientWidth, document.getElementById("cvn_vr").clientHeight, 1.25);
				}
			});
			break;
		case "ovw":
			var path = new Path(currentstartinglocation,stack.top().arg);
			str =  '<div id="topbar" class="black">';
			str+='<div id="title"><img style="vertical-align:middle" src="theme/black/pics/conveno_logo.png" /></div>';
			str += '<div id="leftnav" class="black"><a href="'+constructHashmainPage()+'"><img src="theme/black/images/home.png" /></a><a href="javascript:void(0);" onclick="bOverviewReady=false;history.go(-1);">'+getUIstr("txtback",urlHash.lang)+'</a></div>';
			
			str += '<div id="bluerightbutton" style="display:'+(bOverviewReady==true?"block":"none")+'">';
			str += '<a href="'+ constructHash("gd",path.key)+'" onclick="bOverviewReady=false;">Guide Me</a></div>';
			getpath(path.path_id,jsobj.app[ConvenoConst.APP.APP_ID]);			
			
			str+="</div>";
			str+='<div id=content>';
			str+='<span class="graytitle">'+getUIstr("txtfrom",urlHash.lang)+'</span>';
			str+='<ul class="pageitem">';
			str+='<li class="select"><select  name="start" onchange="bOverviewReady=false;currentstartinglocation = this.options[this.selectedIndex].value;display()">'
			for(var key in startinglocations)
			{
			      str+='<option value="'+key+'"'
				  if(key==currentstartinglocation)
				  {
				  		str+="selected='selected'";
				  }
				  str+='>'+startinglocations[key]+'</option>'
			}
		  	str+='</select><span class="arrow" /></li></ul>\
			<span class="graytitle">'+getUIstr("txtto",urlHash.lang)+'</span>\
			<ul class="pageitem">\
			<li class="textbox"><strong style="padding: 0.5em 0; display: block;">'+jsobj.pmk[stack.top().arg][ConvenoConst.PMK.NAME]+'</strong><\li>\
	     	 <li class="textbox">';
			if (!path.error) 
			{
				str += '<table style="width:100%;"><tr><td style="width:60%;text-align:left;"><strong class="gray">Estimated distance:</strong></td><td style="width:40%;text-align:right;"><strong>' + path.walking_dist.toFixed(0) + ' meters</strong></td></tr>\
				        <tr><td style="width:60%;text-align:left;"><strong class="gray">Estimated time:</strong></td><td style="width:40%;text-align:right;"><strong>' + path.walking_time.toFixed(0)  + ' minutes</strong></td></tr></table>\
						<div style="width: 100%; text-align: center;"><img style="max-width:320px; width:100%; margin-top: 0.5em;" src="'+domain+ path.path_id +'/overview.jpg" /></div>';
				
			}
			else
			{
				str+='The path for this destination is not available yet';
			}
			str+='</li></ul>';
			str+='</div>';
			document.body.innerHTML = str;
			OnDOMLoaded(function() {
				if(bOverviewReady==true)
				{
					document.getElementById("bluerightbutton").style.display = "block";
				}
			});
			break;
		case "gd":
			reset(turns);
			var img_x = 320;
			var v= new viewport();
			str='<div id="topbar" class="black" style="margin-bottom:0px">\
			<div id="title"><img style="vertical-align:middle" src="theme/black/pics/conveno_logo.png" />\
			</div>\
			<div id="leftnav" class="black"><a href="'+ constructHashmainPage() +'"><img src="theme/black/images/home.png" /></a><a href="javascript:void(0);" onclick="history.go(-1)">'+getUIstr("txtback",urlHash.lang)+'</a></div>\
			</div>\
			<div id="label" ontouchstart="touchStart(event);" ontouchmove="touchMove(event);" ontouchend="touchEnd(event);"  ontouchcancel="touchCancel(event);" >' + '<p>'+((turns[0]["content"])?(turns[0]["content"]):"") + '</p></div>\
			<div id="instruction" ontouchstart="touchStart(event);" ontouchmove="touchMove(event);" ontouchend="touchEnd(event);"  ontouchcancel="touchCancel(event);" >Swipe left for the next step</div>';
str+='<div id="wrapext"><div id="wrap"';			
			str+='ontouchstart="touchStart(event);" ontouchmove="touchMove(event);" ontouchend="touchEnd(event);"  ontouchcancel="touchCancel(event);" >';
			str+='<div id="map-frame" style="width:'+turns.length*(img_x)+'px;">';
			for(var i=0;i<turns.length;i++)
			{
				//str+='<img id="map'+(i+1)+'" src="'+domain+jsobj.path[stack.top().arg]["path_id"]+'/' + turns[i]["filename"] +'">';
				str+='<img id="map'+(i+1)+'" src="theme/black/pics/busy.gif" />';
				// labelsText[i]=GetGuideStrBySegment(stack.top().arg,turns[i]["seg_id"]);
                // raymond change this to use "content" in json file
                labelsText[i]=(turns[i]["content"])?turns[i]["content"]:"";
			}
			if(turns.length>0)
			{
				labelsText[turns.length-1] = "You have reached "+ jsobj.pmk[jsobj.path[stack.top().arg]["dst_pmk_id"]][ConvenoConst.PMK.NAME];
				//alert(labelsText[turns.length-1]);
			}
			str+='</div></div>';
str+='</div>';
			str += '<div id="controller" ontouchstart="touchStart(event)">\
				<div id="div_begin" style="left:29px;top:3px;padding:10px 5px;opacity:0.2;-webkit-transition: opacity 0.2s ease-out"><img id="begin" src="theme/black/images/begin.png" onclick="handlecontrol(\'div_begin\')"></div>\
				<div id="div_previous" style="left:76px;top:3px;padding:10px 5px;opacity:0.2;-webkit-transition: opacity 0.2s ease-out"><img id="previous" src="theme/black/images/previous.png" onclick="handlecontrol(\'div_previous\')"></div>\
				<div id="div_play" style="left:128px;top:-1px;padding:10px 5px;-webkit-transition: opacity 0.2s ease-out"><img id="play" src="theme/black/images/play.png" onclick="handlecontrol(\'div_play\')"></div>\
				<div id="div_next" style="left:173px;top:3px;padding:10px 5px;-webkit-transition: opacity 0.2s ease-out"><img id="next" src="theme/black/images/next.png" onclick="handlecontrol(\'div_next\')"></div>\
				<div id="div_end" style="left:218px;top:3px;padding:10px 5px;-webkit-transition: opacity 0.2s ease-out"><img id="end" src="theme/black/images/end.png" onclick="handlecontrol(\'div_end\')"></div>\
				<div id="slider" style="left:5px;top:33px;"><img src="theme/black/images/slider.png" /></div>\
				</div>';
			document.body.innerHTML = str;


			OnDOMLoaded(function() {
				document.body.onorientationchange = orientChangeHandler;
				for(var i=0;i<turns.length;i++)
				{
					//str+='<img id="map'+(i+1)+'" src="'+domain+jsobj.path[stack.top().arg]["path_id"]+'/' + turns[i]["filename"] +'">';
					loadimg(domain+jsobj.path[stack.top().arg]["path_id"]+'/' + turns[i]["filename"],"map"+(i+1));
				}
				if (hasTouch()) showinstruction();
			});
			break;
		case "sp":
			var building = GetBuilding(jsobj.pmk[stack.top().arg][ConvenoConst.PMK.BLDG_BBL_ID]);
			var block = GetBlock(jsobj.pmk[stack.top().arg][ConvenoConst.PMK.BLDG_BBL_ID],jsobj.pmk[stack.top().arg][ConvenoConst.PMK.BLOCK_BBL_ID]);
			var level = GetLevel(jsobj.pmk[stack.top().arg][ConvenoConst.PMK.BLDG_BBL_ID],jsobj.pmk[stack.top().arg][ConvenoConst.PMK.BLOCK_BBL_ID],jsobj.pmk[stack.top().arg][ConvenoConst.PMK.LEVEL_BBL_ID]);
			str ='<div id="topbar" class="black">';
			str+='<div id="title"><img style="vertical-align:middle" src="theme/black/pics/conveno_logo.png" /></div>';
			str+="</div>";
			//str += '<span class="graytitle">Welcome</span>';
			str+='<div id="content">\
			<ul class="pageitem" style="text-align:center;padding-top:7px">\
			<li><img style="padding:10px" id="logo" alt="logo" src="'+jsobj.app[ConvenoConst.APP.APP_LOGO_PATH]+'" /></li>\
			<li class="textbox" style="padding-bottom:15px;">\
			<h4>You are now at</h4>\
			<h2>'+jsobj.pmk[stack.top().arg][ConvenoConst.PMK.NAME]+'</h2>\
			<span class="graytitle" style="left:0;right:0;font-size:small">'+building[ConvenoConst.BLDG.NAME]+'&nbsp;&nbsp;'+level[ConvenoConst.LEVEL.NAME]+'</span>\
			</li>\
			<li class="textbox"><div id="enterbutton"><a href="'+constructHashmainPage()+'">Start</a></div></li>\
			</ul></div>';
			document.body.innerHTML = str;
			OnDOMLoaded();
			break;
		case "help":
			str=helpdiv();
			document.body.innerHTML = str;
			OnDOMLoaded();
			break;
	}
}
function helpdiv()
{
	str='<div id="topbar" class="black" style="margin-bottom:0px">\
			<div id="title"><img style="vertical-align:middle" src="theme/black/pics/conveno_logo.png" />\
			</div>\
			<div id="leftnav" class="black"><a href="javascript:history.go(-1)" >'+getUIstr("txtback",urlHash.lang)+'</a></div>\
			</div>';
			str+='<div id="content">\
			<ul class="pageitem">\
			<li class="textbox">\
			For optimal viewing experience, add this <i>web app</i> to your Home Screen<br><br>\
				<ol class="help">\
					<li>Click the <b>+</b> button on your button bar</li>\
					<img src="theme/black/pics/navbar.jpg" />\
					<li>Select <b>Add to Home Screen</b></li>\
					<img src="theme/black/pics/add-homescrn.jpg" />\
					<li>Run this web app from your Home Screen</li>\
				</ol>\
			</li>\
			</ul>\
			</div>';
			return str;
}
var main;
var levels = new Array();
var levelsindexed = new Array();
function Islegend(pmkid)
{
	for(var key in jsobj.map_pmk_cat)
	{
		if(jsobj.map_pmk_cat[key][ConvenoConst.MAP_PMK_CAT.PMK_ID]==pmkid)
		{
			var catid = jsobj.map_pmk_cat[key][ConvenoConst.MAP_PMK_CAT.CAT_ID];
			var cat = jsobj.cat[catid];
			if(cat && cat[ConvenoConst.CAT.IS_LEGEND]==false)
			{
				return false;
			}
		}
	}
	return true;
}

function GetVRSize()
{
	var vrwidth, vrheight;
	if (window.navigator.userAgent.indexOf("iPhone")!=-1) {
		vrwidth = "95%";
		vrheight = (window.orientation==0?'270':"220") + "px";
	} else {
		var side = (window.innerWidth - 80);
		if (side>512) side = 512;
		vrwidth = side + "px";
		vrheight =vrwidth;
	}
	return { width:vrwidth, height:vrheight };
}

function overviewOrientationChange()
{
	var cvn_vr = document.getElementById("cvn_vr");
	if (cvn_vr) 
	{
		var vrsize = GetVRSize();

		cvn_vr.style.width = vrsize.width;
		cvn_vr.style.height = vrsize.height;
		cubemap.Resize(cvn_vr.clientWidth, cvn_vr.clientHeight, 1.25);
		hideURLbar();
	}
}
window.onload=function()
{
//	var minheight = parseInt(window.innerHeight);
//	if (minheight > (404+59)) minheight = 404+59;
//	minheight += "px";
	if (window.navigator.standalone) {
		minheight = "460px";
		try { document.body.style.minHeight=minheight; } catch (e) {} // for IE
	}
	
	if(app_settings.namegroup)
	{
		nameGroup = app_settings.namegroup;
	}
	preloadImage();

	if (bUseAjax && app_settings.jsobjsrc) {

		var str = "";

		str += '<div style="height:360px;line-height:360px;text-align:center;"><img src="theme/black/pics/busy-sm.gif" alt="loading"></div>';
		document.body.innerHTML = str;

//		OnDOMLoaded(
//			function() {

				document.title = "Loading";
				var aj = new Ajax();
				aj.Get(app_settings.jsobjsrc,
				function(resp) {
					//alert("success");
					document.body.innerHTML = "";
					eval(resp);
					try {
						document.title = jsobj.app[ConvenoConst.APP.NAME];
						OnJsonReady();
					} catch (e) {
					}
				}, function(err) {
					//alert("failed");
					body = document.getElementsByTagName("body")[0];
					body.innerHTML = "<tt>"+err+"</tt>";
				});

//			});

	} else {
		OnJsonReady();
	}
}

function OnJsonReady()
{
	domain = baseurl + "/view/"+jsobj.app[ConvenoConst.APP.APP_ID]+"/path/";

	urlHash = new URLHash();
//setTimeout(function() {

	// precompute list of starting nodes
	var startingnode = {};
	for (var i in jsobj.path) {
		var seg = jsobj.path[i].segment;
		if (seg) {
			var sn = seg[0][ConvenoConst.SEG.START_NODE_ID];
			startingnode[sn] = true;

		}
	}
	
	for(var key in jsobj.pmk)
	{
		if(jsobj.pmk[key][ConvenoConst.PMK.IS_START_POINT]==true)
		{
			var pmk_nodeid = jsobj.pmk[key][ConvenoConst.PMK.NODE_ID];
			if (startingnode[ pmk_nodeid ]) {
				startinglocations[key] = jsobj.pmk[key][ConvenoConst.PMK.NAME];
				if(currentstartinglocation==''|| app_settings["sp"] ==key)
				{
					currentstartinglocation = key;
				}
			}
		}
		if((!(jsobj.pmk[key][ConvenoConst.PMK.LEVEL_BBL_ID] in levels))&&!Islegend(key))
		{
			var lvl = GetLevel(jsobj.pmk[key][ConvenoConst.PMK.BLDG_BBL_ID],
			jsobj.pmk[key][ConvenoConst.PMK.BLOCK_BBL_ID],
			jsobj.pmk[key][ConvenoConst.PMK.LEVEL_BBL_ID]);
			if (lvl) {
				levels[jsobj.pmk[key][ConvenoConst.PMK.LEVEL_BBL_ID]] = new Array();
				levels[jsobj.pmk[key][ConvenoConst.PMK.LEVEL_BBL_ID]][0] = parseInt( lvl[ConvenoConst.LEVEL.DISPLAY_ORDER]);
				levels[jsobj.pmk[key][ConvenoConst.PMK.LEVEL_BBL_ID]][1] = lvl[ConvenoConst.LEVEL.NAME];
				}
		}			
	}
	
	var i=0;
	for(var key in levels)
	{
		levelsindexed[i++] = key;
	}
	levelsindexed.sort(comparelevels);
	for(var key in jsobj.cat)
	{
		if(jsobj.cat[key][ConvenoConst.CAT.PARENT_CAT_ID]==null)
		{
			main = new Page("cat",jsobj.cat[key][ConvenoConst.CAT.CAT_ID]);
			stack.push(main);
			//stack.push(new Page("guide",0));
			break;
		}
	}

	if("sp" in app_settings && window.navigator.standalone == false)
	{
		var page = new Page("sp",app_settings["sp"]);
		stack.push(page);
	}
	//if(isValidHash())
	//{
		//var page = new Page(getType(),getParam());
		//stack.push(page);
	//}
//},1);


	window.onhashchange = hashchanged;
	
	if (isiPad()) 
	{
		hash_last = window.location.hash;
		hash_timer = setInterval(function()
		{
			if(window.location.hash!=hash_last)
			{
				hash_last = window.location.hash;
				hashchanged();
			}	
		}
		,200)
	}
	setTimeout( display, 10 );
}

function isiPad()
{
	var agent = window.navigator.userAgent;
	return (agent.indexOf("iPad")!=-1);
}

function isWebKit()
{
	var agent = window.navigator.userAgent;
	return (agent.indexOf("AppleWebKit/")!=-1);
//	&& (agent.indexOf(" Mobile/")!=-1);
}

function hasCss3d()
{
	//todo: actual css 3d detection
	var agent = window.navigator.userAgent;
	return (agent.indexOf("AppleWebKit/")!=-1) && (agent.indexOf(" Mobile/")!=-1);
}

function hasTouch()
{
//	var agent = window.navigator.userAgent;
//	return (agent.indexOf("AppleWebKit/")!=-1) && (agent.indexOf(" Mobile/")!=-1);
	return ("createTouch" in document);
}

Ajax = (function() {
	var req;
	var fnSuccess;
	var fnFailure;

	function Ajax() {
		req = null;
	}

	Ajax.prototype.Get = function(url, _fnSuccess, _fnFailure) {
		fnSuccess = _fnSuccess;
		fnFailure = _fnFailure;
		$loadXMLDoc(url);
	}

	function $loadXMLDoc(url) {
		req = false;
		// branch for native XMLHttpRequest object
		if(window.XMLHttpRequest && !(window.ActiveXObject)) {
			try {
				req = new XMLHttpRequest();
			} catch(e) {
				req = false;
			}
		// branch for IE/Windows ActiveX version
		} else if(window.ActiveXObject) {
				try {
				req = new ActiveXObject("Msxml2.XMLHTTP");
				} catch(e) {
				try {
						req = new ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {
						req = false;
				}
			}
		}
		if(req) {
			req.onreadystatechange = $processReqChange;
			try {
				req.open("GET", url, true);
				req.send("");
			} catch (e) {
				if (typeof fnFailure=="function") fnFailure(e.toString());
			}
		} else {
			if (typeof fnFailure=="function") fnFailure("No XMLHttpRequest");
		}
	}

	function $processReqChange() {
		// only if req shows "loaded"
		if (req.readyState == 4) {
			// only if "OK"
			if (req.status == 200) {
				// ...processing statements go here...
				var resp = req.responseText;
				if (typeof fnSuccess=="function") fnSuccess(resp);
			} else {
				if (typeof fnFailure=="function") fnFailure(req.statusText);
			}
		}
	}

	return Ajax;
})();

function preloadImage()
{	
	imgbusy_sm = new Image();
	imghome = new Image();
	imagelogo = new Image();
	imgbusy_sm.src = "theme/black/pics/busy-sm.gif";
	imghome.src="theme/black/images/home.png";
	imagelogo.src="theme/black/pics/conveno_logo.png";
}

function getLocationBeforeHash()
{
	var ret = window.location.href.substring(0,window.location.href.indexOf("#"));
	return ret;
}

function constructHash(page,arg)
{
//	var ret = "http://"+location.host+location.search+"#"+page+"="+arg;
	var ret = getLocationBeforeHash() + "#" + page + "=" + arg;
	if(urlHash.lang!=-1)
	{
		ret+="&lang="+urlHash.lang;
	}
	return ret;
}
function constructHashmainPage()
{
//	var ret = "http://"+location.host+location.search;
	var ret = getLocationBeforeHash();
	if(urlHash.lang!=-1)
	{
		ret+="#lang="+urlHash.lang;
	}
	else
	{
		if (urlHash.home == "home") 
		{
			ret += "#index";
		}
		else
		{
			ret += "#home";
		}
	}
	return ret;
}

function hashchanged()
{
	urlHash = new URLHash();
	if (urlHash.type!=-1) 
	{
		var page = new Page(urlHash.type, urlHash.param);
		stack.push(page);
	}
	else
	{
		stack.num=1;
	}
	display();
}

function unload()
{
	window.onhashchange = null;
	if(isiPad())
	{
		clearInterval(hash_timer);
	}
}
