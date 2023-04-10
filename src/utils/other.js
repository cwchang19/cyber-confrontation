import service from "./request";

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
  if (!object || typeof object !== 'object') {
    return object;
  }

  let newObject = Array.isArray(object) ? [] : {};

  // 通过递归实现
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
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
  console.log(obj);
  // 解析 subnets 获取所有的子网和子网内主机的信息
  if (obj.subnets.length == obj.topology.length) {
    obj.subnets.splice(0, 1);
  }
  let subnets = {};
  let hostFirewall = [];
  for (let i = 1; i <= obj.subnets.length; i++) {
    subnets[i] = { hosts: {}, total: obj.subnets[i - 1] };
    for (let j = 0; j < obj.subnets[i - 1]; j++) {
      let hostKey = '(' + i + ', ' + j + ')';
      subnets[i].hosts[j] = {};
      subnets[i].hosts[j]['os'] = Object.keys(obj.host_configurations[hostKey].os)[0];
      subnets[i].hosts[j]['processes'] = Object.keys(obj.host_configurations[hostKey].processes);
      subnets[i].hosts[j]['services'] = Object.keys(obj.host_configurations[hostKey].services);
      subnets[i].hosts[j]['value'] = obj.host_configurations[hostKey].value || 0;
      subnets[i].hosts[j]['isSensitive'] = false;
      subnets[i].hosts[j]['sensitiveVal'] = 0.01;
      if (obj.host_configurations[hostKey].firewall) {
        // let newFirewall = [];
        // for(let key in subnets[i].hosts[j].firewall) {
        //   let [subnet_num, host_num] = getKeyNum(key);
        //   newFirewall.push({
        //     subnet_num,
        //     host_num,
        //     types: subnets[i].hosts[j].firewall[key]
        //   })
        //   subnets[i].hosts[j].firewall = newFirewall;
        // }
        for (let fwKey in obj.host_configurations[hostKey].firewall) {
          let [targetSubnet, targetHost] = getKeyNum(fwKey);
          hostFirewall.push({
            sourceSubnet: `${i}`,
            sourceHost: `${j}`,
            targetSubnet: targetSubnet,
            targetHost: targetHost,
            services: obj.host_configurations[hostKey].firewall[fwKey]
          })
        }
      }
    }
  }

  // 解析目标主机（敏感主机）,给 subnets 中的对应主机添加 isSensitive 属性，以及 sensitiveVal 属性
  for (let key in obj.sensitive_hosts) {
    let [subnet_num, host_num] = getKeyNum(key);
    subnets[subnet_num].hosts[host_num]['isSensitive'] = true;
    subnets[subnet_num].hosts[host_num]['sensitiveVal'] = obj.sensitive_hosts[key];
  }

  // 解析所有拓扑结构，转换邻接矩阵
  let topology = {};
  for (let i = 0; i < obj.topology.length; i++) {
    topology[i] = [];
    for (let j = 0; j < obj.topology[i].length; j++) {
      if (obj.topology[i][j] == 1) {
        topology[i].push('' + j);
      }
    }
  }

  // 解析防火墙
  let subnetFirewall = [];
  for (let key in obj.firewall) {
    let [source, target] = getKeyNum(key);
    subnetFirewall.push({
      source,
      target,
      services: obj.firewall[key]
    })
  }

  // 解析漏洞 exploits
  let exploits = [];
  for (let exploit in obj.exploits) {
    exploits.push(obj.exploits[exploit]);
  }

  // 解析权限提升 privilege_escalation
  let privilege_escalation = [];
  for (let pe in obj.privilege_escalation) {
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
    subnetFirewall,
    hostFirewall,
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
  // console.log(obj);

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
  if (obj.exploits) {
    obj.exploits.forEach((exploit, index) => {
      let key = `e_${exploit.service}_${index}`;
      exploits[key] = exploit;
      if (exploits[key].os == null) {
        exploits[key].os = 'none';
      }
    });
  }

  if (obj.privilege_escalation) {
    obj.privilege_escalation.forEach((pe, index) => {
      let key = `pe_${pe.process}_${index}`;
      privilege_escalation[key] = pe;
      if (privilege_escalation[key].os == null) {
        privilege_escalation[key].os = 'none';
      }
    })
  }

  // 再处理需要复杂转换的属性
  // 先构建子网的 key 和其下标的映射表，同时构建子网中主机的 key 和下标的映射表
  let subnetMap = new Map();
  subnetMap.set('0', { index: 0 });
  let subnetIndex = 1;
  for (let subnetKey in obj.subnets) {
    let hostMap = new Map();
    let hostIndex = 0;
    for (let hostKey in obj.subnets[subnetKey].hosts) {
      hostMap.set(hostKey, { index: hostIndex++ });
    }
    subnetMap.set(subnetKey, { index: subnetIndex++, hostMap });
  }

  // 遍历所有子网
  subnets = new Array(subnetMap.size - 1);
  for (let subnetKey in obj.subnets) {
    // 根据 subnetKey 获取子网在 subnetMap 中的映射
    let tempSubnet = subnetMap.get(subnetKey);
    // 记录子网内的主机数
    subnets[tempSubnet.index - 1] = tempSubnet.hostMap.size;
    // 遍历子网内的主机
    for (let hostKey in obj.subnets[subnetKey].hosts) {
      // 根据 hostKey 获取主机在 hostMap 中的映射
      let tempHost = tempSubnet.hostMap.get(hostKey);
      let key = `(${tempSubnet.index}, ${tempHost.index})`;
      let host = obj.subnets[subnetKey].hosts[hostKey];
      // 如果主机设置了 firewall ，则需要进行处理
      if (host.firewall) {
        let hostFirewall = {};
        host.firewall = hostFirewall;
      }
      // 如果是敏感主机，添加到 sensitive_hosts 中，并且移除 isSensitive 和 sensitiveVal 属性
      if (host.isSensitive) {
        let sensitiveKey = `(${tempSubnet.index}, ${tempHost.index})`;
        sensitive_hosts[sensitiveKey] = host.sensitiveVal;
        delete host.value;
      }
      delete host.isSensitive;
      delete host.sensitiveVal;

      os.add(host.os);
      for (let service of host.services) {
        services.add(service);
      }
      for (let process of host.processes) {
        processes.add(process);
      }
      host_configurations[key] = host;
    }
  }

  // 处理主机间防火墙
  if (obj.hostFirewall) {
    for (let i = 0; i < obj.hostFirewall.length; i++) {
      let sourceSubnet = subnetMap.get(obj.hostFirewall[i].sourceSubnet);
      let targetSubnet = subnetMap.get(obj.hostFirewall[i].targetSubnet)
      let sourceKey = `(${sourceSubnet.index}, ${sourceSubnet.hostMap.get(obj.hostFirewall[i].sourceHost).index})`;
      let targetKey = `(${targetSubnet.index}, ${targetSubnet.hostMap.get(obj.hostFirewall[i].targetHost).index})`;
      if (host_configurations[sourceKey].firewall) {
        if (host_configurations[sourceKey].firewall[targetKey]) {
          host_configurations[sourceKey].firewall[targetKey].push(...obj.hostFirewall[i].services);
        } else {
          host_configurations[sourceKey].firewall[targetKey] = obj.hostFirewall[i].services;
        }
      } else {
        host_configurations[sourceKey]['firewall'] = {};
        host_configurations[sourceKey].firewall[targetKey] = obj.hostFirewall[i].services;
      }
    }
  }
  // 主机间防火墙去重以及判断是否合法
  for (let hostKey in host_configurations) {
    if (host_configurations[hostKey].firewall) {
      for (let fw in host_configurations[hostKey].firewall) {
        let fwSet = new Set(host_configurations[hostKey].firewall[fw]);
        let resSet = new Set([...fwSet].filter(x => services.has(x)));
        host_configurations[hostKey].firewall[fw] = [...resSet];
      }
    } 
  }
  console.log(host_configurations);

  os = Array.from(os);
  services = Array.from(services);
  processes = Array.from(processes);

  // 处理 topology
  topology = new Array(subnets.length + 1);
  topology[0] = new Array(subnets.length + 1).fill(0);
  topology[0][0] = 1;
  for (let currentSubnetKey in obj.topology) {
    let currentIndex = subnetMap.get(currentSubnetKey).index;
    topology[currentIndex] = new Array(subnets.length + 1).fill(0);
    for (let targetSubnetKey of obj.topology[currentSubnetKey]) {
      let targetIndex = subnetMap.get(targetSubnetKey).index;
      if (targetIndex == 0) {
        topology[0][currentIndex] = 1;
        if(currentIndex != 0) firewall[`(0, ${currentIndex})`] = services;
      }
      topology[currentIndex][targetIndex] = 1;
      if (currentIndex != targetIndex) {
        firewall[`(${currentIndex}, ${targetIndex})`] = services;
      }
    }
  }

  // 处理子网间防火墙
  let tempFirewall = {};
  if (obj.subnetFirewall) {
    for (let i = 0; i < obj.subnetFirewall.length; i++) {
      let source = subnetMap.get(obj.subnetFirewall[i].source);
      let target = subnetMap.get(obj.subnetFirewall[i].target);
      let key = `(${source.index}, ${target.index})`;
      if (tempFirewall[key]) {
        for (let item of obj.subnetFirewall[i].services) {
          tempFirewall[key].add(item);
        }
      } else {
        tempFirewall[key] = new Set(obj.subnetFirewall[i].services);
      }
    }
  }
  for (let key in tempFirewall) {
    let resSet = new Set([...tempFirewall[key]].filter(x => services.includes(x)));
    firewall[key] = [...resSet];
  }

  // exploits['e_ssh'] = {
  //   // service: 'ssh',
  //   // os: 'linux',
  //   service: services[0],
  //   os: os[0],
  //   prob: 0.8,
  //   cost: 1,
  //   access: 'user'
  // }
  // privilege_escalation['pe_tomcat'] = {
  //   // process: 'tomcat',
  //   // os: 'linux',
  //   process: processes[0],
  //   os: os[0],
  //   prob: 1.0,
  //   cost: 1,
  //   access: 'root',
  // }

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
  for (let subnetKey in obj) {
    data.push({
      name: `${subnetKey}`,
      itemStyle: { color: '#91cc75' },
      label: {
        position: 'inside',
        color: 'white',
        formatter: '子网{b}',
        fontWeight: 'bold',
        fontSize: 14,
      }
    })
  }
  return data;
}

export function parseTopology(obj) {
  let links = [];
  for (let firstSubnetKey in obj) {
    let key1 = parseInt(firstSubnetKey);
    for (let secondSubnetKey of obj[firstSubnetKey]) {
      if (parseInt(secondSubnetKey) > key1) {
        links.push({
          source: firstSubnetKey,
          target: secondSubnetKey,
          lineStyle: { color: '#909399' },
        })
      }
    }
  }
  return links;
}

export function useTimeFormat(time) {
  if (time[0] == '-') {
    return '0 小时 00 分钟 00 秒';
  }
  let result = time.split('.');
  result.pop();
  result = result[0].split(':');
  result = result[0] + ' 小时 ' + result[1] + ' 分钟 ' + result[2] + ' 秒 ';
  return result;
}

export function startTimeFormat(datetime) {
  let [date, time] = datetime.split('T');
  time = time.split('.');
  time.pop();
  time.join();
  let result = date + ' ' + time;
  return result;
}

export function debounce(func, wait, immediate) {
  let timeout;

  return function () {
    let context = this;
    let args = arguments;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) {
        func.apply(context, args);
      }
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  }
}