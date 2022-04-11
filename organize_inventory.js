function useItem(x, y, z, itemid, blockid, side, itemDamage, blockDamage) {

}

function procCmd(str) {
var command = str.split(" ");

switch(command[0]) {

case "정리":
inventorySort();
break;

case "삭제":
inventoryClear();
break;
} 
}

function inventorySort() {
var inventorySort = new Array(35);

for(var i=9; i<=44; i++) {
inventorySort[i-9] = new Array(3);
inventorySort[i-9][0] = Player.getInventorySlot(i);
inventorySort[i-9][1] = Player.getInventorySlotCount(i);
inventorySort[i-9][2] = Player.getInventorySlotData(i);
Player.clearInventorySlot(i);
}

inventorySort.sort(function(a, b) { 
return (a[0] == b[0]) ? a[2] - b[2] : a[0] - b[0];
});

for(var i=0; i<inventorySort.length; i++)
Player.addItemInventory(inventorySort[i][0], inventorySort[i][1], inventorySort[i][2]);

clientMessage(ChatColor.YELLOW + "인벤토리가 깔끔해졌습니다.");
}

function inventoryClear() {
for(var i=9; i<=44; i++) 
Player.clearInventorySlot(i);

clientMessage(ChatColor.YELLOW + "인벤토리를 전부 삭제했습니다.");
}
