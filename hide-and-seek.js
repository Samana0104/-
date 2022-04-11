/*
숨박꼭질(이게임을 한다면 이글을 복사해서 톡방에 올리시길 바랍니다.)

1.처음 시작시 술래가 무작위로 결정됩니다.

2.도망가는사람은 은신이 걸립니다.

3.술래는 멀미버프가 걸리며 버프가 걸리는 나오는 거품으로 잡아야됩니다.

4.게임 시작시 막대기(유인용)를 지급합니다. 그러니 시작전에 플레이어끼리 서로
같은 위치에 있지 마시길 바랍니다.

5.술래가 나가면 무작위로 술래가 결정됩니다.

6.중참을 할수 있습니다. 하지만 술래로 됩니다.
*/

var thread  = {
timerList : new Array(),
dataList : new Array()
};

var playerList = new Array();

var isStartGame = false;

var taggerPlayerIndex = -1;
var taggerSpawnX, taggerSpawnY, taggerSpawnZ;
var isTaggerSpawnSet = false;

var gameTimeM = 5, gameTimeS = 0;

function newLevel(hasLevel) {
clientMessage(ChatColor.AQUA + "[숨박꼭질]명령어는 /gh");
}

function useItem(x, y, z, itemid, blockid, side, itemDamage, blockDamage) {
if(itemid == 405) {
Entity.setCarriedItem(Player.getEntity(), 0, 0);
taggerSpawnX = x;
taggerSpawnY = y+1;
taggerSpawnZ = z;
isTaggerSpawnSet = true;
clientMessage(ChatColor.AQUA + "[X:" + taggerSpawnX + "][Y:" + taggerSpawnY + "][Z:" + taggerSpawnZ + "]에 스폰위치를 설정했습니다.");  
}
}

function destroyBlock(x, y, z, side) {
if(isStartGame)
preventDefault(); 
}

function attackHook(attacker, victim) {
if(isStartGame) {
if(playerList[taggerPlayerIndex] == attacker) {
taggerChange(attacker, victim);
} else {
preventDefault();
return;
}
}
}

function entityAddedHook(ent) {
if(Player.isPlayer(ent)) {
playerList.push(ent);
playerRemoveEffect(ent);

if(isStartGame) {
playerItem(ent, 280, 1);
taggerChange(playerList[taggerPlayerIndex], ent);
clientMessage(ChatColor.RED + Player.getName(ent) + "님이 중참으로 인해 술래가 되셨습니다.");
}
}
}


function modTick() { 
for(var i=0; i<thread.dataList.length; i++) { // 타이머관련

switch(thread.dataList[i]) {
case "count":
if(thread.timerList[i] % 20 == 0) 
clientMessage(ChatColor.AQUA + thread.timerList[i] / 20);

break;

case "time":
if(thread.timerList[i] / 20 == 5 && thread.timerList[i] % 20 == 0)
timerAddList(5, "count"); 

if(thread.timerList[i] == 0) 
commandStop();

break;

case "refresh":
if(thread.timerList[i] == 0) {
refreshPlayer();
thread.timerList[i] += 20;
}

break;
}
}

for(var i=0; i<thread.dataList.length; i++)
thread.timerList[i]--;

}

function procCmd(str) {
var command = str.split(" ");

if(command[0] == "gh") {
switch(command[1]) {
case "start":
commandStart();
break;

case "stop":
commandStop();
break;

case "list":
refreshPlayer();
commandList();
break;

case "set":
commandSet(command);
break;

default:
clientMessage(ChatColor.AQUA + "/gh start - 게임을 시작합니다.");
clientMessage(ChatColor.AQUA + "/gh stop - 게임을 종료합니다.");
clientMessage(ChatColor.AQUA + "/gh list - 참가자 리스트를 보여줍니다.");
clientMessage(ChatColor.AQUA + "/gh set - 게임을 설정하는 명령어를 보여줍니다.");
}    
}
}

function commandSet(command) {
switch(command[2]) {
case "spawn":
Player.addItemInventory(405, 0);
clientMessage(ChatColor.AQUA + "설정할 위치를 벽돌로 터치해주세요");
break;

case "time":
if(command.length <= 3) {
clientMessage(ChatColor.AQUA + "/gh set time <시간:초>");
return;
} else {
timeSecondOrMinuteChange(parseInt(command[3]));
clientMessage(ChatColor.AQUA + "시간[" + ChatColor.AQUA + gameTimeM + "분" + ChatColor.AQUA + "][" + ChatColor.AQUA + gameTimeS + "초" + ChatColor.AQUA + "]으로 설정되었습니다.");  
}
break;

case "info":
clientMessage(ChatColor.YELLOW + "=====[true -> 적용 --- false -> 미적용]=====");
clientMessage(ChatColor.YELLOW + "술래 스폰 위치설정: " + ChatColor.GOLD + isTaggerSpawnSet);
clientMessage(ChatColor.YELLOW + "시간[" + ChatColor.GOLD + gameTimeM + "분" + ChatColor.YELLOW + "][" + ChatColor.GOLD + gameTimeS + "초" + ChatColor.YELLOW + "]");  
break;

default:
clientMessage(ChatColor.AQUA + "/gh set spawn - 술래 스폰위치를 설정합니다.");
clientMessage(ChatColor.AQUA + "/gh set time <시간:초> - 게임시간을 설정합니다.");
clientMessage(ChatColor.AQUA + "/gh set info - 설정에 대한 정보를 봅니다.");
}
}

function commandStart() {
if(!isTaggerSpawnSet) {
clientMessage(ChatColor.RED + "/gh set spawn 으로 술래스폰 위치를 설정해주세요.");
return;
} else if(isStartGame) {
clientMessage(ChatColor.YELLOW + "게임이 이미 실행중입니다.");
return;
}

isStartGame = true;

refreshPlayer();
allPlayerRemoveEffect();
randomTaggerPlayer();
notTaggerAllPlayerEffect();
allPlayerItem(280, 1);
timerAddList(1, "refresh");
timerAddList((gameTimeS + gameTimeM * 60), "time");
clientMessage(ChatColor.RED + Player.getName(playerList[taggerPlayerIndex]) + "님이 술래가 되셨습니다.");
}

function commandStop() {
if(!isStartGame) {
clientMessage(ChatColor.YELLOW + "게임이 이미 꺼진상태입니다.");
return;
}
isStartGame = false;

allPlayerRemoveEffect();
allTimerListRemove();
clientMessage(ChatColor.YELLOW + "게임이 종료 되었습니다.");
}

function commandList() {
clientMessage(ChatColor.YELLOW + "=============================");
for(var i=0; i<playerList.length; i++) {
if(isStartGame) {
if(i == taggerPlayerIndex) {
clientMessage(ChatColor.YELLOW + "[" + ChatColor.GOLD + (i+1) + ChatColor.YELLOW + "][이름:" + ChatColor.GOLD + Player.getName(playerList[i]) + ChatColor.YELLOW + "][술래:" + ChatColor.GOLD + "O" + ChatColor.YELLOW + "]");
continue;
}
clientMessage(ChatColor.YELLOW + "[" + ChatColor.GOLD + (i+1) + ChatColor.YELLOW + "][이름:" + ChatColor.GOLD + Player.getName(playerList[i]) + ChatColor.YELLOW + "][술래:" + ChatColor.GOLD + "X" + ChatColor.YELLOW + "]");
} else {
clientMessage(ChatColor.YELLOW + "[" + ChatColor.GOLD + (i+1) + ChatColor.YELLOW + "][이름:" + ChatColor.GOLD + Player.getName(playerList[i]) + ChatColor.YELLOW + "]");
}
}
clientMessage(ChatColor.YELLOW + "=============================");
}

function randomTaggerPlayer() {
taggerPlayerIndex = randomNumber(0, playerList.length - 1);
playerRemoveEffect(playerList[taggerPlayerIndex]);

taggerSetEffect(playerList[taggerPlayerIndex]);
playerTeleport(taggerSpawnX, taggerSpawnY, taggerSpawnZ, playerList[taggerPlayerIndex]);
}

function taggerSetEffect(player) {
playerEffect(player, MobEffect.regeneration, 9999999, 4);
playerEffect(player, MobEffect.confusion, 9999999, 0);
}

function playerSetEffect(player) {
playerEffect(player, MobEffect.invisibility, 9999999, 9);
playerEffect(player, MobEffect.regeneration, 9999999, 4);
}

function taggerChange(taggerPlayer, caughtPlayer) {
playerRemoveEffect(taggerPlayer);
playerSetEffect(taggerPlayer);

taggerPlayerIndex = playerList.indexOf(caughtPlayer);
playerTeleport(taggerSpawnX, taggerSpawnY, taggerSpawnZ, caughtPlayer);
playerRemoveEffect(caughtPlayer);
taggerSetEffect(caughtPlayer);
}

function notTaggerAllPlayerEffect() {
for(var i=0; i<playerList.length; i++) {

if(i == taggerPlayerIndex)
continue;

playerSetEffect(playerList[i]);
}
}

function allPlayerRemoveEffect() {
for(var i=0; i<playerList.length; i++) 
playerRemoveEffect(playerList[i]);
}

function playerRemoveEffect(player) {
Entity.removeAllEffects(player);
playerEffect(player, MobEffect.blindness, 1, 1);
}

function playerEffect(player, effect, time, level) {
Entity.addEffect(player, effect, time, level, false, true);
}

function allPlayerItem(itemCode, amount) {
for(var i=0; i<playerList.length; i++) 
playerItem(playerList[i], itemCode, amount);
}

function playerItem(player, itemCode, amount) {
Level.dropItem(Entity.getX(player), Entity.getY(player), Entity.getZ(player), 0, itemCode, amount, 0);
}

function playerTeleport(x, y, z, player) {
var playerTpEntity = Level.spawnMob(x, y, z, 81);
Entity.rideAnimal(player, playerTpEntity);
}

function refreshPlayer() {
for(var i=0; i<playerList.length; i++) {
if(Entity.getX(playerList[i]) == 0 && Entity.getY(playerList[i]) == 0 && Entity.getZ(playerList[i]) == 0) {
if(isStartGame && Entity.getX(playerList[taggerPlayerIndex]) == 0 && Entity.getY(playerList[taggerPlayerIndex]) == 0 && Entity.getZ(playerList[taggerPlayerIndex]) == 0) {
playerList.splice(taggerPlayerIndex, 1);
randomTaggerPlayer();
clientMessage(ChatColor.RED + "술래가 나가서 " + Player.getName(playerList[taggerPlayerIndex]) + "님이 술래가 되었습니다.");

continue;
}

playerList.splice(taggerPlayerIndex, 1);
continue;
}

for(var j=0; j<playerList.length; j++) { // 리스트에 닉이 중복되는것을 방지
if(i == j)
continue;

if(Player.getName(playerList[i]) == Player.getName(playerList[j]))
playerList.splice(j, 1);
}
}
}

function randomNumber(min, max) {
var randomNumber = Math.round((Math.random() * max) + min);

while(randomNumber < min || randomNumber > max)
randomNumber = Math.round((Math.random() * max) + min);

return randomNumber;
}

function timerAddList(time, data) {
thread.timerList.push(time * 20);
thread.dataList.push(data);
}

function timerRemoveList(index) {
thread.timerList.splice(index, 1);
thread.dataList.splice(index, 1);
}

function allTimerListRemove() {
var arrSize = thread.dataList.length;

for(var i=arrSize-1; i>=0; i--)
timerRemoveList(i);
}

function timeSecondOrMinuteChange(second) {
gameTimeM = 0;

while(second >= 60) {
gameTimeM++;
second -= 60;
}

gameTimeS = second;
}

















