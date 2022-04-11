var playerList = new Array();
var whiteListName = new Array();
var banList = new Array();

var admin = false;

function newLevel(hasLevel) {
clientMessage(ChatColor.AQUA + "[WhiteList]명령어는 /wl");
}

function entityAddedHook(ent) {
if(Player.isPlayer(ent)) {
if(!admin) {
whiteListName.push(Player.getName(ent).toLowerCase());
playerList.push(ent);
loadData();
admin = true;

return; 
}

joinPlayerCheck(ent);
}
}

function modTick() {
for(var i=0; i<banList.length; i++) {
for(var j=0; j<banList.length; j++) {
if(i == j)
continue;

if(Player.getName(banList[i]) == Player.getName(banList[j])) 
banList.splice(j, 1);
}
}

for(var i=0; i<banList.length; i++) 
playerTeleport(Player.getX(), -10, Player.getZ(), banList[i]);

}

function procCmd(str) {
var command = str.split(" ");

if(command[0] == "wl") {
switch(command[1]) {
case "add":
if(command.length < 3) 
clientMessage(ChatColor.AQUA + "/wl add <이름>");
else 
commandAdd(command[2]);

break;

case "remove":
if(command.length < 3) 
clientMessage(ChatColor.AQUA + "/wl remove <리스트 번호>");
else 
commandRemove(command[2]);

break;

case "reset":
commandReset();
break;

case "list":
commandList();
break;

case "ban":
commandBan();
break;

default:
clientMessage(ChatColor.AQUA + "/wl add <이름> - 리스트에 이름을 추가합니다. (대소문자 구별 X)");
clientMessage(ChatColor.AQUA + "/wl remove <리스트 번호> - 해당 등록된 리스트를 삭제합니다.");
clientMessage(ChatColor.AQUA + "/wl reset - 리스트를 전부 초기화합니다.");
clientMessage(ChatColor.AQUA + "/wl list - 등록된 리스트를 봅니다.");
clientMessage(ChatColor.AQUA + "/wl ban - ban 당한 리스트를 봅니다.");
}
}  
}

function commandBan() {
clientMessage(ChatColor.YELLOW + "BanList 목록");
for(var i=0; i<banList.length; i++)
clientMessage(ChatColor.YELLOW + "- [" + ChatColor.GOLD + (i+1) + ChatColor.YELLOW + "][이름:" + ChatColor.GOLD + Player.getName(banList[i]) + ChatColor.YELLOW + "]");        
}

function commandAdd(playerName) {
whiteListName.push(playerName.toLowerCase());
ModPE.saveData("whiteListIndex", whiteListName.length);
ModPE.saveData(("whiteListName" + (whiteListName.length - 1)), whiteListName[whiteListName.length-1]);
clientMessage(ChatColor.YELLOW + "[이름:" + ChatColor.GOLD + playerName + ChatColor.YELLOW + "] - 리스트 추가완료."); 
}

function commandRemove(index) {
var length = parseInt(index);

if(length <= 0 || length >= whiteListName.length) {
clientMessage(ChatColor.RED + "값의 범위가 초과했습니다.");
return;
}

clientMessage(ChatColor.YELLOW + "[이름:" + ChatColor.GOLD + whiteListName[length] + ChatColor.YELLOW + "] - 리스트 삭제완료");

for(var i=length+1; i<whiteListName.length; i++) 
ModPE.saveData(("whiteListName" + (i-1)), whiteListName[i]);

whiteListName.splice(length, 1);
ModPE.saveData("whiteListIndex", whiteListName.length);
}

function commandReset() {
whiteListName.splice(0, whiteListName.length);

ModPE.saveData("whiteListIndex", whiteListName.length);

clientMessage(ChatColor.AQUA + "등록된 리스트를 전부 초기화 하였습니다.");
}

function commandList() {
clientMessage(ChatColor.YELLOW + "===========[리스트 등록자]===========");
for(var i=1; i<whiteListName.length; i++) 
clientMessage(ChatColor.YELLOW + "- [" + ChatColor.GOLD + i + ChatColor.YELLOW + "번][이름:" + ChatColor.GOLD + whiteListName[i] + ChatColor.YELLOW + "]");
}

function playerTeleport(x, y, z, player) {
var playerTpEntity = Level.spawnMob(x, y, z, 81);
Entity.rideAnimal(player, playerTpEntity);
}
 
function joinPlayerCheck(player) { // 화이트리스트 체크
var joinPlayerName = (Player.getName(player).toLowerCase());

if(whiteListName.indexOf(joinPlayerName) == -1) {
banList.push(player); 
return;
} else {
for(var i=0; i<playerList.length; i++) {
if(Player.getName(playerList[i]).toLowerCase() == joinPlayerName) {
banList.push(player);
return;
}
}

playerList.push(player);
}
}

function loadData() {
var index = ModPE.readData("whiteListIndex");

for(var i=1; i<index; i++) 
whiteListName.push(ModPE.readData("whiteListName" + i));
}

