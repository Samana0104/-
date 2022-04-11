var warp = {
warpX : new Array(),
warpY : new Array(),
warpZ : new Array(),
name : new Array()
};

function newLevel(hasLevel) {
dataLoad();
clientMessage(ChatColor.AQUA + "[표지판티피]명령어는 /sg");
}

function useItem(x, y, z, itemid, blockid, side, itemDamage, blockDamage) {
if(blockid == 63 || blockid == 68) 
signCommand(x, y, z, getPlayerEnt());


}

function procCmd(str) {
var command = str.split(" ");

if(command[0] == "sg") {
switch(command[1]) {
case "add":
if(command.length < 3) 
clientMessage(ChatColor.AQUA + "/sg add <이름>");
else
commandSignAddList(Player.getX(), Player.getY()-1.3, Player.getZ(), command[2]);
break;

case "remove":
if(command.length < 3)
clientMessage(ChatColor.AQUA + "/sg remove <리스트 번호>");
else
commandSignRemoveList(parseInt(command[2]));
break;

case "list":
commandSignList();
break;

default:
clientMessage(ChatColor.AQUA + "/sg add <이름> - 현재위치에 워프를 추가합니다.");
clientMessage(ChatColor.AQUA + "/sg remove <리스트 번호> - 등록된 해당 워프를 삭제합니다.");
clientMessage(ChatColor.AQUA + "/sg list - 워프에 등록된 리스트를 봅니다.");
break;
}
}
}

function commandSignAddList(x, y, z, name) {
warp.warpX.push(x);
warp.warpY.push(y);
warp.warpZ.push(z);
warp.name.push(name);
clientMessage(ChatColor.YELLOW + "[워프이름:" + ChatColor.GOLD + name + ChatColor.YELLOW + "][X:" + ChatColor.GOLD + Math.round(x) + ChatColor.YELLOW + "][Y:" + ChatColor.GOLD + Math.round(y) + ChatColor.YELLOW + "][Z:" + ChatColor.GOLD + Math.round(z) + ChatColor.YELLOW + "]"); 

for(var i=0; i<warp.name.length; i++) {
ModPE.saveData(("warpX" + i), warp.warpX[i]);
ModPE.saveData(("warpY" + i), warp.warpY[i]);
ModPE.saveData(("warpZ" + i), warp.warpZ[i]);
ModPE.saveData(("warpName" + i), warp.name[i]);
}
ModPE.saveData("warpIndex", warp.name.length);
}

function commandSignRemoveList(listNumber) {
if(listNumber <= 0 || listNumber > warp.name.length) {
clientMessage(ChatColor.RED + "값의 범위가 초과되었습니다.");
return;
}

clientMessage(ChatColor.YELLOW + "[이름:" + ChatColor.GOLD + warp.name[listNumber-1] + ChatColor.YELLOW + "][X:" + ChatColor.GOLD + Math.round(warp.warpX[listNumber-1]) + ChatColor.YELLOW + "][Y:" + ChatColor.GOLD + Math.round(warp.warpY[listNumber-1]) + ChatColor.YELLOW + "][Z:" + ChatColor.GOLD + Math.round(warp.warpZ[listNumber-1]) + ChatColor.YELLOW + "] 삭제완료"); 
warp.warpX.splice(listNumber-1, 1);
warp.warpY.splice(listNumber-1, 1);
warp.warpZ.splice(listNumber-1, 1);
warp.name.splice(listNumber-1, 1);

for(var i=listNumber-1; i<warp.name.length; i++) {
ModPE.saveData(("warpX" + i), warp.warpX[i]);
ModPE.saveData(("warpY" + i), warp.warpY[i]);
ModPE.saveData(("warpZ" + i), warp.warpZ[i]);
ModPE.saveData(("warpName" + i), warp.name[i]);
}

ModPE.saveData("warpIndex", warp.name.length);
}

function commandSignList() {
clientMessage(ChatColor.YELLOW + "=========[워프 리스트]=========");
for(var i=0; i<warp.name.length; i++)
clientMessage(ChatColor.YELLOW + "- [" + ChatColor.GOLD + (i+1) + ChatColor.YELLOW +"][이름:" + ChatColor.GOLD + warp.name[i] + ChatColor.YELLOW + "][X:" + ChatColor.GOLD + Math.round(warp.warpX[i]) + ChatColor.YELLOW + "][Y:" + ChatColor.GOLD + Math.round(warp.warpY[i]) + ChatColor.YELLOW + "][Z:" + ChatColor.GOLD + Math.round(warp.warpZ[i]) + ChatColor.YELLOW + "]"); 
}

function signCommand(x, y, z, player) {
switch(Level.getSignText(x, y, z, 0).toLowerCase()) {
case "move":
case "이동":
case "텔레포트":
case "teleport":
case "워프":
case "warp":
var signIndex = warp.name.indexOf(Level.getSignText(x, y, z, 1).toLowerCase());
if(signIndex != -1) 
playerTeleport(warp.warpX[signIndex], warp.warpY[signIndex], warp.warpZ[signIndex], player);

break;
}
}

function playerTeleport(x, y, z, player) {
var tpEntity = Level.spawnMob(x, y, z, 81);
Entity.rideAnimal(player, tpEntity);
}

function dataLoad() {
var warpIndex = ModPE.readData("warpIndex");

for(var i=0; i<warpIndex; i++) {
warp.warpX.push(ModPE.readData(("warpX" + i)))
warp.warpY.push(ModPE.readData(("warpY" + i)))
warp.warpZ.push(ModPE.readData(("warpZ" + i)))
warp.name.push(ModPE.readData(("warpName" + i)))
}
}












