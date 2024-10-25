export interface ResNetTicket {
  //description: string;
  number: string;
  short_description: string;
  sys_updated_on: string;
  lane: string;
  client_responded: boolean;
  is_stale: boolean;
  is_red: boolean;
}

export const lanes = [
  'New Unsorted',
  'Client Updated',
  'Device Enrollment',
  'Super long name that for some reason will not make any sense if shortened',
  'Lane 1',
  'Lane 2',
  'Lane 3',
];

export const ticketURL =
  'https://ucsc.service-now.com/now/nav/ui/classic/params/target/incident.do%3Fsysparm_query%3Dnumber%253D';
export const URL =
  window.location.protocol + '//' + window.location.hostname + ':3010';
