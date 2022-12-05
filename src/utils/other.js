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
  // console.log(treeList);
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

function getKeyNum(key) {
  let [x, y] = key.match(/\d+/g);
  return [x, y];
}

export function parseScenarioJSON(obj) {

  // 解析 subnets 获取所有的子网和子网内主机的信息
  if(obj.subnets.length == obj.topology.length) {
    obj.subnets.splice(0, 1);
  }
  let subnets = {};
  for(let i=1; i<=obj.subnets.length; i++) {
    subnets[i] = { hosts: {}, total: obj.subnets[i-1] };
    for(let j=0; j<obj.subnets[i-1]; j++) {
      let hostKey = '(' + i + ', ' + j + ')';
      subnets[i].hosts[j] = {};
      subnets[i].hosts[j]['os'] = Object.keys(obj.host_configurations[hostKey].os)[0];
      subnets[i].hosts[j]['processes'] = Object.keys(obj.host_configurations[hostKey].processes);
      subnets[i].hosts[j]['services'] = Object.keys(obj.host_configurations[hostKey].services);
      subnets[i].hosts[j]['value'] = obj.host_configurations[hostKey].value || 0;
      if(subnets[i].hosts[j].firewall) {
        let newFirewall = [];
        for(let key in subnets[i].hosts[j].firewall) {
          let [subnet_num, host_num] = getKeyNum(key);
          newFirewall.push({
            subnet_num,
            host_num,
            types: subnets[i].hosts[j].firewall[key]
          })
          subnets[i].hosts[j].firewall = newFirewall;
        }
      }
    }
  }
  
  // 解析目标主机（敏感主机）,给 subnets 中的对应主机添加 isSensitive 属性，以及 sensitiveVal 属性
  for(let key in obj.sensitive_hosts) {
    let [subnet_num, host_num] = getKeyNum(key);
    subnets[subnet_num].hosts[host_num]['isSensitive'] = true;
    subnets[subnet_num].hosts[host_num]['sensitiveVal'] = obj.sensitive_hosts[key];
  }

  // 解析所有拓扑结构，转换邻接矩阵
  let topology = {};
  for(let i=0; i<obj.topology.length; i++) {
    topology[i] = [];
    for(let j=0; j<obj.topology[i].length; j++) {
      if(obj.topology[i][j] == 1) {
        topology[i].push('' + j);
      }
    }
  }

  // 解析防火墙
  let firewall = [];
  for(let key in obj.firewall) {
    let [first_subnet_num, second_subnet_num] = getKeyNum(key);
    firewall.push({
      first_subnet_num,
      second_subnet_num,
      types: obj.firewall[key]
    })
  }

  // 解析漏洞 exploits
  let exploits = [];
  for(let exploit in obj.exploits) {
    exploits.push(obj.exploits[exploit]);
  }

  // 解析权限提升 privilege_escalation
  let privilege_escalation = [];
  for(let pe in obj.privilege_escalation) {
    privilege_escalation.push(obj.privilege_escalation[pe]);
  }

  // 其余参数无需处理，直接赋值
  let service_scan_cost = obj.service_scan_cost || 0;
  let os_scan_cost = obj.os_scan_cost || 0;
  let subnet_scan_cost = obj.subnet_scan_cost || 0;
  let process_scan_cost = obj.process_scan_cost || 0;
  let step_limit = obj.step_limit || 0;
  let name = obj.name;
  let id = obj.id;

  return {
    id,
    name,
    subnets,
    topology,
    firewall,
    exploits,
    privilege_escalation,
    service_scan_cost,
    os_scan_cost,
    subnet_scan_cost,
    process_scan_cost,
    step_limit
  };
}

export function stringifyScenarioJSON(obj) {
  
  // 首先处理无需转换的属性
  let os_scan_cost = obj.os_scan_cost || 1;
  let service_scan_cost = obj.service_scan_cost || 1;
  let process_scan_cost = obj.process_scan_cost || 1;
  let subnet_scan_cost = obj.subnet_scan_cost || 1;
  let step_limit = obj.step_limit || 1000;

  // 接着处理需要转换的属性
  let subnets;
  let topology;
  let sensitive_hosts = {};
  let os = new Set();
  let services = new Set();
  let processes = new Set();
  let host_configurations = {};
  let exploits = {};
  let privilege_escalation = {};
  let firewall = {};

  // 先处理只需简单转换的属性
  if(obj.exploits) {
    obj.exploits.forEach((exploit, index) => {
      let key = `e_${exploit.service}_${index}`;
      exploits[key] = exploit;
    });
  }

  if(obj.privilege_escalation) {
    obj.privilege_escalation.forEach((pe, index) => {
      let key = `pe_${pe.process}_${index}`;
      privilege_escalation[key] = pe;
    })
  }

  // 再处理需要复杂转换的属性
  // 先构建子网的 key 和其下标的映射表，同时构建子网中主机的 key 和下标的映射表
  let subnetMap = new Map();
  subnetMap.set('0', { index: 0 });
  let subnetIndex = 1;
  for(let subnetKey in obj.subnets) {
    let hostMap = new Map();
    let hostIndex = 0;
    for(let hostKey in obj.subnets[subnetKey].hosts) {
      hostMap.set(hostKey, { index: hostIndex++ });
    }
    subnetMap.set(subnetKey, { index: subnetIndex++, hostMap });
  }

  // 遍历所有子网
  subnets = new Array(subnetMap.size-1);
  for(let subnetKey in obj.subnets) {
    // 根据 subnetKey 获取子网在 subnetMap 中的映射
    let tempSubnet = subnetMap.get(subnetKey);
    // 记录子网内的主机数
    subnets[tempSubnet.index-1] = tempSubnet.hostMap.size;
    // 遍历子网内的主机
    for(let hostKey in obj.subnets[subnetKey].hosts) {
      // 根据 hostKey 获取主机在 hostMap 中的映射
      let tempHost = tempSubnet.hostMap.get(hostKey);
      let key = `(${tempSubnet.index}, ${tempHost.index})`;
      let host = obj.subnets[subnetKey].hosts[hostKey];
      // 如果主机设置了 firewall ，则需要进行处理
      if(host.firewall) {
        let hostFirewall = {};
        // for(let hFirewall of host.firewall) {
        //   // 需要获取目标子网和目标主机的映射
        //   let tempTargetSubnet = subnetMap.get(hFirewall.subnet_num);
        //   let hFirewallKey = `(${tempTargetSubnet.index}, ${tempTargetSubnet.hostMap.get(hFirewall.host_num).index})`;
        //   hostFirewall[hFirewallKey] = hFirewall.types;
        // }
        host.firewall = hostFirewall;
      }
      // 如果是敏感主机，添加到 sensitive_hosts 中，并且移除 isSensitive 和 sensitiveVal 属性
      if(host.isSensitive) {
        let sensitiveKey = `(${tempSubnet.index}, ${tempHost.index})`;
        sensitive_hosts[sensitiveKey] = host.sensitiveVal;
      }
      delete host.isSensitive;
      delete host.sensitiveVal;

      os.add(host.os);
      for(let service of host.services) {
        services.add(service);
      }
      for(let process of host.processes) {
        processes.add(process);
      }
      host_configurations[key] = host;
    }
  }
  os = Array.from(os);
  services = Array.from(services);
  processes = Array.from(processes);

  // 处理 topology
  topology = new Array(subnets.length+1);
  topology[0] = new Array(subnets.length+1).fill(0);
  topology[0][0] = 1;
  for(let currentSubnetKey in obj.topology) {
    let currentIndex = subnetMap.get(currentSubnetKey).index;
    topology[currentIndex] = new Array(subnets.length+1).fill(0);
    for(let targetSubnetKey of obj.topology[currentSubnetKey]) {
      let targetIndex = subnetMap.get(targetSubnetKey).index;
      if(targetIndex == 0) {
        topology[0][currentIndex] = 1;
        firewall[`(0, ${currentIndex})`] = ['ssh'];
      }
      topology[currentIndex][targetIndex] = 1;
      if(currentIndex != targetIndex) {
        firewall[`(${currentIndex}, ${targetIndex})`] = ['ssh'];
      }
    }
  }

  // 处理 firewall
  // if(obj.firewall) {
  //   for(let item of obj.firewall) {
  //     let firstSubnetIndex = subnetMap.get(item.first_subnet_num).index;
  //     let secondSubnetIndex = subnetMap.get(item.second_subnet_num).index;
  //     let key = `(${firstSubnetIndex}, ${secondSubnetIndex})`;
  //     firewall[key] = item.types;
  //   }
  // }

  return {
    subnets,
    topology,
    sensitive_hosts,
    os,
    services,
    processes,
    exploits,
    privilege_escalation,
    service_scan_cost,
    os_scan_cost,
    subnet_scan_cost,
    process_scan_cost,
    host_configurations,
    firewall,
    step_limit
  }
  
}

export function parseSubnets(obj) {
  let data = [];
  for(let subnetKey in obj) {
    data.push({
      name: `${subnetKey}`,
      itemStyle: { color: '#91cc75' }
    })
  }
  return data;
}

export function parseTopology(obj) {
  let links = [];
  for(let firstSubnetKey in obj) {
    let key1 = parseInt(firstSubnetKey);
    for(let secondSubnetKey of obj[firstSubnetKey]) {
      if(parseInt(secondSubnetKey) > key1) {
        links.push({
          source: firstSubnetKey,
          target: secondSubnetKey
        })
      }
    }
  }
  return links;
}