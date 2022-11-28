export function arrayToTree(items) {
  console.log(items);
  const result = [];   // 存放结果集
  const itemMap = {};  // 
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;

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

    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        }
      }
      itemMap[pid].children.push(treeItem)
    }

  }
  return result;
}

// 可用数据形式：
/*
subnets: {
  // 第零个子网预留给外部网络，在这里不定义
  // 第一个子网
  1: {
    // 主机列表
    hosts: {
      // 第一个主机
      0: {
        os: 'linux',
        services: ['ssh'],
        processes: ['tomcat'],
        // 防火墙，可选
        firewall: [
          { subnet_num: 3, host_num: 0, types: ['ssh'] }
        ],
        // 主机值，可选，默认为 0
        value: 0
      }
    },
    // 主机总数
    total: 1
  },
  // 第二个子网
  2: {
    // 主机列表
    hosts: {
      // 第一个主机
      0: {
        os: 'linux',
        services: ['ssh'],
        processes: ['tomcat'],
        firewall: [
          { subnet_num: 1, host_num: 0, types: ['ssh'] }
        ],
      }
    },
    // 主机总数
    total: 1
  },
  // 第三个子网
  3: {
    // 主机列表
    hosts: {
      // 第一个主机
      0: {
        os: 'linux',
        services: ['ssh'],
        processes: ['tomcat'],
      }
    },
    // 主机总数
    total: 1
  }
}
*/

function getKeyNums(key) {
  let [x, y] = key.match(/\d/g);
  return [x, y];
}
// export function parseScenarioJSON(obj) {

//   // 解析 subnets 获取所有的子网和子网内主机的信息
//   let subnets = [];
//   for(let i=0; i<obj.subnets.length; i++) {
//     subnets.push({
//       id: i+1,
//       hosts: [],
//       maxId: subnets[i],
//     })
//   }
//   for(let key in obj.host_configurations) {
//     let [subnetNum, hostNum] = getKeyNums(key);
//     console.log([subnetNum, hostNum])
//     subnets[subnetNum-1].hosts[hostNum] = obj.host_configurations[key];
//     subnets[subnetNum-1].hosts[hostNum].id = hostNum;
//   }
  
//   // 解析目标主机（敏感主机）,给 subnets 中的对应主机添加 isSensitive 属性，以及 sensitiveVal 属性
//   for(let key in obj.sensitive_hosts) {
//     let [subnetNum, hostNum] = getKeyNums(key);
//     subnets[subnetNum-1].hosts[hostNum]['isSensitive'] = true;
//     subnets[subnetNum-1].hosts[hostNum]['sensitiveVal'] = obj.sensitive_hosts[key];
//   }

//   // 解析所有拓扑结构，转换邻接矩阵
//   let topology = {};
//   for(let i=0; i<obj.topology.length; i++) {
//     topology[i] = [];
//     for(let j=0; j<obj.topology[i].length; j++) {
//       if(obj.topology[i][j] == 1) {
//         topology[i].push(j);
//       }
//     }
//   }

//   // 解析防火墙
//   let firewall = [];
//   for(let key in obj.firewall) {
//     let [firstSubnetNum, secondSubnetNum] = getKeyNums(key);
//     firewall.push({
//       firstSubnetNum,
//       secondSubnetNum,
//       types: obj.firewall[key]
//     })
//   }

//   // 解析漏洞 exploits
//   let exploits = [];
//   for(let key in obj.exploits) {
//     exploits.push(obj.exploits[key]);
//   }

//   // 解析权限提升 privilege_escalation
//   let privilege_escalation = [];
//   for(let key in obj.privilege_escalation) {
//     privilege_escalation.push(obj.privilege_escalation[key]);
//   }

//   // 其余参数无需处理，直接赋值
//   let service_scan_cost = obj.service_scan_cost || 0;
//   let os_scan_cost = obj.os_scan_cost || 0;
//   let subnet_scan_cost = obj.subnet_scan_cost || 0;
//   let process_scan_cost = obj.process_scan_cost || 0;
//   let step_limit = obj.step_limit || 0;

//   return {
//     subnets,
//     topology,
//     firewall,
//     exploits,
//     privilege_escalation,
//     service_scan_cost,
//     os_scan_cost,
//     subnet_scan_cost,
//     process_scan_cost,
//     step_limit
//   };
// }

// 解析后端返回的场景 JSON 为前端可使用对象
export function parseScenarioJSON(obj) {

  // 解析 subnets 获取所有的子网和子网内主机的信息
  let subnets = {};
  for(let i=1; i<=obj.subnets.length; i++) {
    subnets[i] = { hosts: {}, total: obj.subnets[i-1] };
    for(let j=0; j<obj.subnets[i-1]; j++) {
      let hostKey = '(' + i + ', ' + j + ')';
      subnets[i].hosts[j] = obj.host_configurations[hostKey];
      if(subnets[i].hosts[j].firewall) {
        let newFirewall = [];
        for(let key in subnets[i].hosts[j].firewall) {
          let [subnet_num, host_num] = getKeyNums(key);
          subnet_num = parseInt(subnet_num);
          host_num = parseInt(host_num);
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
    let [subnet_num, host_num] = getKeyNums(key);
    subnets[subnet_num].hosts[host_num]['isSensitive'] = true;
    subnets[subnet_num].hosts[host_num]['sensitiveVal'] = obj.sensitive_hosts[key];
  }

  // 解析所有拓扑结构，转换邻接矩阵
  let topology = {};
  for(let i=0; i<obj.topology.length; i++) {
    topology[i] = [];
    for(let j=0; j<obj.topology[i].length; j++) {
      if(obj.topology[i][j] == 1) {
        topology[i].push(j);
      }
    }
  }

  // 解析防火墙
  let firewall = [];
  for(let key in obj.firewall) {
    let [first_subnet_num, second_subnet_num] = getKeyNums(key);
    first_subnet_num = parseInt(first_subnet_num);
    second_subnet_num = parseInt(second_subnet_num);
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

  return {
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

// 转换前端场景对象为后端可接收 JSON
export function transformScenarioJSON(obj) {
  
}