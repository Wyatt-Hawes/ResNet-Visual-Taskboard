export interface ResNetTicket {
  //description: string;
  number: string;
  short_description: string;
  sys_updated_on: string;
  lane: string;
  client_responded: boolean;
  is_stale: boolean;
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
  ' https://slughub.ucsc.edu/incident.do?sysparm_query=number%3D';
export const URL =
  window.location.protocol + '//' + window.location.hostname + ':3010';
