export function arrayToTree(items) {
  items.sort((a, b) => { 
    return parseInt(a.id) - parseInt(b.id) 
  });
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

export function deepCopy(object) {
  if(!object || typeof object !== 'object') {
    return object;
  }
  
  let newObject = Array.isArray(object) ? [] : {};
  
  // 通过递归实现
  for(let key in object) {
    if(object.hasOwnProperty(key)) {
      newObject[key] = deepCopy(object[key]);
    }
  }
  
  return newObject;
}