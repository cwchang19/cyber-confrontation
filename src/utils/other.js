export function arrayToTree1(items) {
  items.sort((a, b) => { return a.id - b.id });
  console.log(items);
  const result = [];   // 存放结果集
  const itemMap = {};  // 
  for (const item of items) {
    const id = item.id + '';
    const directory_parent_id = item.directory_parent_id;
    console.log(directory_parent_id);

    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      }
    }

    itemMap[id] = {
      ...item,
      children: itemMap[id]['children']
    }

    const treeItem = itemMap[id];

    if (directory_parent_id === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[directory_parent_id]) {
        itemMap[directory_parent_id] = {
          children: [],
        }
      }
      itemMap[directory_parent_id].children.push(treeItem)
    }

  }
  return result;
}

export function arrayToTree(items) {
  items.sort((a, b) => { 
    return parseInt(a.directory_parent_id) - parseInt(b.directory_parent_id) 
  });
  const treeList = []
  const map = {}

  items.forEach(item => {
    if (!item.children) {
      item.children = []
    }
    map[item.id] = item
  });

  items.forEach(item => {
    // 对于每一个元素来说，先找它的上级
    // 因为map中的对象键值名是以id为值的  所以如果当map的键值名===pid说明他是上级(如果她存在) 反之则是最顶级
    let parent = map[item.directory_parent_id]
    if (parent) {
      parent.children.push(item)
    } else {
      treeList.push(item)
    }
  })
  console.log(treeList);
  return treeList
}