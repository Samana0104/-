var isTouchLocation = false;

function useItem(x, y, z, itemid, blockid, side, itemDamage, blockDamage) {
if(isTouchLocation)
clientMessage(ChatColor.YELLOW + "[x = " + ChatColor.GOLD + x + ChatColor.YELLOW + "][y = " + ChatColor.GOLD + y + ChatColor.YELLOW + "][z = " + ChatColor.GOLD + z + ChatColor.YELLOW + "][code = " + ChatColor.GOLD + blockid + ChatColor.YELLOW + "]"); 
}

function modTick() {
ModPE.showTipMessage(ChatColor.YELLOW + "           " + "\n\n\n\n\n\n\n[X:" + ChatColor.GOLD + parseInt(Player.getX()) + ChatColor.YELLOW + "][Y:" + ChatColor.GOLD + (parseInt(Player.getY()) - 1) + ChatColor.YELLOW + "][Z:" + ChatColor.GOLD + parseInt(Player.getZ()) + ChatColor.YELLOW + "]");    
}

function procCmd(str) {
var command = str.split(" ");

switch(str) {
case "touch":
if(isTouchLocation) {
isTouchLocation = false;
clientMessage(ChatColor.AQUA + "터치시 좌표가 뜨지 않습니다.");
} else {
isTouchLocation = true;
clientMessage(ChatColor.AQUA + "터치시 좌표가 뜹니다.");
}
break;
}
}

